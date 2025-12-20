import { getDocPageData } from '$lib/server/docs';
import { buildNested, getPageIndex, libraryIndex } from 'lovely-docs/handlers';
import {
	filterEcosystems,
	filterLibraries,
	getEcosystems,
	getLibrarySummaries,
	markdownVariantKeys,
	type LibraryFilterOptions,
	type MarkdownLevel
} from 'lovely-docs/doc-cache';
import { getWebsiteLibraries } from '$lib/server/library-service';
import { flattenPagePaths, toYaml } from '$lib/server/utils';

export type LibrarySummary = { key: string; name: string };

export async function getLibrarySummaryList(): Promise<{
	allLibraries: Awaited<ReturnType<typeof getWebsiteLibraries>>;
	libraries: LibrarySummary[];
	libs: ReturnType<typeof filterLibraries>;
}> {
	const allLibraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(allLibraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const libraries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));
	return { allLibraries, libraries, libs };
}

export type LibraryIndexItem = {
	id: string;
	label: string;
	index: string[];
	verbose: Record<string, string | undefined>;
	indexYaml: string;
	verboseYaml: string;
};

export async function loadLibraryIndex(): Promise<{
	ecosystems: string[];
	items: LibraryIndexItem[];
}> {
	const { libs } = await getLibrarySummaryList();
	const summaries = getLibrarySummaries(await getWebsiteLibraries());
	const ecosystems = ['*', ...Array.from(filterEcosystems(getEcosystems(summaries), {})).sort()];

	const items = ecosystems.map((eco) => {
		const idx = libraryIndex(libs, eco === '*' ? '*' : eco);
		return {
			id: `library-index:${eco}`,
			label: eco,
			index: Object.keys(idx),
			verbose: idx,
			indexYaml: toYaml(Object.keys(idx)),
			verboseYaml: toYaml(idx)
		};
	});

	return { ecosystems, items };
}

export type PageIndexData = {
	label: string;
	paths: string[];
	tree: unknown[];
	verboseTree: unknown[];
	yaml: string;
};

export async function loadPageIndex(library: string): Promise<{
	libraries: LibrarySummary[];
	pageIndex: PageIndexData | null;
}> {
	const { allLibraries, libraries, libs } = await getLibrarySummaryList();

	if (!library) {
		return { libraries, pageIndex: null };
	}

	const lib = libs.get(library);
	const result = getPageIndex(allLibraries, library);
	const tree = result.isOk() ? (result.value.tree ?? []) : [];
	const verboseResult = getPageIndex(allLibraries, library, true);
	const verboseTree = verboseResult.isOk() ? (verboseResult.value.tree ?? []) : [];

	const wrappedTree = [{ '/': tree }];
	const wrappedVerboseTree = [{ '/': { essence: lib?.essence, children: verboseTree } }];

	return {
		libraries,
		pageIndex: {
			label: library,
			paths: flattenPagePaths(tree),
			tree: wrappedTree,
			verboseTree: wrappedVerboseTree,
			yaml: toYaml({ '/': tree })
		}
	};
}

export type DocPageContent = Record<string, { text: string; children?: unknown[] }>;

export type DocPageData = {
	content: DocPageContent | null;
	libraries: LibrarySummary[];
	markdownVariants: string[];
	paths: string[];
};

export async function loadDocPage(library: string, path: string): Promise<DocPageData> {
	const { allLibraries, libraries } = await getLibrarySummaryList();
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
		const content: DocPageContent = {};

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
}
