import { err, ok, type Result } from 'neverthrow';
import type { LibrarySummary, LibraryDBItem } from './doc-cache.js';
import { getNodeMarkdown, getRelevantEssenceSubTree, type MarkdownLevel, getEcosystems, type EssenceDocNode } from './doc-cache.js';
import dbg from 'debug';
const debug = dbg('app:lib:handlers');

export function libraryIndex(libraries: Map<string, LibrarySummary>, ecosystem: string) {
	let filtered = libraries;
	if (ecosystem !== '*') {
		filtered = new Map(Array.from(libraries.entries()).filter(([, lib]) => lib.ecosystems.includes(ecosystem)));
	}
	return Object.fromEntries(Array.from(filtered.entries()).map(([key, lib]) => [key, lib.essence]));
}

export const buildNested = (node: EssenceDocNode): unknown[] => {
	const items: unknown[] = [];
	for (const [key, child] of Object.entries(node.children ?? {})) {
		const hasChildren = child && Object.keys(child.children ?? {}).length > 0;
		if (!hasChildren) {
			items.push(key);
		} else {
			items.push({ [key]: buildNested(child) });
		}
	}
	return items;
};

export const buildNestedVerbose = (node: EssenceDocNode): unknown[] => {
	const items: unknown[] = [];
	for (const [key, child] of Object.entries(node.children ?? {})) {
		const hasChildren = child && Object.keys(child.children ?? {}).length > 0;
		if (!hasChildren) {
			items.push({ [key]: child.essence });
		} else {
			items.push({
				[key]: {
					essence: child.essence,
					children: buildNestedVerbose(child)
				}
			});
		}
	}
	return items;
};

export function getPageIndex(
	libraries: Map<string, LibraryDBItem>,
	library: string,
	verbose: boolean = false
): Result<Record<string, unknown>, string> {
	const byKey = libraries.get(library);
	if (!byKey) return err(`Unknown library: ${library}`);
	const tree = getRelevantEssenceSubTree(libraries, library, '/');
	if (!tree) return ok({});
	return ok({ tree: verbose ? buildNestedVerbose(tree) : buildNested(tree) });
}

export function getPage(
	libraries: Map<string, LibraryDBItem>,
	library: string,
	page: string | undefined,
	level: MarkdownLevel | undefined
): Result<{ text: string; children?: unknown[] }, string> {
	const byKey = libraries.get(library);
	if (!byKey) return err(`Library not found: ${library}`);
	const effectiveLevel = (level ?? 'digest') as MarkdownLevel;
	const text = getNodeMarkdown(libraries, library, page ?? '/', effectiveLevel);
	if (text === undefined) return err(`Page not found in ${library} at path ${page ?? '/'}`);

	let children: unknown[] | undefined;
	if (effectiveLevel === 'digest' || effectiveLevel === 'fulltext') {
		const subTree = getRelevantEssenceSubTree(libraries, library, page ?? '/');
		if (subTree) {
			children = buildNested(subTree);
		}
	}
	const payload: { text: string; children?: unknown[] } = { text };
	if (children) payload.children = children;
	return ok(payload);
}
