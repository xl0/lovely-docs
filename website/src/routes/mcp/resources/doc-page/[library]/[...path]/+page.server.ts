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
import { flattenPagePaths } from '$lib/server/utils';

export const load = async ({ params }) => {
	const { library, path } = params;
	if (!library) throw error(404, 'Library name is required');

	const allLibraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(allLibraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const libraries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));

	const result = getPageIndex(allLibraries, library);
	const tree = result.isOk() ? (result.value.tree ?? []) : [];
	const paths = flattenPagePaths(tree);

	const pathSegments = path ? path.split('/').filter(Boolean) : [];
	const { currentNode } = await getDocPageData(library, pathSegments);
	const children = buildNested(currentNode);

	const levels: MarkdownLevel[] = ['digest', 'fulltext', 'short_digest', 'essence'];
	const content: Record<string, { text: string; children?: unknown[] }> = {};

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
		if (Object.keys(currentNode.children).length > 0) {
			content['digest'] = { text: '', children };
		} else {
			throw error(404, `Page not found: ${library}/${path}`);
		}
	}

	return {
		content,
		libraries,
		markdownVariants: Array.from(markdownVariantKeys),
		paths
	};
};
