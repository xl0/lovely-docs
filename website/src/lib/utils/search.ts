import FlexSearch from 'flexsearch';

export type SearchContent = {
	libraryKey: string;
	libraryName: string;
	path: string;
	displayName: string;
	essence: string;
	content: string;
	relevant: boolean;
	href: string;
};

export type SearchResult = SearchContent & {
	snippet?: string;
	highlights?: string[];
};

let titleIndex: FlexSearch.Index<number>;
let contentIndex: FlexSearch.Index<number>;
let content: SearchContent[] = [];

export function createSearchIndex(data: SearchContent[]) {
	titleIndex = new FlexSearch.Index({
		tokenize: 'forward',
		resolution: 9
	});

	contentIndex = new FlexSearch.Index({
		tokenize: 'forward',
		resolution: 5
	});

	data.forEach((item, i) => {
		titleIndex.add(i, item.displayName);
		contentIndex.add(i, `${item.content} ${item.essence}`);
	});

	content = data;
}

function getContentSnippet(text: string, query: string, maxLength = 150): string {
	const words = query.toLowerCase().split(/\s+/);
	const textLower = text.toLowerCase();

	let bestIndex = -1;

	for (const word of words) {
		const index = textLower.indexOf(word);
		if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
			bestIndex = index;
		}
	}

	if (bestIndex === -1) {
		return text.slice(0, maxLength) + (text.length > maxLength ? '...' : '');
	}

	const start = Math.max(0, bestIndex - Math.floor(maxLength / 2));
	const end = Math.min(text.length, start + maxLength);
	const snippet = text.slice(start, end);

	return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
}

function highlightMatches(text: string, query: string): string {
	const words = query
		.toLowerCase()
		.split(/\s+/)
		.filter((w) => w.length > 1);
	let highlighted = text;

	for (const word of words) {
		const regex = new RegExp(`(${word})`, 'gi');
		highlighted = highlighted.replace(regex, '<mark>$1</mark>');
	}

	return highlighted;
}

function fuzzyMatch(text: string, query: string): boolean {
	const textLower = text.toLowerCase();
	const queryLower = query.toLowerCase();
	if (textLower.includes(queryLower)) return true;

	let queryIndex = 0;
	for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
		if (textLower[i] === queryLower[queryIndex]) {
			queryIndex++;
		}
	}
	return queryIndex === queryLower.length;
}

export function searchIndex(query: string, libraryFilter?: string): SearchResult[] {
	if (!query.trim()) return [];

	const titleResults = titleIndex.search(query, { limit: 20, suggest: true });
	const contentResults = contentIndex.search(query, { limit: 20, suggest: true });

	const resultMap = new Map<number, { score: number; source: string }>();

	for (const id of titleResults) {
		resultMap.set(id, { score: 10, source: 'title' });
	}

	for (const id of contentResults) {
		const existing = resultMap.get(id);
		if (existing) {
			existing.score += 5;
		} else {
			resultMap.set(id, { score: 5, source: 'content' });
		}
	}

	// Fallback to fuzzy matching if no results
	if (resultMap.size === 0) {
		content.forEach((item, idx) => {
			if (fuzzyMatch(item.displayName, query)) {
				resultMap.set(idx, { score: 8, source: 'fuzzy-title' });
			} else if (fuzzyMatch(item.content, query) || fuzzyMatch(item.essence, query)) {
				resultMap.set(idx, { score: 3, source: 'fuzzy-content' });
			}
		});
	}

	let results = Array.from(resultMap.entries())
		.sort(([, a], [, b]) => b.score - a.score)
		.map(([idx]) => content[idx as number]);

	// Filter by library if specified
	if (libraryFilter) {
		results = results.filter((item) => item.libraryKey === libraryFilter);
	}

	// Take top 10 results
	results = results.slice(0, 10);

	return results.map((item) => {
		const snippet = getContentSnippet(item.content || item.essence, query);
		return {
			...item,
			snippet: highlightMatches(snippet, query),
			highlights: query
				.toLowerCase()
				.split(/\s+/)
				.filter((w) => w.length > 1)
		};
	});
}
