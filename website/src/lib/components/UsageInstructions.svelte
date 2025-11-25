<script lang="ts">
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Button } from '$lib/components/ui/button';
	import { Terminal, Globe, Copy, Check } from '@lucide/svelte';
	import SimpleIcon from '$lib/components/SimpleIcon.svelte';
	import { siCursor, siAnthropic, siGooglegemini, siOpenai, siZedindustries, siGithub } from 'simple-icons';
	import type { SimpleIcon as SimpleIconType } from 'simple-icons';

	// ============================================================================
	// Types & Constants
	// ============================================================================

	type EnvConfig = {
		snippet: string;
		instructions: string;
	};

	type EnvGenerator = (isWeb: boolean, cmd: string, args: string[]) => EnvConfig;

	type Environment = {
		id: string;
		label: string;
		icon?: string;
		generator: EnvGenerator;
	};

	type Tool = {
		id: string;
		label: string;
		cmd: string;
		args: string;
	};

	const MCP_SERVER_NAME = 'lovely-docs';
	const PACKAGE_NAME = 'lovely-docs-mcp';
	const REMOTE_URL = 'https://lovely-docs-production.up.railway.app/mcp';

	// ============================================================================
	// Custom Icons
	// ============================================================================

	const customIcons: Record<string, SimpleIconType> = {
		vscode: {
			title: 'Visual Studio Code',
			slug: 'visualstudiocode',
			svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Visual Studio Code</title><path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/></svg>',
			hex: '007ACC',
			source: 'https://code.visualstudio.com/',
			path: 'M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z'
		},
		opencode: {
			title: 'OpenCode',
			slug: 'opencode',
			svg: '<svg viewBox="0 0 240 300" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1401_86274)"><mask id="mask0_1401_86274" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="300"><path d="M240 0H0V300H240V0Z" fill="white"/></mask><g mask="url(#mask0_1401_86274)"><path d="M180 240H60V120H180V240Z" fill="#CFCECD"/><path d="M180 60H60V240H180V60ZM240 300H0V0H240V300Z" fill="#211E1E"/></g></g><defs><clipPath id="clip0_1401_86274"><rect width="240" height="300" fill="white"/></clipPath></defs></svg>',
			hex: '211E1E',
			source: 'https://opencode.ai/',
			path: 'M180 240H60V120H180V240ZM180 60H60V240H180V60ZM240 300H0V0H240V300Z'
		}
	};

	const iconMap: Record<string, SimpleIconType> = {
		cursor: siCursor,
		vscode: customIcons.vscode,
		'claude-desktop': siAnthropic,
		'claude-code': siAnthropic,
		gemini: siGooglegemini,
		codex: siOpenai,
		opencode: customIcons.opencode,
		zed: siZedindustries,
		github: siGithub
	};

	// ============================================================================
	// Environment Generators
	// ============================================================================

	const json = (obj: object) => JSON.stringify(obj, null, 2);

	function cursorEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		return {
			snippet: json({
				mcpServers: {
					[MCP_SERVER_NAME]: isWeb ? { url: REMOTE_URL } : { command: cmd, args }
				}
			}),
			instructions:
				'File → Preferences → Cursor Settings → Features → MCP Servers → "Add New MCP Server" → Paste configuration'
		};
	}

	function vscodeEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		const command = [cmd, ...args].join(' ');
		return {
			snippet: '',
			instructions: `Command palette → "MCP: Add Server..." → Select "${isWeb ? 'HTTP (HTTP or Server-Sent Events)' : 'Command (stdio)'}" → ${isWeb ? `URL: ${REMOTE_URL}` : `Command: ${command}`} → Name: ${MCP_SERVER_NAME}`
		};
	}

	function claudeDesktopEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		if (isWeb) {
			return {
				snippet: '',
				instructions: `Settings → Connectors → "Add Custom Connector" → Name: ${MCP_SERVER_NAME} → URL: ${REMOTE_URL}`
			};
		}
		return {
			snippet: json({
				mcpServers: {
					[MCP_SERVER_NAME]: { command: cmd, args }
				}
			}),
			instructions: 'Settings → Developer → "Edit Config" → Add to claude_desktop_config.json'
		};
	}

	function claudeCodeEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		const command = [cmd, ...args].join(' ');
		return {
			snippet: isWeb
				? `claude mcp add --transport http --scope user ${MCP_SERVER_NAME} ${REMOTE_URL}`
				: `claude mcp add --transport stdio --scope user ${MCP_SERVER_NAME} -- ${command}`,
			instructions: 'Run the command in your terminal.'
		};
	}

	function geminiEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		const command = [cmd, ...args].join(' ');
		return {
			snippet: isWeb
				? `gemini mcp add --transport http --scope user ${MCP_SERVER_NAME} ${REMOTE_URL}`
				: `gemini mcp add --transport stdio --scope user ${MCP_SERVER_NAME} ${command}`,
			instructions: 'Run the command in your terminal.'
		};
	}

	function codexEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		if (isWeb) {
			return {
				snippet: `[features]
rmcp_client = true

[mcp_servers.${MCP_SERVER_NAME}]
url = "${REMOTE_URL}"`,
				instructions: 'Add to ~/.codex/config.toml'
			};
		}
		return {
			snippet: `[mcp_servers.${MCP_SERVER_NAME}]
command = "${cmd}"
args = ${json(args)}`,
			instructions: 'Add to ~/.codex/config.toml'
		};
	}

	function opencodeEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		const command = [cmd, ...args].join(' ');
		const config = isWeb ? { type: 'remote', url: REMOTE_URL } : { type: 'local', command: [cmd, ...args] };
		return {
			snippet: json({ mcp: { [MCP_SERVER_NAME]: config } }),
			instructions: 'Add to opencode.jsonc configuration file'
		};
	}

	function zedEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		const config = isWeb ? { url: REMOTE_URL } : { command: cmd, args };
		return {
			snippet: json({ context_servers: { [MCP_SERVER_NAME]: config } }),
			instructions: 'Ctrl+Alt+, (or "zed: open settings") → Add to settings.json (~/.config/zed/settings.json)'
		};
	}

	function githubEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		const config = isWeb
			? { type: 'http', url: REMOTE_URL, tools: ['*'] }
			: { type: 'stdio', command: cmd, args, tools: ['*'] };

		return {
			snippet: json({
				mcpServers: {
					[MCP_SERVER_NAME]: config
				}
			}),
			instructions: 'Repository Settings → Copilot → Coding agent → Edit MCP configuration'
		};
	}

	function otherEnv(isWeb: boolean, cmd: string, args: string[]): EnvConfig {
		return {
			snippet: isWeb ? `URL: ${REMOTE_URL}` : `Command: ${cmd}\nArgs: ${args.join(' ')}`,
			instructions: "Refer to your client's documentation for adding MCP servers."
		};
	}

	// ============================================================================
	// Data
	// ============================================================================

	const environments: Environment[] = [
		{ id: 'cursor', label: 'Cursor', icon: 'cursor', generator: cursorEnv },
		{ id: 'vscode', label: 'VS Code', icon: 'vscode', generator: vscodeEnv },
		{
			id: 'claude-desktop',
			label: 'Claude Desktop',
			icon: 'claude-desktop',
			generator: claudeDesktopEnv
		},
		{ id: 'claude-code', label: 'Claude Code', icon: 'claude-code', generator: claudeCodeEnv },
		{ id: 'gemini', label: 'Gemini CLI', icon: 'gemini', generator: geminiEnv },
		{ id: 'codex', label: 'Codex CLI', icon: 'codex', generator: codexEnv },
		{ id: 'opencode', label: 'OpenCode', icon: 'opencode', generator: opencodeEnv },
		{ id: 'zed', label: 'Zed', icon: 'zed', generator: zedEnv },
		{ id: 'github', label: 'GitHub Agent', icon: 'github', generator: githubEnv },
		{ id: 'other', label: 'Other', generator: otherEnv }
	];

	const tools: Tool[] = [
		{ id: 'npm', label: 'npm', cmd: 'npx', args: '-y' },
		{ id: 'pnpm', label: 'pnpm', cmd: 'pnpm', args: 'dlx' },
		{ id: 'bun', label: 'bun', cmd: 'bun', args: 'x' },
		{ id: 'yarn', label: 'yarn', cmd: 'yarn', args: 'dlx' },
		{ id: 'web', label: 'web', cmd: '', args: '' }
	];

	// ============================================================================
	// State
	// ============================================================================

	let selectedEnv = $state('cursor');
	let selectedTool = $state('npm');
	let copied = $state(false);

	$effect(() => {
		// Reset tool selection when switching environments
		selectedTool = 'npm';
	});

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	// ============================================================================
	// Helper Functions
	// ============================================================================

	function getConfig(envId: string, toolId: string, toolCmd: string, toolArgs: string): EnvConfig {
		const env = environments.find((e) => e.id === envId);
		if (!env) return { snippet: '', instructions: '' };

		const isWeb = toolId === 'web';
		const command = `${toolCmd} ${toolArgs} ${PACKAGE_NAME}`.trim();
		const cmdParts = command.split(' ');
		const cmd = cmdParts[0];
		const args = cmdParts.slice(1);

		return env.generator(isWeb, cmd, args);
	}
