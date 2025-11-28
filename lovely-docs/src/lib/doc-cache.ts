import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import dbg from 'debug';
import * as v from 'valibot';

const debug = dbg('app:mcp:doc-cache');

export const markdownVariantKeys = ['fulltext', 'digest', 'short_digest', 'essence'] as const;

export type MarkdownLevel = (typeof markdownVariantKeys)[number];

export function isMarkdownLevel(level: unknown): level is MarkdownLevel {
	return typeof level === 'string' && (markdownVariantKeys as readonly string[]).includes(level);
}

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
	source_type: 'git' | 'web';
	date: string;
	model: string;
	commit: string;
	tree: DocItem;
	ecosystems: Array<string>;
	essence?: string;
}

export interface EssenceDocNode {
	essence?: string;
	children: Record<string, EssenceDocNode>;
}

export interface LibrarySummary {
	name: string;
	source?: any;
	source_type?: string;
	ecosystems: string[];
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
			details: v.optional(v.any())
		})
	),
	token_counts: v.optional(
		v.object({
			fulltext: v.optional(v.number()),
			digest: v.optional(v.number()),
			short_digest: v.optional(v.number())
		})
	),
	children: v.any() // Using v.any() since v.lazy() is not available in valibot 0.26.0
});

const IndexJsonDataSchema = v.object({
	name: v.string(),
	map: IndexNodeSchema,
	source: v.object({
		name: v.string(),
		doc_dir: v.optional(v.string()),
		repo: v.optional(v.string()),
		commit: v.optional(v.string()),
		comment: v.optional(v.string())
	}),
	source_type: v.union([v.literal('git'), v.literal('web')]),
	date: v.string(),
	model: v.string(),
	commit: v.string(),
	ecosystems: v.optional(v.array(v.string()))
});

// Json comes with optional fields as null. Convert them to undefined.
function nullsToUndefined<T>(obj: T): T {
	if (obj === null) return undefined as T;
	if (typeof obj !== 'object' || obj === undefined) return obj;
	if (Array.isArray(obj)) return obj.map(nullsToUndefined) as T;

	const result: any = {};
	for (const [key, value] of Object.entries(obj)) {
		result[key] = nullsToUndefined(value);
	}
	return result;
}

type IndexJsonData = v.Output<typeof IndexJsonDataSchema>;

async function loadMarkdownVariants(path: string): Promise<MarkdownVariants> {
	const variants: MarkdownVariants = {};

	for (const variant of markdownVariantKeys) {
		const filePath = join(path, variant + '.md');
		if (existsSync(filePath)) {
			try {
				const content = await readFile(filePath, 'utf-8');
				variants[variant] = content;
			} catch (error) {
				console.error(`Failed to read ${filePath}:`, error);
			}
		}
	}

	return variants;
}

async function buildTreeNode(path: string, node: IndexNode): Promise<DocItem> {
	const markdown = await loadMarkdownVariants(path);

	const treeNode: DocItem = {
		displayName: node.displayName,
		origPath: node.origPath,
		children: {},
		relevant: node.relevant,
		token_counts: node.token_counts,
		usage: node.usage,
		markdown
	};

	for (const [k, child] of Object.entries(node.children)) {
		const childTree = await buildTreeNode(join(path, k), child);
		treeNode.children[k] = childTree;
	}

	return treeNode;
}

export async function loadLibrary(libraryPath: string): Promise<LibraryDBItem> {
	debug(`Loading ${libraryPath}`);
	const indexPath = join(libraryPath, 'index.json');

	const content = await readFile(indexPath, 'utf-8');
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
			essence: root.markdown.essence
		};
	} else {
		debug(res.issues);
		throw new Error(`Failed to parse '${indexPath}'`);
	}
}

export async function loadLibrariesFromJson(path: string): Promise<Map<string, LibraryDBItem>> {
	debug('Scanning libraries...');
	const entries = await readdir(path, { withFileTypes: true });
	const libraries = new Map<string, LibraryDBItem>();

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		const libPath = join(path, entry.name);
		const indexPath = join(path, entry.name, 'index.json');
		if (!existsSync(indexPath)) continue;

		try {
			const libraryCache = await loadLibrary(libPath);
			libraries.set(entry.name, libraryCache);
		} catch (error) {
			debug(`Failed to load library ${entry.name}: %o`, error);
		}
	}

	debug(`Loaded ${libraries.size} libraries`);
	return libraries;
}

function buildEssenceTree(node: DocItem): EssenceDocNode | null {
	const children: Record<string, EssenceDocNode> = {};
	for (const [key, child] of Object.entries(node.children)) {
		const childEssence = buildEssenceTree(child);
		if (childEssence) children[key] = childEssence;
	}

	const hasRelevantChild = Object.keys(children).length > 0;
	const isRelevant = node.relevant || hasRelevantChild;
	if (!isRelevant) return null;

	return {
		essence: node.markdown.essence,
		children
	};
}

