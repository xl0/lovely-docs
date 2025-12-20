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

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

function flattenPagePaths(tree: unknown): string[] {
	const paths: string[] = ['/'];
	const visit = (nodes: unknown, trail: string[]) => {
		if (!Array.isArray(nodes)) return;
		for (const node of nodes) {
			if (typeof node === 'string') {
				paths.push([...trail, node].join('/'));
			} else if (isRecord(node)) {
				for (const [key, child] of Object.entries(node)) {
					const nextTrail = [...trail, key];
					paths.push(nextTrail.join('/'));
					visit(child, nextTrail);
				}
			}
		}
	};
	visit(tree, []);
	return paths;
}

export const load = async ({ params }) => {
	const { library, path } = params;

	if (!library) {
		const allLibraries = await getWebsiteLibraries();
		const summaries = getLibrarySummaries(allLibraries);
		const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
		const librarySummaries = Array.from(libs.entries()).map(([key, summary]) => ({
			key,
			name: summary.name ?? key
		}));

		return {
			content: null,
			libraries: librarySummaries,
			markdownVariants: Array.from(markdownVariantKeys),
			paths: []
		};
	}

	const pathSegments = path ? path.split('/').filter(Boolean) : [];

	try {
		const { currentNode } = await getDocPageData(library, pathSegments);

		const levels: MarkdownLevel[] = ['digest', 'fulltext', 'short_digest', 'essence'];
		const content: Record<string, { text: string; children?: unknown[] }> = {};
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
			if (Object.keys(currentNode.children).length > 0) {
				content['digest'] = { text: '', children };
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
	} catch (e) {
		const allLibraries = await getWebsiteLibraries();
		const summaries = getLibrarySummaries(allLibraries);
		const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
		const librarySummaries = Array.from(libs.entries()).map(([key, summary]) => ({
			key,
			name: summary.name ?? key
		}));

		return {
			content: null,
			libraries: librarySummaries,
			markdownVariants: Array.from(markdownVariantKeys),
			paths: []
		};
	}
};
