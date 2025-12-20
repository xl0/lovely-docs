import YAML from 'yaml';

export const toYaml = (value: unknown): string => YAML.stringify(value).trim();

export const isRecord = (value: unknown): value is Record<string, unknown> =>
	value !== null && typeof value === 'object' && !Array.isArray(value);

export function flattenPagePaths(tree: unknown): string[] {
	const paths: string[] = ['/'];
	const visit = (nodes: unknown, trail: string[]) => {
		if (!Array.isArray(nodes)) return;
		for (const node of nodes) {
			if (typeof node === 'string') {
				paths.push([...trail, node].join('/'));
			} else if (isRecord(node)) {
				for (const [key, child] of Object.entries(node)) {
					const nextTrail = [...trail, key];
					paths.push(nextTrail.join('/'));
					visit(child, nextTrail);
				}
			}
		}
	};
	visit(tree, []);
	return paths;
}
