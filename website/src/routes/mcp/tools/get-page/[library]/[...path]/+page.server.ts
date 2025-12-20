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
import { flattenPagePaths } from '$lib/server/utils';

export const load = async ({ params }) => {
	const { library, path } = params;

	const allLibraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(allLibraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const libraries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));
	const markdownVariants = Array.from(markdownVariantKeys);

	if (!library) {
		return { content: null, libraries, markdownVariants, paths: [] };
	}

	const result = getPageIndex(allLibraries, library);
	const tree = result.isOk() ? (result.value.tree ?? []) : [];
	const paths = flattenPagePaths(tree);

	const pathSegments = path ? path.split('/').filter(Boolean) : [];

	try {
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

		if (Object.keys(content).length === 0 && Object.keys(currentNode.children).length > 0) {
			content['digest'] = { text: '', children };
		}

		return { content, libraries, markdownVariants, paths };
	} catch {
		return { content: null, libraries, markdownVariants, paths: [] };
	}
};
