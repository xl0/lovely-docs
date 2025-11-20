import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express, { type Request, type Response } from "express";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { loadLibrariesFromJson, type LibraryFilterOptions } from "./lib/doc-cache.js";

import dbg from "debug";
import { join } from "path";
import { getServer, ResourceResponseError } from "./server.js";

const debug = dbg("app:index");

const doc_db_path = join(process.cwd(), "..", "doc_db");

await loadLibrariesFromJson(doc_db_path);

type TransportMode = "stdio" | "http";

interface CliOptions {
	transport: TransportMode;
	httpPort: number;
	includeLibs: string[];
	includeEcosystems: string[];
	excludeLibs: string[];
	excludeEcosystems: string[];
}

function parseCliOptions(): CliOptions {
	const parser = yargs(hideBin(process.argv))
		.scriptName("lovely-docs-mcp")
		.usage("$0 [options]")
		.option("transport", {
			type: "string",
			choices: ["stdio", "http"] as const,
			default: "stdio" as const,
			describe:
				"MCP transport to use: 'stdio' for standard MCP over stdio, 'http' for Express + StreamableHTTPServerTransport.",
		})
		.option("http-port", {
			type: "number",
			default: parseInt(process.env.PORT || "3000", 10),
			describe:
				"Port to use when running in --transport=http mode. Defaults to $PORT or 3000.",
		})
		.option("include-libs", {
			type: "string",
			array: true,
			describe:
				"Limit to specific library keys (internal IDs). If set, only these libraries are exposed.",
		})
		.option("include-ecosystems", {
			type: "string",
			array: true,
			describe: "Limit to libraries that belong to at least one of these ecosystems.",
		})
		.option("exclude-libs", {
			type: "string",
			array: true,
			describe: "Exclude specific library keys entirely, regardless of ecosystems.",
		})
		.option("exclude-ecosystems", {
			type: "string",
			array: true,
			describe:
				"Exclude libraries whose ecosystems are all in this list. If a library has at least one non-excluded ecosystem, it is kept.",
		})
		.help("help")
		.alias("help", "h");

	const argv = parser.parseSync();
	if (argv.help) {
		parser.showHelp();
		process.exit(0);
	}

	return {
		transport: argv.transport as TransportMode,
		httpPort: argv["http-port"] as number,
		includeLibs: (argv["include-libs"] as string[] | undefined) ?? [],
		includeEcosystems: (argv["include-ecosystems"] as string[] | undefined) ?? [],
		excludeLibs: (argv["exclude-libs"] as string[] | undefined) ?? [],
		excludeEcosystems: (argv["exclude-ecosystems"] as string[] | undefined) ?? [],
	};
}

const cli = parseCliOptions();

const cliFilterOptions: LibraryFilterOptions = {
	includeLibs: cli.transport === "stdio" ? cli.includeLibs : [],
	includeEcosystems: cli.transport === "stdio" ? cli.includeEcosystems : [],
	excludeLibs: cli.transport === "stdio" ? cli.excludeLibs : [],
	excludeEcosystems: cli.transport === "stdio" ? cli.excludeEcosystems : [],
};

function parseFilterOptionsFromQuery(query: any): LibraryFilterOptions {
	const getList = (key: string): string[] => {
		const value = query[key];
		if (!value) return [];
		if (Array.isArray(value)) return value.map(String);
		return String(value)
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
	};

	return {
		includeLibs: getList("include-libs"),
		includeEcosystems: getList("include-ecosystems"),
		excludeLibs: getList("exclude-libs"),
		excludeEcosystems: getList("exclude-ecosystems"),
	};
}

async function startHttpServer(port: number) {
	const app = express();
	app.use(express.json());

	app.use(
		cors({
			origin: "*",
			exposedHeaders: ["Mcp-Session-Id", "Content-Type", "mcp-session-id", "Authorization"],
		})
	);

	app.post("/mcp", async (req: Request, res: Response) => {
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
			enableJsonResponse: true,
		});

		// Parse query parameters into filter options
		const filterOptions = parseFilterOptionsFromQuery(req.query);
		const server = getServer(filterOptions);

		res.on("close", () => {
			transport.close();
		});

		await server.connect(transport);
		try {
			await transport.handleRequest(req, res, req.body);
		} catch (error) {
			if (error instanceof ResourceResponseError) {
				debug(req, error);
				const id = req.body?.id ?? null;
				return res.status(200).json({
					jsonrpc: "2.0",
					id,
					error: {
						code: error.code,
						message: error.message,
					},
				});
			}
			throw error;
		}
	});

	app.listen(port, () => {
		console.error(`Lovely Docs MCP HTTP server running on http://localhost:${port}/mcp`);
	}).on("error", (error: unknown) => {
		console.error("HTTP server error:", error);
		process.exit(1);
	});
}

async function main() {
	if (cli.transport === "http") {
		await startHttpServer(cli.httpPort);
	} else {
		const stdio = new StdioServerTransport();
		const server = getServer(cliFilterOptions);
		await server.connect(stdio);
		console.error("Lovely Docs MCP Server running on stdio");
	}
}

main().catch((error) => {
	console.error("Fatal error:", error);
	process.exit(1);
});
//# sourceMappingURL=index.js.map
