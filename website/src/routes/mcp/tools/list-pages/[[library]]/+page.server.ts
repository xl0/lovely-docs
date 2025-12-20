import type { PageServerLoad } from './$types';
import YAML from 'yaml';
import { filterLibraries, getLibrarySummaries, type LibraryFilterOptions } from 'lovely-docs/doc-cache';
import { getPageIndex } from 'lovely-docs/handlers';
import { getWebsiteLibraries } from '$lib/server/library-service';

const toYaml = (value: unknown): string => YAML.stringify(value).trim();

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

export const load: PageServerLoad = async ({ params }) => {
	const { library } = params;
	const libraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(libraries);
	const libs = filterLibraries(summaries, {} as LibraryFilterOptions);
	const librarySummaries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));

	let pageIndex = null;
	if (library) {
		const lib = libs.get(library);
		const result = getPageIndex(libraries, library);
		const tree = result.isOk() ? (result.value.tree ?? []) : [];
		const verboseResult = getPageIndex(libraries, library, true);
		const verboseTree = verboseResult.isOk() ? (verboseResult.value.tree ?? []) : [];

		const wrappedTree = [{ '/': tree }];
		const wrappedVerboseTree = [{ '/': { essence: lib?.essence, children: verboseTree } }];

		pageIndex = {
			label: library,
			yaml: toYaml({ '/': tree }),
			paths: flattenPagePaths(tree),
			tree: wrappedTree,
			verboseTree: wrappedVerboseTree
		};
	}

	return { libraries: librarySummaries, pageIndex };
};
