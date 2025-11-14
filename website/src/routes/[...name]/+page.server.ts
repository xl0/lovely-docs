import { getLibrary } from 'lovely-docs-mcp/doc-cache';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import dbg from 'debug';

export const load: PageServerLoad = async ({ params }) => {
	const raw = params.name ?? '';
	const segments = raw.split('/').filter(Boolean);

	const libraryKey = segments[0];
	const pathSegments = segments.slice(1);

	if (!libraryKey) {
		throw error(404, 'Library name is required');
	}

	const debug = dbg(`app:pages:${libraryKey}/+server`);
	const library = getLibrary(libraryKey);

	if (!library) {
		throw error(404, `Library not found: ${libraryKey}`);
	}

	debug({ libraryKey, pathSegments });

	return {
		library,
		libraryKey,
		pathSegments
	};
};