// Get a tree of pages for a library, optionally with essence for each node.
export function getRelevantEssenceSubTree(
	libraries: Map<string, LibraryDBItem>,
	libraryName: string,
	rootPath: string
): EssenceDocNode | undefined {
	const lib = libraries.get(libraryName);
	if (!lib) return undefined;
	const normPath = normalizePath(rootPath);
	const rootNode = findNodeByPath(lib.tree, normPath);
	if (!rootNode) return undefined;
	const tree = buildEssenceTree(rootNode);
	return tree ?? undefined;
}

export interface PageNodeSummary {
	origPath: string;
	displayName: string;
	essence?: string;
}

export interface LibraryFilterOptions {
	includeLibs?: string[];
	includeEcosystems?: string[];
	excludeLibs?: string[];
	excludeEcosystems?: string[];
}

export function getLibrarySummaries(libraries: Map<string, LibraryDBItem>): Map<string, LibrarySummary> {
	const res = new Map<string, LibrarySummary>();
	for (const [key, lib] of libraries) {
		res.set(key, {
			name: lib.name,
			source: lib.source,
			source_type: lib.source_type,
			ecosystems: lib.ecosystems,
			essence: lib.essence
		});
	}
	debug(`getLibrarySummaries() -> %o`, res.size);
	return res;
}

export function filterLibraries(libs: Map<string, LibrarySummary>, options: LibraryFilterOptions): Map<string, LibrarySummary> {
	let res = new Map(libs);
	const includeLibs = new Set(options.includeLibs ?? []);
	const includeEcosystems = new Set(options.includeEcosystems ?? []);
	const excludeLibs = new Set(options.excludeLibs ?? []);
	const excludeEcosystems = new Set(options.excludeEcosystems ?? []);

	if (includeLibs.size > 0) {
		res = new Map(Array.from(res.entries()).filter(([key]) => includeLibs.has(key)));
	}
	if (includeEcosystems.size > 0) {
		res = new Map(Array.from(res.entries()).filter(([, lib]) => lib.ecosystems.some((eco) => includeEcosystems.has(eco))));
	}
	if (excludeLibs.size > 0) {
		for (const key of excludeLibs) res.delete(key);
	}
	if (excludeEcosystems.size > 0) {
		res = new Map(
			Array.from(res.entries()).filter(([, lib]) => {
				if (lib.ecosystems.length === 0) return true;
				const allExcluded = lib.ecosystems.every((eco) => excludeEcosystems.has(eco));
				return !allExcluded;
			})
		);
	}

	return res;
}

export function getEcosystems(libraries: Map<string, LibrarySummary>): Set<string> {
	const ecosystems = new Set<string>();
	for (const lib of libraries.values()) {
		for (const eco of lib.ecosystems) {
			ecosystems.add(eco);
		}
	}
	return ecosystems;
}

export function filterEcosystems(ecosystems: Set<string>, options: LibraryFilterOptions): Set<string> {
	let res = new Set(ecosystems);
	const includeEcosystems = new Set(options.includeEcosystems ?? []);
	const excludeEcosystems = new Set(options.excludeEcosystems ?? []);

	if (includeEcosystems.size > 0) {
		res = new Set(Array.from(res).filter((eco) => includeEcosystems.has(eco)));
	}
	if (excludeEcosystems.size > 0) {
		for (const eco of excludeEcosystems) res.delete(eco);
	}

	return res;
}

function normalizePath(path: string | undefined): string {
	if (!path || path === '/') return '/';
	const trimmed = path.replace(/^\/+|\/+$/g, '');
	return trimmed === '' ? '/' : `/${trimmed}`;
}

function findNodeByPath(root: DocItem, path: string): DocItem | undefined {
	if (path === '/') return root;
	const parts = path.slice(1).split('/');
	let node: DocItem | undefined = root;
	for (const part of parts) {
		if (!node) return undefined;
		const child: DocItem | undefined = node.children[part];
		if (!child) return undefined;
		node = child;
	}
	return node;
}

export function getNodeMarkdown(
	libraries: Map<string, LibraryDBItem>,
	libraryName: string,
	path: string | undefined,
	level: MarkdownLevel
): string | undefined {
	const lib = libraries.get(libraryName);
	if (!lib) return undefined;
	const normPath = normalizePath(path);
	const node = findNodeByPath(lib.tree, normPath);
	if (!node) return undefined;

	const content = node.markdown[level];
	return content ?? '';
}

export function getLibrary(libraries: Map<string, LibraryDBItem>, name: string): LibraryDBItem | undefined {
	const res = libraries.get(name);
	debug(`getLibrary(${name}) -> %o`, res?.name);
	return res;
}
