import { getLibrary, type DocItem } from 'lovely-docs/doc-cache';
import { error } from '@sveltejs/kit';
import { getWebsiteLibraries } from './library-service.js';

function stripMarkdown(node: DocItem): DocItem {
	const newChildren: Record<string, DocItem> = {};
	for (const [key, child] of Object.entries(node.children)) {
		newChildren[key] = stripMarkdown(child);
	}
	return {
		...node,
		markdown: { essence: node.markdown.essence },
		children: newChildren
	};
}

export async function getDocPageData(libraryKey: string, pathSegments: string[]) {
	const libraries = await getWebsiteLibraries();
	const library = getLibrary(libraries, libraryKey);

	if (!library) {
		throw error(404, `Library not found: ${libraryKey}`);
	}

	// Traverse to find the current node
	let currentNode: DocItem = library.tree;
	for (const segment of pathSegments) {
		if (!currentNode.children[segment]) {
			throw error(404, `Path not found: ${segment}`);
		}
		currentNode = currentNode.children[segment];
	}

	// Prepare the node for the client
	const clientNode: DocItem = {
		...currentNode,
		children: {}
	};

	// Process children: keep structure but remove markdown
	for (const [key, child] of Object.entries(currentNode.children)) {
		clientNode.children[key] = stripMarkdown(child);
	}

	// Create a stripped version of the full tree for the sidebar
	const fullTree = stripMarkdown(library.tree);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { tree, ...libraryInfo } = library;

	// All libraries for dropdown (include current)
	const allLibraries = Array.from(libraries.entries()).map(([key, lib]) => ({ key, displayName: lib.name }));

	return {
		libraryInfo,
		currentNode: clientNode,
		fullTree,
		allLibraries
	};
}
