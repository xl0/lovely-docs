// import type { PageServerLoad } from './$types';

// export const load: PageServerLoad = async ({ parent, params }) => {
// 	const parentData = await parent();
// 	const library = params.library;
// 	const pageIndex = parentData.mcp.pageIndexes.find((p: any) => p.label === library);

// 	return {
// 		...parentData,
// 		library,
// 		tree: pageIndex?.tree,
// 		hasTree: !!pageIndex?.tree
// 	};
// };
