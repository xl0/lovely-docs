import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

type ResourceCommandId = ResourceCommand['id'];
type ResourceField = 'indexYaml' | 'verboseYaml';

export type ResourceCommand =
		| { id: 'doc-index'; label: 'doc-index'; target: 'ecosystem'; field: ResourceField }
		| { id: 'doc-index-verbose'; label: 'doc-index-verbose'; target: 'ecosystem'; field: ResourceField }
		| { id: 'page-index'; label: 'page-index'; target: 'library'; field?: undefined }
		| { id: 'doc-page'; label: 'doc-page'; target: 'library'; field?: undefined };
export const resourceCommands: ResourceCommand[] = [
		{ id: 'doc-index', label: 'doc-index', target: 'ecosystem', field: 'indexYaml' },
		{ id: 'doc-index-verbose', label: 'doc-index-verbose', target: 'ecosystem', field: 'verboseYaml' },
		{ id: 'page-index', label: 'page-index', target: 'library' },
		{ id: 'doc-page', label: 'doc-page', target: 'library' }
	];


export function handleCommandChange(value: string, current: string) {
    if (value !== current) goto(resolve(`/mcp/${value}`));
	}