</script>

<div class="relative mt-6 w-full max-w-4xl mx-auto">
	<Tabs bind:value={selectedEnv}>
		<!-- Environment Tabs -->
		<TabsList class="justify-start gap-4 rounded-none bg-transparent px-0 flex-wrap h-auto border-b">
			{#each environments as env}
				<TabsTrigger
					value={env.id}
					class=" border-b-2 border-transparent data-[state=active]:border-primary flex items-center gap-2">
					{#if env.icon && iconMap[env.icon]}
						<SimpleIcon icon={iconMap[env.icon]} class="size-4" />
					{/if}
					{env.label}
				</TabsTrigger>
			{/each}
		</TabsList>

		<!-- Environment Content -->
		{#each environments as env}
			{@const config = getConfig(
				env.id,
				selectedTool,
				tools.find((t) => t.id === selectedTool)?.cmd || '',
				tools.find((t) => t.id === selectedTool)?.args || ''
			)}
			<TabsContent value={env.id} class="mt-0">
				<!-- Code Card -->
				<figure class="relative mt-6 rounded-lg border bg-card">
					<Tabs bind:value={selectedTool}>
						<!-- Package Manager Tabs -->
						<div class="flex items-center gap-2 border-b px-4 py-2">
							<div class="flex size-4 items-center justify-center rounded-[1px] bg-foreground opacity-70">
								<Terminal class="size-3 text-background" />
							</div>
							<TabsList class="h-auto rounded-none bg-transparent p-0 gap-1">
								{#each tools as tool}
									{#if tool.id === 'web'}
										<div class="flex size-4 items-center justify-center rounded-[1px] bg-foreground opacity-70 ml-1">
											<Globe class="size-3 text-background" />
										</div>
									{/if}
									<TabsTrigger
										value={tool.id}
										class="rounded-md border border-transparent px-3 py-1 text-sm h-7 data-[state=active]:border-input data-[state=active]:bg-accent">
										{tool.label}
									</TabsTrigger>
								{/each}
							</TabsList>
						</div>

						<!-- Code Content -->
						<div class="overflow-x-auto">
							{#each tools as tool}
								<TabsContent value={tool.id} class="relative m-0 p-4">
									{#if config.snippet}
										<!-- Copy Button -->
										<Button
											variant="ghost"
											size="icon"
											class="absolute right-2 top-2 size-8"
											onclick={() => copyToClipboard(config.snippet)}>
											{#if copied}
												<Check class="size-4" />
											{:else}
												<Copy class="size-4" />
											{/if}
										</Button>
										<pre class="overflow-x-auto"><code class="font-mono text-sm">{config.snippet}</code></pre>
									{:else}
										<div class="text-sm text-muted-foreground italic">No snippet for this configuration</div>
									{/if}
								</TabsContent>
							{/each}
						</div>
					</Tabs>
				</figure>

				<!-- Instructions -->
				{#if config.instructions}
					<p class="mt-4 text-sm text-muted-foreground">
						{config.instructions}
					</p>
				{/if}
			</TabsContent>
		{/each}
	</Tabs>
</div>
