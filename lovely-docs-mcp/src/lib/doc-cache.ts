import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import dbg from "debug";
import * as v from "valibot";

const debug = dbg("app:mcp:doc-cache");

const markdownVariantKeys = ["fulltext", "digest", "short_digest", "essence"] as const;
interface MarkdownVariants extends Partial<Record<(typeof markdownVariantKeys)[number], string>> {}

// Combined TreeNode and DocItem
export interface DocItem {
	displayName: string;
	origPath: string; // Original path in the documenatation.
	children: Record<string, DocItem>;
	relevant: boolean;
	token_counts?: {
		fulltext?: number;
		digest?: number;
		short_digest?: number;
	};
	usage?: {
		input: number;
		output: number;
		details?: any;
	};
	markdown: MarkdownVariants; // Contains digest, essence, etc.
}

export interface LibraryDBItem {
	name: string;
	source: {
		doc_dir?: string;
		repo?: string;
		commit?: string;
	};
	source_type: "git" | "web";
	date: string;
	model: string;
	commit: string;
	tree: DocItem;
	ecosystems: Array<string>;
	essence?: string;
}

export const cache = new Map<string, LibraryDBItem>();

// Valibot schemas for validation and types
type IndexNode = {
	displayName: string;
	origPath: string;
	relevant: boolean;
	usage?: {
		input: number;
		output: number;
		details?: any;
	};
	token_counts?: {
		fulltext?: number;
		digest?: number;
		short_digest?: number;
	};
	children: Record<string, IndexNode>; // index is the same as the safeName for the child.
};

const IndexNodeSchema: any = v.object({
	displayName: v.string(),
	origPath: v.string(),
	relevant: v.boolean(),
	usage: v.optional(
		v.object({
			input: v.number(),
			output: v.number(),
			details: v.optional(v.any()),
		})
	),
	token_counts: v.optional(
		v.object({
			fulltext: v.optional(v.number()),
			digest: v.optional(v.number()),
			short_digest: v.optional(v.number()),
		})
	),
	children: v.record(
		v.string(),
		v.lazy((): any => IndexNodeSchema)
	),
});

const IndexJsonDataSchema = v.object({
	name: v.string(),
	map: IndexNodeSchema,
	source: v.object({
		name: v.string(),
		doc_dir: v.optional(v.string()),
		repo: v.optional(v.string()),
		commit: v.optional(v.string()),
		comment: v.optional(v.string()),
	}),
	source_type: v.union([v.literal("git"), v.literal("web")]),
	date: v.string(),
	model: v.string(),
	commit: v.string(),
	ecosystems: v.optional(v.array(v.string())),
});

// Json comes with optional fields as null. Convert them to undefined.
function nullsToUndefined<T>(obj: T): T {
	if (obj === null) return undefined as T;
	if (typeof obj !== "object" || obj === undefined) return obj;
	if (Array.isArray(obj)) return obj.map(nullsToUndefined) as T;

	const result: any = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key] = nullsToUndefined(value);
	}
	return result;
}

type IndexJsonData = v.InferOutput<typeof IndexJsonDataSchema>;

async function loadMarkdownVariants(path: string): Promise<MarkdownVariants> {
	const variants: MarkdownVariants = {};

	for (const variant of markdownVariantKeys) {
		const filePath = join(path, variant + ".md");
		if (existsSync(filePath)) {
			try {
				const content = await readFile(filePath, "utf-8");
				variants[variant] = content;
				// debug(`Loaded ${variant} for ${fullPath}`);
			} catch (error) {
				console.warn(`Failed to read ${filePath}:`, error);
			}
		}
	}
	// debug("loadMarkdownVariants", Object.keys(variants));

	return variants;
}

async function buildTreeNode(path: string, node: IndexNode): Promise<DocItem> {
	const markdown = await loadMarkdownVariants(path);
	// debug(`${path} -> [${Object.keys(markdown).join(", ")}]`);

	const treeNode: DocItem = {
		displayName: node.displayName,
		origPath: node.origPath,
		children: {},
		relevant: node.relevant,
		token_counts: node.token_counts,
		usage: node.usage,
		markdown,
	};

	for (const [k, child] of Object.entries(node.children)) {
		const childTree = await buildTreeNode(join(path, k), child);
		treeNode.children[k] = childTree;
	}

	return treeNode;
}

export async function loadLibrary(libraryPath: string): Promise<LibraryDBItem> {
	debug(`Loading ${libraryPath}`);
	const indexPath = join(libraryPath, "index.json");

	const content = await readFile(indexPath, "utf-8");
	const json_content = nullsToUndefined(JSON.parse(content));

	const res = v.safeParse(IndexJsonDataSchema, json_content);
	if (res.success) {
		// Build tree structure
		const o = res.output;
		const root = await buildTreeNode(libraryPath, o.map);

		debug(`Loaded ${libraryPath} -> ${o.name}`);

		return {
			name: o.name,
			commit: o.commit,
			date: o.date,
			model: o.model,
			source: o.source,
			source_type: o.source_type,
			tree: root,
			ecosystems: o.ecosystems ?? [],
			essence: root.markdown.essence,
		};
	} else {
		debug(res.issues);
		throw Error;
	}
}

export async function loadLibrariesFromJson(path: string): Promise<void> {
	debug("Scanning libraries...");
	const entries = await readdir(path, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const libPath = join(path, entry.name);
		const indexPath = join(path, entry.name, "index.json");
		if (!existsSync(indexPath)) continue;

		try {
			const libraryCache = await loadLibrary(libPath);
			cache.set(entry.name, libraryCache);
		} catch (error) {
			debug(`Failed to load library ${entry.name}: %o`, error);
		}
	}

	debug(`Loaded ${cache.size} libraries, %o`);
}

export function getLibraries(): Map<
	string,
	{ name: string; source?: any; source_type?: string; ecosystems: string[]; essence?: string }
> {
	const res = new Map<
		string,
		{ name: string; source?: any; source_type?: string; ecosystems: string[]; essence?: string }
	>();
	for (const [key, lib] of cache) {
		res.set(key, {
			name: lib.name,
			source: lib.source,
			source_type: lib.source_type,
			ecosystems: lib.ecosystems,
			essence: lib.essence,
		});
	}
	debug(`getLibraries() -> %o`, res.size);
	return res;
}

export function getLibrary(name: string): LibraryDBItem | undefined {
	const res = cache.get(name);
	debug(`getLibrary(${name}) -> %o`, res?.name);
	return res;
}
