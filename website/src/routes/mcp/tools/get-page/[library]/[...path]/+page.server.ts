import { getDocPageData } from '$lib/server/docs';
import { buildNested } from 'lovely-docs/handlers';
import type { MarkdownLevel } from 'lovely-docs/doc-cache';

import dbg from 'debug';
const debug = dbg('app:mcp:tools:get-page:server');

export const load = async ({ params }) => {
	const { library, path } = params;

	if (!library) {
		return { content: null };
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

		return { content };
	} catch (e) {
		return { content: null };
	}
};
