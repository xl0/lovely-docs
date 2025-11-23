import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express, { type Request, type Response } from "express";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { loadLibrariesFromJson, type LibraryFilterOptions } from "./lib/doc-cache.js";

import dbg from "debug";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { homedir } from "os";
import { existsSync, mkdirSync } from "fs";
import { simpleGit } from "simple-git";
import { getServer, ResourceResponseError } from "./server.js";

const debug = dbg("app:index");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type TransportMode = "stdio" | "http";

interface CliOptions {
	transport: TransportMode;
	httpPort: number;
	includeLibs: string[];
	includeEcosystems: string[];
	excludeLibs: string[];
	excludeEcosystems: string[];
	repo: string;
	branch: string;
	gitCacheDir?: string;
	gitSync?: boolean;
	gitSyncOnly?: boolean;
	docDir?: string;
}

const isProd = !process.env.LOVELY_DOCS_DEV;

function getCacheDir(): string {
	if (process.platform === "win32") {
		return process.env.LOCALAPPDATA || join(homedir(), "AppData", "Local");
	}
	if (process.platform === "darwin") {
		return join(homedir(), "Library", "Caches");
	}
	return process.env.XDG_CACHE_HOME || join(homedir(), ".cache");
}

function parseCliOptions(): CliOptions {
	const defaultCacheDir = join(getCacheDir(), "lovely-docs", "git");
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
		.option("repo", {
			type: "string",
			describe:
				"Git repository to clone for documentation database. Defaults to https://github.com/xl0/lovely-docs",
		})
		.option("branch", {
			type: "string",
			describe: "Git branch to use. Defaults to master",
		})
		.option("git-cache-dir", {
			type: "string",
			describe: `Base directory for git clones. Defaults to ${defaultCacheDir}. Repo path will be appended to this.`,
		})
		.option("git-sync", {
			type: "boolean",
			describe:
				"Enable or disable git synchronization. Defaults to true in production, false in dev. Use --no-git-sync to disable.",
		})
		.option("git-sync-only", {
			type: "boolean",
			describe: "Perform git synchronization and exit. Useful for pre-caching.",
		})
		.option("doc-dir", {
			type: "string",
			describe:
				"Direct path to documentation database. If set, git options are ignored and syncing is disabled.",
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

	// Validate options
	if (argv["doc-dir"]) {
		const conflicts: string[] = [];
		if (argv.repo) conflicts.push("--repo");
		if (argv.branch) conflicts.push("--branch");
		if (argv["git-cache-dir"]) conflicts.push("--git-cache-dir");
		if (argv["git-sync"] !== undefined) conflicts.push("--git-sync");
		if (argv["git-sync-only"]) conflicts.push("--git-sync-only");

		if (conflicts.length > 0) {
			console.error(`Error: --doc-dir cannot be used with: ${conflicts.join(", ")}`);
			process.exit(1);
		}
	}

	const gitSync = argv["git-sync"] ?? isProd;
	const useCache = isProd || !!argv["git-cache-dir"];

	if (gitSync && !useCache && !argv["doc-dir"]) {
		console.error(
			"Error: Cannot enable git sync in development mode without an explicit --git-cache-dir. This prevents accidental modification of your local source tree."
		);
		process.exit(1);
	}

	// Helper to get env var, treating empty strings as undefined
	const getEnv = (key: string): string | undefined => {
		const value = process.env[key];
		return value && value.trim() !== "" ? value : undefined;
	};

	return {
		transport: argv.transport as TransportMode,
		httpPort: argv["http-port"] as number,
		includeLibs: (argv["include-libs"] as string[] | undefined) ?? [],
		includeEcosystems: (argv["include-ecosystems"] as string[] | undefined) ?? [],
		excludeLibs: (argv["exclude-libs"] as string[] | undefined) ?? [],
		excludeEcosystems: (argv["exclude-ecosystems"] as string[] | undefined) ?? [],
		repo: argv.repo ?? getEnv("LOVELY_DOCS_REPO") ?? "https://github.com/xl0/lovely-docs",
		branch: argv.branch ?? getEnv("LOVELY_DOCS_BRANCH") ?? "master",
		gitCacheDir: argv["git-cache-dir"] ?? getEnv("LOVELY_DOCS_GIT_CACHE_DIR"),
		gitSync: argv["git-sync"],
		gitSyncOnly: argv["git-sync-only"],
		docDir: argv["doc-dir"] ?? getEnv("LOVELY_DOCS_DOC_DIR"),
	};
}

const cli = parseCliOptions();

async function prepareDocDb(cli: CliOptions): Promise<string> {
	// 1. Explicit doc dir overrides everything
	if (cli.docDir) {
		return cli.docDir;
	}

	// 2. Determine target git directory (where the repo would be cloned/synced)
	let targetGitRoot: string;
	const useCache = isProd || !!cli.gitCacheDir; // Use cache if prod or gitCacheDir is explicitly set

	if (useCache) {
		const cacheBase = cli.gitCacheDir || join(getCacheDir(), "lovely-docs", "git");
		try {
			const url = new URL(cli.repo);
			const hostname = url.hostname;
			const pathname = url.pathname.replace(/^\//, "").replace(/\.git$/, "");
			targetGitRoot = join(cacheBase, hostname, pathname);
		} catch (e) {
			console.warn("Invalid repo URL, falling back to default cache path", e);
			targetGitRoot = join(cacheBase, "default");
		}
	} else {
		// In dev mode without explicit --git-cache-dir, we don't perform git operations
		// and will directly use the local source doc_db path.
		// We set targetGitRoot to a dummy value here as it won't be used for git ops.
		targetGitRoot = ""; // Will be overridden by the final return for local dev
	}

	// 3. Determine if we should sync and perform sync operations
	const shouldSync = cli.gitSyncOnly || (cli.gitSync ?? isProd); // Default to true in prod, false in dev if not specified

	if (shouldSync) {
		if (!useCache) {
			throw new Error(
				"Safety Error: Cannot enable git sync in development mode without an explicit --git-cache-dir. This prevents accidental modification of your local source tree."
			);
		}
		const git = simpleGit();
		if (!existsSync(targetGitRoot)) {
			console.info(`Cloning ${cli.repo} to ${targetGitRoot}...`);
			mkdirSync(dirname(targetGitRoot), { recursive: true });
			await git.clone(cli.repo, targetGitRoot, ["-b", cli.branch]);
		} else {
			console.info(`Syncing ${cli.repo} in ${targetGitRoot}...`);
			try {
				if (!existsSync(join(targetGitRoot, ".git"))) {
					throw new Error("Directory exists but is not a git repository");
				}
				const repo = simpleGit(targetGitRoot);
				await repo.fetch("origin", cli.branch);
				await repo.reset(["--hard", `origin/${cli.branch}`]);
			} catch (e) {
				console.error("Failed to sync git repo:", e);
				throw e;
			}
		}
	}

	// 4. Return the final doc_db path
	if (!useCache) {
		// If not using cache (dev mode, no gitCacheDir), use the local source path
		return isProd ? join(__dirname, "doc_db") : join(__dirname, "..", "..", "doc_db");
	}

	// Otherwise, return the doc_db path within the (potentially synced) git repository
	return join(targetGitRoot, "doc_db");
}

const doc_db_path = await prepareDocDb(cli);

if (cli.gitSyncOnly) {
	console.info("Git sync completed successfully.");
	process.exit(0);
}

await loadLibrariesFromJson(doc_db_path);

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
