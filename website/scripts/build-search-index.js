// Inspired by bits-ui search

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import removeMd from 'remove-markdown';
import { getWebsiteLibraries } from '../src/lib/server/library-service.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function cleanMd(md) {
	if (!md) return '';
	return removeMd(md, {
		replaceLinksWithURL: true,
		gfm: true,
		useImgAltText: true
	})
		.replaceAll('\n', ' ')
		.replaceAll('\t', ' ')
		.trim();
}

function extractPages(node, libraryKey, libraryName, currentPath = []) {
	const entries = [];

	// Add current node if it has a displayName (not root)
	if (currentPath.length > 0) {
		const content = node.markdown?.content || '';
		entries.push({
			libraryKey,
			libraryName,
			path: currentPath.join('/'),
			displayName: node.displayName,
			essence: node.markdown?.essence || '',
			content: cleanMd(content),
			relevant: node.relevant,
			href: `/human/${libraryKey}/${currentPath.join('/')}`
		});
	}

	// Recursively process children
	for (const [key, child] of Object.entries(node.children)) {
		entries.push(...extractPages(child, libraryKey, libraryName, [...currentPath, key]));
	}

	return entries;
}

async function buildSearchIndex() {
	const libraries = await getWebsiteLibraries();
	const searchIndex = [];

	for (const [key, lib] of libraries) {
		const pages = extractPages(lib.tree, key, lib.name);
		searchIndex.push(...pages);
	}

	return searchIndex;
}

const searchData = await buildSearchIndex();

const outputPath = resolve(__dirname, '../static/search-index.json');
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(searchData), { flag: 'w' });

console.log(`✓ Built search index with ${searchData.length} pages`);
