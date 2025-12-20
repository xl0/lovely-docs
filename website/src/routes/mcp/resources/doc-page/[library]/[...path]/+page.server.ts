import { getDocPageData } from '$lib/server/docs';
import { buildNested, getPageIndex } from 'lovely-docs/handlers';
import {
	filterLibraries,
	getLibrarySummaries,
	markdownVariantKeys,
	type LibraryFilterOptions,
	type MarkdownLevel
} from 'lovely-docs/doc-cache';
import { getWebsiteLibraries } from '$lib/server/library-service';
import { error } from '@sveltejs/kit';
import { flattenPagePaths, isRecord } from '$lib/server/utils';

export const load = async ({ params }) => {
	const { library, path } = params;
	const pathSegments = path ? path.split('/').filter(Boolean) : [];

	if (!library) {
		throw error(404, 'Library name is required');
	}

	const { currentNode } = await getDocPageData(library, pathSegments);

	// For SSG, we need to return content for all levels so the client can switch between them
	// without making a new request.
	const levels: MarkdownLevel[] = ['digest', 'fulltext', 'short_digest', 'essence'];
	const content: Record<string, { text: string; children?: unknown[] }> = {};

	// Generate the nested children structure once
	// Note: buildNested expects a node with children, which DocItem has.
	// However, buildNested in handlers.ts might expect EssenceDocNode or similar.
	// Let's verify if DocItem is compatible.
	// DocItem has children: Record<string, DocItem>
	// buildNested iterates over children and checks for children property.
	// It should work.
	const children = buildNested(currentNode);

	for (const level of levels) {
		const text = currentNode.markdown[level];
		if (text !== undefined) {
			content[level] = {
				text,
				children: level === 'digest' || level === 'fulltext' ? children : undefined
			};
		}
	}

	if (Object.keys(content).length === 0) {
		// If no markdown content found for any level, it might be a directory-only node?
		// But getDocPageData would return the node.
		// If the node exists but has no markdown, we should probably still return it if it has children.
		// But the mcp view expects 'text'.
		// Let's check if we have at least one level.
		// If not, we can return empty text but with children.
		if (Object.keys(currentNode.children).length > 0) {
			// Fallback for directory nodes
			content['digest'] = { text: '', children };
		} else {
			throw error(404, `Page not found: ${library}/${path}`);
		}
	}

	const allLibraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(allLibraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const librarySummaries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));

	const result = getPageIndex(allLibraries, library);
	const tree = result.isOk() ? (result.value.tree ?? []) : [];
	const paths = flattenPagePaths(tree);

	return {
		content,
		libraries: librarySummaries,
		markdownVariants: Array.from(markdownVariantKeys),
		paths
	};
};
