import { loadDocPage } from '$lib/server/mcp-loaders';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const { library, path } = params;
	if (!library) throw error(404, 'Library name is required');

	const data = await loadDocPage(library, path ?? '');
	if (!data.content) throw error(404, `Page not found: ${library}/${path}`);
	return data;
};
