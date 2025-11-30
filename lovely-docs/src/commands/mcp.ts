import { Logtail } from '@logtail/node';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Command } from 'commander';
import cors from 'cors';
import dbg from 'debug';
import express, { type Request, type Response } from 'express';
import { join } from 'path';
import { loadLibrariesFromJson, type LibraryFilterOptions } from '../lib/doc-cache.js';
import { DocRepo, getCacheDir, getDocDbPath, getRepoPath } from '../lib/doc-repo.js';
import { getServer, ResourceResponseError } from '../lib/server.js';

const debug = dbg('app:mcp');

const isDev = process.env.LOVELY_DOCS_DEV === '1';

function getEnv(key: string): string | undefined {
	return process.env[key];
}

// Null object pattern for logger
class NullLogger {
	info(..._args: any[]) {}
	warn(..._args: any[]) {}
	error(..._args: any[]) {}
	debug(..._args: any[]) {}
	async flush() {}
}

export const mcpCommand = new Command('mcp')
	.description('Run the MCP server')
	.option('-t, --transport <mode>', "Transport mode: 'stdio' or 'http'", 'stdio')
	.option('-p, --port <port>', 'Port for HTTP mode', '3000')
	.option('--include-libs <libs...>', 'Limit to specific library keys')
	.option('--include-ecosystems <ecosystems...>', 'Limit to specific ecosystems')
	.option('--exclude-libs <libs...>', 'Exclude specific library keys')
	.option('--exclude-ecosystems <ecosystems...>', 'Exclude specific ecosystems')
	.option('--repo <url>', 'Git repository URL')
	.option('--branch <name>', 'Git branch name')
	.option('--git-cache-dir <path>', 'Git cache directory')
	.option('--git-sync', 'Sync git repository before starting')
	.option('--git-sync-only', 'Only sync git repository and exit')
	.option('--doc-dir <path>', 'Direct path to doc_db directory')
	.action(async (options) => {
		// Parse options with environment variable fallbacks
		const repo = options.repo ?? getEnv('LOVELY_DOCS_REPO') ?? 'https://github.com/xl0/lovely-docs';
		const branch = options.branch ?? getEnv('LOVELY_DOCS_BRANCH') ?? 'master';
		const gitCacheDir = options.gitCacheDir ?? getEnv('LOVELY_DOCS_GIT_CACHE_DIR');
		const docDir = options.docDir ?? getEnv('LOVELY_DOCS_DOC_DIR');
		const gitSync = options.gitSync ?? !isDev;
		const gitSyncOnly = options.gitSyncOnly;

		let docDbPath: string;

		// Determine doc_db path
		if (docDir) {
			// Explicit doc_db directory
			docDbPath = docDir;
			console.error(`Using explicit doc_db: ${docDbPath}`);
		} else if (isDev && !gitCacheDir) {
			// Development mode: use local doc_db from repository
			const { join } = await import('path');
			const { fileURLToPath } = await import('url');
			const { dirname } = await import('path');
			const __filename = fileURLToPath(import.meta.url);
			const __dirname = dirname(__filename);
			docDbPath = join(__dirname, '..', '..', '..', 'doc_db');
			console.error(`Development mode: using local doc_db at ${docDbPath}`);
		} else {
			// Production or explicit cache: use git sync
			const cacheBase = gitCacheDir || join(getCacheDir(), 'lovely-docs', 'git');
			const repoPath = getRepoPath(cacheBase, repo);
			const docRepo = new DocRepo(repoPath);

			if (gitSync || gitSyncOnly) {
				docDbPath = await docRepo.sync(repo, branch);
				console.error(`Git sync completed successfully.`);

				if (gitSyncOnly) {
					process.exit(0);
				}
			} else {
				docDbPath = getDocDbPath(repoPath);
			}
		}

		// Load libraries
		const libraries = await loadLibrariesFromJson(docDbPath);

		// Prepare filter options
		const filterOptions: LibraryFilterOptions = {
			includeLibs: options.includeLibs || [],
			includeEcosystems: options.includeEcosystems || [],
			excludeLibs: options.excludeLibs || [],
			excludeEcosystems: options.excludeEcosystems || []
		};

		// Initialize Logging
		const logtail: Logtail | NullLogger = process.env.BETTERSTACK_SOURCE_TOKEN
			? (() => {
					const endpoint = process.env.BETTERSTACK_ENDPOINT || 'https://in.logs.betterstack.com';
					console.error('BetterStack logging enabled');
					return new Logtail(process.env.BETTERSTACK_SOURCE_TOKEN!, {
						endpoint
					});
				})()
			: new NullLogger();

		if (options.transport === 'http') {
			const port = parseInt(options.port, 10);
			await startHttpServer(port, filterOptions, logtail, repo, libraries);
		} else {
			const stdio = new StdioServerTransport();
			const server = getServer(filterOptions, libraries);
			await server.connect(stdio);
			console.error('Lovely Docs MCP Server running on stdio');
		}
	});

