import { loadLibrariesFromJson } from "lovely-docs-mcp/doc-cache";
import path from 'path';

const docPath = path.resolve(process.cwd(), '../doc_db/');

await loadLibrariesFromJson(docPath);

