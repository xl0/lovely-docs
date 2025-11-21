import type { LayoutServerLoad } from './$types';
import YAML from 'yaml';
import {
	filterEcosystems,
	filterLibraries,
	getEcosystems,
	getLibraries,
	markdownVariantKeys,
	type LibraryFilterOptions
} from 'lovely-docs-mcp/doc-cache';
import { getPageIndex, libraryIndex } from 'lovely-docs-mcp/handlers';

const toYaml = (value: unknown): string => YAML.stringify(value).trim();

const isRecord = (value: unknown): value is Record<string, unknown> =>
	value !== null && typeof value === 'object' && !Array.isArray(value);

function flattenPagePaths(tree: unknown, library: string): string[] {
	const paths: string[] = [library];
	const visit = (nodes: unknown, trail: string[]) => {
		if (!Array.isArray(nodes)) return;
		for (const node of nodes) {
			if (typeof node === 'string') {
				const segments = [...trail, node];
				paths.push([library, ...segments].join('/'));
			} else if (isRecord(node)) {
				for (const [key, child] of Object.entries(node)) {
					const nextTrail = [...trail, key];
					paths.push([library, ...nextTrail].join('/'));
					visit(child, nextTrail);
				}
			}
		}
	};

	visit(tree, []);
	return paths;
}

function buildIndexes(options: LibraryFilterOptions) {
	const libs = filterLibraries(getLibraries(), options);
	const librarySummaries = Array.from(libs.entries()).map(([key, summary]) => ({
		key,
		name: summary.name ?? key
	}));
	const ecosystems = Array.from(filterEcosystems(getEcosystems(getLibraries()), options)).sort();

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
		const result = getPageIndex(libs, key);
		const tree = result.isOk() ? result.value.tree ?? {} : {};
		const textBody = toYaml({ '/': tree });
		return {
			label: key,
			yaml: textBody,
			paths: flattenPagePaths(tree, key),
			// Raw data for interactivity
			tree
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
	const { tools, resources, ecosystems, libraries, pageIndexes, markdownVariants } = buildIndexes(baseOptions);

	return {
		mcp: {
			tools,
			resources,
			ecosystems,
			libraries,
			pageIndexes,
			markdownVariants
		}
	};
};