import type { LibraryDBItem } from '../lib/doc-cache.js';

async function startHttpServer(
	port: number,
	defaultFilterOptions: LibraryFilterOptions,
	logtail: Logtail | NullLogger,
	repoUrl: string,
	libraries: Map<string, LibraryDBItem>
) {
	const serverStartTime = Date.now();
	const app = express();
	app.use(express.json());

	app.use(
		cors({
			origin: '*',
			exposedHeaders: ['Mcp-Session-Id', 'Content-Type', 'mcp-session-id', 'Authorization']
		})
	);

	// Health/uptime endpoint
	app.get('/health', (req: Request, res: Response) => {
		const uptime = Date.now() - serverStartTime;
		const uptimeSeconds = Math.floor(uptime / 1000);

		res.status(200).json({
			status: 'ok',
			uptime: uptimeSeconds,
			uptimeMs: uptime,
			timestamp: new Date().toISOString(),
			mode: 'production',
			transport: 'http',
			version: '0.0.1'
		});
	});

	app.post('/mcp', async (req: Request, res: Response) => {
		const startTime = Date.now();
		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
			enableJsonResponse: true
		});

		// Parse query parameters into filter options, merging with defaults
		const queryFilters = parseFilterOptionsFromQuery(req.query);
		const filterOptions: LibraryFilterOptions = {
			includeLibs: [...(defaultFilterOptions.includeLibs || []), ...(queryFilters.includeLibs || [])],
			includeEcosystems: [...(defaultFilterOptions.includeEcosystems || []), ...(queryFilters.includeEcosystems || [])],
			excludeLibs: [...(defaultFilterOptions.excludeLibs || []), ...(queryFilters.excludeLibs || [])],
			excludeEcosystems: [...(defaultFilterOptions.excludeEcosystems || []), ...(queryFilters.excludeEcosystems || [])]
		};

		const server = getServer(filterOptions, libraries);

		const requestMetadata = {
			method: req.body?.method,
			id: req.body?.id,
			ip: req.ip || req.socket.remoteAddress,
			userAgent: req.get('user-agent')
		};

		res.on('close', () => {
			transport.close();
		});

		await server.connect(transport);
		try {
			await transport.handleRequest(req, res, req.body);
			const duration = Date.now() - startTime;

			logtail.info('MCP request completed', {
				...requestMetadata,
				duration,
				status: 'success',
				statusCode: res.statusCode
			});
		} catch (error) {
			const duration = Date.now() - startTime;

			if (error instanceof ResourceResponseError) {
				debug(req, error);
				logtail.warn('MCP resource error', {
					...requestMetadata,
					duration,
					status: 'resource_error',
					errorCode: error.code,
					errorMessage: error.message
				});

				const id = req.body?.id ?? null;
				return res.status(200).json({
					jsonrpc: '2.0',
					id,
					error: {
						code: error.code,
						message: error.message
					}
				});
			}

			logtail.error('MCP request failed', {
				...requestMetadata,
				duration,
				status: 'error',
				error: error instanceof Error ? error.message : String(error),
				errorStack: error instanceof Error ? error.stack : undefined
			});

			throw error;
		}
	});

	app
		.listen(port, () => {
			console.error(`Lovely Docs MCP HTTP server running on http://localhost:${port}/mcp`);
			logtail.info('HTTP server started', {
				port,
				repo: repoUrl
			});
		})
		.on('error', (error: unknown) => {
			console.error('HTTP server error:', error);
			logtail.error('HTTP server failed to start', {
				error: error instanceof Error ? error.message : String(error),
				errorStack: error instanceof Error ? error.stack : undefined
			});
			logtail.flush().then(() => process.exit(1));
		});
}

function parseFilterOptionsFromQuery(query: any): LibraryFilterOptions {
	const getList = (key: string): string[] => {
		const value = query[key];
		if (!value) return [];
		if (Array.isArray(value)) return value.map(String);
		return String(value)
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
	};

	return {
		includeLibs: getList('include-libs'),
		includeEcosystems: getList('include-ecosystems'),
		excludeLibs: getList('exclude-libs'),
		excludeEcosystems: getList('exclude-ecosystems')
	};
}
