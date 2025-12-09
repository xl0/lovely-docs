import { getDocPageData } from '$lib/server/docs';
import type { PageServerLoad } from './$types';
import dbg from 'debug';

const debug = dbg('app:pages:library');

export const load: PageServerLoad = async ({ params }) => {
	const raw = params.name ?? '';
	const segments = raw.split('/').filter(Boolean);

	const libraryKey = segments[0];
	const pathSegments = segments.slice(1);

	const { libraryInfo, currentNode, fullTree, allLibraries } = await getDocPageData(libraryKey, pathSegments);

	return {
		libraryInfo,
		libraryKey,
		pathSegments,
		currentNode,
		fullTree,
		allLibraries
	};
};
