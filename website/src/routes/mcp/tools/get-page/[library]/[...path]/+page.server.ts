import { loadDocPage } from '$lib/server/mcp-loaders';

export const load = async ({ params }) => {
	return loadDocPage(params.library ?? '', params.path ?? '');
};
