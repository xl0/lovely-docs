import type { LayoutServerLoad } from './$types';
import YAML from 'yaml';
import {
	filterEcosystems,
	filterLibraries,
	getEcosystems,
	getLibrarySummaries,
	markdownVariantKeys,
	type LibraryFilterOptions,
	type LibraryDBItem
} from 'lovely-docs/doc-cache';
import { getPageIndex, libraryIndex } from 'lovely-docs/handlers';
import { getWebsiteLibraries } from '$lib/server/library-service';

import dbg from 'debug';
const debug = dbg('app:mcp:tools:layout:server');

const toYaml = (value: unknown): string => YAML.stringify(value).trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
	value !== null && typeof value === 'object' && !Array.isArray(value);

function flattenPagePaths(tree: unknown, library: string): string[] {
	const paths: string[] = ['/']; // Root path for the library
	const visit = (nodes: unknown, trail: string[]) => {
		if (!Array.isArray(nodes)) return;
		for (const node of nodes) {
			if (typeof node === 'string') {
				const segments = [...trail, node];
				paths.push(segments.join('/'));
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

async function buildIndexes(options: LibraryFilterOptions) {
	const libraries = await getWebsiteLibraries();
	const summaries = getLibrarySummaries(libraries);
	const libs = filterLibraries(summaries, options);
	const librarySummaries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));
	const ecosystems = Array.from(filterEcosystems(getEcosystems(summaries), options)).sort();

	const ecosystemKeys = ['*', ...ecosystems];

	const tools = ecosystemKeys.map((eco) => {
		const idx = libraryIndex(libs, eco === '*' ? '*' : eco);
		return {
			id: `listLibraries:${eco}`,
			name: 'listLibraries',
			label: eco,
			payloadYaml: toYaml(Object.keys(idx)),
			verboseYaml: toYaml(idx),
			// Raw data for interactivity
			payload: Object.keys(idx),
			verbose: idx
		};
	});

	const resources = ecosystemKeys.map((eco) => {
		const idx = libraryIndex(libs, eco === '*' ? '*' : eco);
		return {
			id: `doc-index:${eco}`,
			name: 'doc-index',
			label: eco,
			indexYaml: toYaml(Object.keys(idx)),
			verboseYaml: toYaml(idx),
			// Raw data for interactivity
			index: Object.keys(idx),
			verbose: idx
		};
	});

	const pageIndexes = librarySummaries.map(({ key }) => {
		const lib = libs.get(key);
		const result = getPageIndex(libraries, key);
		const tree = result.isOk() ? (result.value.tree ?? []) : [];

		const verboseResult = getPageIndex(libraries, key, true);
		const verboseTree = verboseResult.isOk() ? (verboseResult.value.tree ?? []) : [];

		const wrappedTree = [{ '/': tree }];
		const wrappedVerboseTree = [
			{
				'/': {
					essence: lib?.essence,
					children: verboseTree
				}
			}
		];

		const textBody = toYaml({ '/': tree });
		return {
			label: key,
			yaml: textBody,
			paths: flattenPagePaths(tree, key),
			// Raw data for interactivity
			tree: wrappedTree,
			verboseTree: wrappedVerboseTree
		};
	});

	return {
		tools,
		resources,
		ecosystems: ecosystemKeys,
		libraries: librarySummaries,
		pageIndexes,
		markdownVariants: Array.from(markdownVariantKeys)
	};
}

export const load: LayoutServerLoad = async () => {
	const baseOptions: LibraryFilterOptions = {};
	const { tools, resources, ecosystems, libraries, pageIndexes, markdownVariants } = await buildIndexes(baseOptions);

	const res = {
		mcp: {
			tools,
			resources,
			ecosystems,
			libraries,
			pageIndexes,
			markdownVariants
		}
	};

	return res;
};
