import { loadLibrariesFromJson, type LibraryDBItem } from 'lovely-docs/doc-cache';
import path from 'path';

let libraries: Map<string, LibraryDBItem> | null = null;

export async function getWebsiteLibraries(): Promise<Map<string, LibraryDBItem>> {
	if (!libraries) {
		const docPath = path.resolve(process.cwd(), '../doc_db/');
		libraries = await loadLibrariesFromJson(docPath);
	}
	return libraries;
}
