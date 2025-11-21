import type { PageServerLoad } from './$types';
import { getLibraries, filterLibraries } from 'lovely-docs-mcp/doc-cache';
import { getPage } from 'lovely-docs-mcp/handlers';
import { error } from '@sveltejs/kit';
import type { MarkdownLevel } from 'lovely-docs-mcp/doc-cache';

export const load: PageServerLoad = async ({ params }) => {
	const { library, path } = params;

	const libs = filterLibraries(getLibraries(), {});

	// For SSG, we need to return content for all levels so the client can switch between them
	// without making a new request (which wouldn't work on a static site if query params change).
	const levels: MarkdownLevel[] = ['digest', 'fulltext', 'short_digest', 'essence'];
	const content: Record<string, { text: string; children?: unknown[] }> = {};

	for (const level of levels) {
		const result = getPage(libs, library, path || undefined, level);
		if (result.isOk()) {
			content[level] = result.value;
		}
	}

	if (Object.keys(content).length === 0) {
		throw error(404, `Page not found: ${library}/${path}`);
	}

	return {
		content
	};
};
