<script lang="ts">
	import { resolve } from '$app/paths';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Tabs, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import UsageInstructions from '$lib/components/UsageInstructions.svelte';
	import {
		BookOpen,
		Bot,
		File,
		Folder,
		Terminal
	} from '@lucide/svelte';

	// Package Manager State
	type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';
	let selectedPm = $state<PackageManager>('npm');

	const pmCommands: Record<PackageManager, { init: string; add: string; list: string }> = {
		npm: {
			init: 'npx -y lovely-docs init',
			add: 'npx -y lovely-docs add',
			list: 'npx -y lovely-docs list'
		},
		pnpm: {
			init: 'pnpm dlx lovely-docs init',
			add: 'pnpm dlx lovely-docs add',
			list: 'pnpm dlx lovely-docs list'
		},
		yarn: {
			init: 'yarn dlx lovely-docs init',
			add: 'yarn dlx lovely-docs add',
			list: 'yarn dlx lovely-docs list'
		},
		bun: {
			init: 'bunx lovely-docs init',
			add: 'bunx lovely-docs add',
			list: 'bunx lovely-docs list'
		}
	};

	// Installation Options State
	let installMode = $state<'digest' | 'both' | 'fulltext'>('digest');
	let includeSummaries = $state(false);
	let includeLlmMap = $state(false);
	let installDir = $state('.lovely-docs');

	const installCommand = $derived.by(() => {
		const baseCmd = pmCommands[selectedPm].add;
		const parts = [baseCmd, 'sveltejs/svelte'];
		if (installMode === 'fulltext') parts.push('--fulltext');
		if (installMode === 'both') parts.push('--both');
		if (includeSummaries) parts.push('--summaries');
		if (!includeLlmMap) parts.push('--no-llms-map');
		return parts.join(' ');
	});

	const treeStructure = $derived.by(() => {
		const items = [];

		// Library level content (Root siblings)
		if (includeSummaries) {
			if (installMode === 'digest') {
				items.push({ name: 'sveltejs_svelte.md', type: 'file', desc: 'Library overview (digest)', level: 0, link: 'sveltejs_svelte#digest' });
			} else if (installMode === 'fulltext') {
				items.push({ name: 'sveltejs_svelte.md', type: 'file', desc: 'Full library docs', level: 0, link: 'sveltejs_svelte#fulltext' });
			} else {
				// both
				items.push({ name: 'sveltejs_svelte.md', type: 'file', desc: 'Library overview (digest)', level: 0, link: 'sveltejs_svelte#digest' });
				items.push({ name: 'sveltejs_svelte.orig.md', type: 'file', desc: 'Full library docs', level: 0, link: 'sveltejs_svelte#fulltext' });
			}
		}

		// Library Directory
		items.push({ name: 'sveltejs_svelte/', type: 'folder', level: 0, link: 'sveltejs_svelte#digest' });

		// LLM Map (Inside library directory)
		if (includeLlmMap) {
			items.push({ name: 'LLM_MAP.md', type: 'file', desc: 'Hierarchical essence tree', level: 1, link: '/LLM_MAP.md' });
		}

		// Introduction summaries
		if (includeSummaries) {
			if (installMode === 'digest') {
				items.push({ name: 'introduction.md', type: 'file', desc: 'Section digest', level: 1, link: 'sveltejs_svelte/introduction#digest' });
			} else if (installMode === 'fulltext') {
				items.push({ name: 'introduction.md', type: 'file', desc: 'Section fulltext', level: 1, link: 'sveltejs_svelte/introduction#fulltext' });
			} else {
				// both
				items.push({ name: 'introduction.md', type: 'file', desc: 'Section digest', level: 1, link: 'sveltejs_svelte/introduction#digest' });
				items.push({ name: 'introduction.orig.md', type: 'file', desc: 'Section fulltext', level: 1, link: 'sveltejs_svelte/introduction#fulltext' });
			}
		}

		// Introduction Directory
		items.push({ name: 'introduction/', type: 'folder', level: 1, link: 'sveltejs_svelte/introduction#digest' });

		const introFiles = ['getting_started', 'svelte_files'];
		for (const name of introFiles) {
			if (installMode === 'digest' || installMode === 'both') {
				items.push({ name: `${name}.md`, type: 'file', desc: 'Page digest', level: 2, link: `sveltejs_svelte/introduction/${name}#digest` });
			}
			if (installMode === 'fulltext') {
				items.push({ name: `${name}.md`, type: 'file', desc: 'Page fulltext', level: 2, link: `sveltejs_svelte/introduction/${name}#fulltext` });
			} else if (installMode === 'both') {
				items.push({ name: `${name}.orig.md`, type: 'file', desc: 'Page fulltext', level: 2, link: `sveltejs_svelte/introduction/${name}#fulltext` });
			}
		}

		// Subdirectory content (summaries) - Siblings of the subdirectory
		if (includeSummaries) {
			if (installMode === 'digest') {
				items.push({ name: 'runes.md', type: 'file', desc: 'Section digest', level: 1, link: 'sveltejs_svelte/runes#digest' });
			} else if (installMode === 'fulltext') {
				items.push({ name: 'runes.md', type: 'file', desc: 'Section fulltext', level: 1, link: 'sveltejs_svelte/runes#fulltext' });
			} else {
				// both
				items.push({ name: 'runes.md', type: 'file', desc: 'Section digest', level: 1, link: 'sveltejs_svelte/runes#digest' });
				items.push({ name: 'runes.orig.md', type: 'file', desc: 'Section fulltext', level: 1, link: 'sveltejs_svelte/runes#fulltext' });
			}
		}

		// Subdirectory
		items.push({ name: 'runes/', type: 'folder', level: 1, link: 'sveltejs_svelte/runes#digest' });

		// Leaf file - Inside subdirectory
		const runeFiles = ['$derived', '$effect', '$state', 'what_are_runes'];
		for (const name of runeFiles) {
			if (installMode === 'digest' || installMode === 'both') {
				items.push({ name: `${name}.md`, type: 'file', desc: 'Page digest', level: 2, link: `sveltejs_svelte/runes/${name}#digest` });
			}
			if (installMode === 'fulltext') {
				items.push({ name: `${name}.md`, type: 'file', desc: 'Page fulltext', level: 2, link: `sveltejs_svelte/runes/${name}#fulltext` });
			} else if (installMode === 'both') {
				items.push({ name: `${name}.orig.md`, type: 'file', desc: 'Page fulltext', level: 2, link: `sveltejs_svelte/runes/${name}#fulltext` });
			}
		}

		return items;
	});

	const simpleRule = $derived.by(() => {
		const type = installMode === 'fulltext' ? 'documentation' : 'dehydrated documentation';
		let text = `We have ${type} in ${installDir}/. When you start a new session, check what's available. Refer to the docs first time you use a feature of a documented library.`;
		if (includeLlmMap) {
			text += ` Each library has an LLM_MAP.md with short summaries for all available pages and directories.`;
		}
		if (includeSummaries) {
			text += ` Directories often have summary files (e.g. directory.md) that provide an overview.`;
		}
		return text;
	});

	const aggressiveRule = $derived.by(() => {
		const type = installMode === 'fulltext' ? 'curated documentation' : 'curated, dehydrated documentation';
		let text = `We have ${type} in ${installDir}/\n\nWORKFLOW:\n1. At the START of EVERY session, run: list_dir on ${installDir}/`;
		let step = 2;
		if (includeLlmMap) {
			text += `\n${step++}. Check the LLM_MAP.md for each relevant library BEFORE using it. Make a mental note on new features that you might not know about.`;
		}
		if (includeSummaries) {
			text += `\n${step++}. Check directory summaries (e.g. folder.md) to understand the structure of the module.`;
		}
		text += `\n${step++}. If documentation exists for a library you're about to use, read the relevant sections before using a feature for the first time.`;
		return text;
	});
</script>

<div class="mx-auto flex max-w-5xl flex-col items-center justify-start space-y-16 p-8">
	<div class="absolute top-4 right-4">
		<ThemeToggle />
	</div>

	<!-- Hero -->
	<div class="space-y-4 text-center">
		<h1 class="text-primary text-6xl font-bold">Lovely Docs</h1>
		<p class="text-muted-foreground text-xl">Hierarchically optimized documentation for AI coding agents</p>
	</div>

	<!-- Browse Options -->
	<div class="flex w-full max-w-md gap-4">
		<Button href={resolve('/human')} variant="default" size="lg" class="flex-1">
			<BookOpen class="mr-2" size={20} />
			Read the docs
		</Button>
	</div>

	<!-- Main Content -->
	<div class="w-full space-y-12 text-left">
		<!-- Why Section -->
		<section class="space-y-4">
			<h2 class="flex items-center gap-2 text-3xl font-bold">
				<Terminal size={28} />
				Why Lovely Docs?
			</h2>
			<div class="text-muted-foreground flex flex-col gap-2 text-lg leading-relaxed">
				<p>AI coding tools work best when given access to up-to-date documentation.</p>
				<p>
					Lovely Docs places the documentation inside a folder (<code>.lovely-docs/</code> by default) in your project. The
					documentation is available in both condensed and fulltext forms - noise is removed from pages, and content summaries
					are created for each directory.
				</p>
				<p>
					Your coding agent should have an easy time searching and reading the documentation using its built-in tools,
					and you can also directly point it to any particular file using
					<code>@.lovely-docs/...</code> or equivalent mechanism.
				</p>
				<p>
					You can also use Lovely Docs <a class="text-primary hover:text-foreground transition-colors" href="#mcp"
						>MCP Server</a
					>, but a local folder works better for AI coding agents.
				</p>
			</div>
		</section>

		<!-- Quick Start -->
		<section class="space-y-4">
			<h2 class="text-3xl font-bold">Quick Start</h2>
			<p class="text-muted-foreground text-lg leading-relaxed">
				Note: The Lovely Docs CLI is written in TypeScript, but your project can be written in any language
			</p>

			<!-- Package Manager Selection -->
			<div class="bg-card rounded-lg border p-1">
				<Tabs bind:value={selectedPm} class="w-full">
					<TabsList class="w-full justify-start bg-transparent p-0 h-auto">
						<TabsTrigger value="npm" class="data-[state=active]:bg-muted px-4 py-2 rounded-md">npm</TabsTrigger>
						<TabsTrigger value="pnpm" class="data-[state=active]:bg-muted px-4 py-2 rounded-md">pnpm</TabsTrigger>
						<TabsTrigger value="yarn" class="data-[state=active]:bg-muted px-4 py-2 rounded-md">yarn</TabsTrigger>
						<TabsTrigger value="bun" class="data-[state=active]:bg-muted px-4 py-2 rounded-md">bun</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<!-- Basic Commands -->
			<div class="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
				<div class="bg-muted rounded-lg p-4 space-y-2">
					<div class="text-sm font-semibold text-foreground flex items-center gap-2">
						<Terminal class="size-4" /> Initialize
					</div>
					<code class="block font-mono text-sm text-muted-foreground">{pmCommands[selectedPm].init}</code>
				</div>
				<div class="bg-muted rounded-lg p-4 space-y-2">
					<div class="text-sm font-semibold text-foreground flex items-center gap-2">
						<BookOpen class="size-4" /> List Libraries
					</div>
					<code class="block font-mono text-sm text-muted-foreground">{pmCommands[selectedPm].list}</code>
				</div>
				<div class="bg-muted rounded-lg p-4 space-y-2">
					<div class="text-sm font-semibold text-foreground flex items-center gap-2">
						<File class="size-4" /> Add Library
					</div>
					<code class="block font-mono text-sm text-muted-foreground">{pmCommands[selectedPm].add} sveltejs/svelte</code>
				</div>
			</div>
		</section>

		<!-- Installation & Configuration -->
		<section class="space-y-8">
			<h2 class="text-3xl font-bold">Directory structure</h2>

			<p>You can experiment with the installed. So far I found that "Diegst only" without directory summaries and llm map works best in Windsurf and Antigravity, but give it a try and let me know how it goes.</p>
			<div class="grid gap-4 lg:grid-cols-2">
				<!-- Interactive Configurator -->
				<div class="rounded-lg border bg-card text-card-foreground shadow-sm font-mono text-sm">
					<div class="p-6">

						<!-- Installation Directory -->
						<div class="flex gap-3">
							<div class="flex flex-col items-center shrink-0">
								<span class="text-cyan-500">◇</span>
								<div class="flex-1 w-px bg-border min-h-4 my-1"></div>
							</div>
							<div class="pb-6 w-full">
								<div>Installation directory:</div>
								<div class="flex items-center gap-2 mt-1 text-muted-foreground">
									<input
										type="text"
										bind:value={installDir}
										class="bg-transparent border-none outline-none p-0 h-auto font-mono text-sm w-full placeholder:text-muted-foreground/50 focus:ring-0"
									/>
								</div>
							</div>
						</div>

						<!-- Installation Mode -->
						<div class="flex gap-3">
							<div class="flex flex-col items-center shrink-0">
								<span class="text-cyan-500">◇</span>
								<div class="flex-1 w-px bg-border min-h-4 my-1"></div>
							</div>
							<div class="pb-6 w-full">
								<div class="mb-2">Installation mode</div>
								<div class="flex flex-col items-start gap-1">
									<button
										class="flex items-center gap-2 hover:text-primary transition-colors"
										onclick={() => installMode = 'both'}
									>
										<span class={installMode === 'both' ? 'text-green-500' : 'text-muted-foreground'}>
											{installMode === 'both' ? '●' : '○'}
										</span>
										<span>Both (Digest + Fulltext)</span>
									</button>
									<button
										class="flex items-center gap-2 hover:text-primary transition-colors"
										onclick={() => installMode = 'digest'}
									>
										<span class={installMode === 'digest' ? 'text-green-500' : 'text-muted-foreground'}>
											{installMode === 'digest' ? '●' : '○'}
										</span>
										<span>Digest Only</span>
									</button>
									<button
										class="flex items-center gap-2 hover:text-primary transition-colors"
										onclick={() => installMode = 'fulltext'}
									>
										<span class={installMode === 'fulltext' ? 'text-green-500' : 'text-muted-foreground'}>
											{installMode === 'fulltext' ? '●' : '○'}
										</span>
										<span>Fulltext Only</span>
									</button>
								</div>
							</div>
						</div>

						<!-- Summaries -->
						<div class="flex gap-3">
							<div class="flex flex-col items-center shrink-0">
								<span class="text-cyan-500">◇</span>
								<div class="flex-1 w-px bg-border min-h-4 my-1"></div>
							</div>
							<div class="pb-6 w-full">
								<div class="mb-2">Install directory summaries?</div>
								<div class="flex items-center gap-4">
									<button
										class="flex items-center gap-2 hover:text-primary transition-colors"
										onclick={() => includeSummaries = true}
									>
										<span class={includeSummaries ? 'text-green-500' : 'text-muted-foreground'}>
											{includeSummaries ? '●' : '○'}
										</span>
										<span>Yes</span>
									</button>
									<button
										class="flex items-center gap-2 hover:text-primary transition-colors"
										onclick={() => includeSummaries = false}
									>
										<span class={!includeSummaries ? 'text-green-500' : 'text-muted-foreground'}>
											{!includeSummaries ? '●' : '○'}
										</span>
										<span>No</span>
									</button>
								</div>
							</div>
						</div>

						<!-- LLM Map -->
						<div class="flex gap-3">
							<div class="flex flex-col items-center shrink-0">
								<span class="text-cyan-500">◇</span>
							</div>
							<div class="w-full">
								<div class="mb-2">Generate LLM_MAP.md?</div>
								<div class="flex items-center gap-4">
									<button
										class="flex items-center gap-2 hover:text-primary transition-colors"
										onclick={() => includeLlmMap = true}
									>
										<span class={includeLlmMap ? 'text-green-500' : 'text-muted-foreground'}>
											{includeLlmMap ? '●' : '○'}
										</span>
										<span>Yes</span>
									</button>
									<button
										class="flex items-center gap-2 hover:text-primary transition-colors"
										onclick={() => includeLlmMap = false}
									>
										<span class={!includeLlmMap ? 'text-green-500' : 'text-muted-foreground'}>
											{!includeLlmMap ? '●' : '○'}
										</span>
										<span>No</span>
									</button>
								</div>
							</div>
						</div>

					</div>
				</div>

				<!-- Dynamic File Structure -->
				<div class="space-y-4">
					<div class="bg-muted rounded-lg p-6 font-mono text-sm h-full">
						<div class="text-muted-foreground mb-2 flex items-center gap-2">
							<Folder class="size-4 text-blue-500 fill-blue-500/20" />
							{installDir}/
						</div>
						{#each treeStructure as item}
							<div class="flex items-center gap-2 py-0.5" style="padding-left: {(item.level + 1) * 1.5}rem">
								{#if item.type === 'folder'}
									<Folder class="size-4 text-blue-500 fill-blue-500/20" />
								{:else}
									<File class="size-4 text-muted-foreground" />
								{/if}
								{#if item.link}
									<a href={item.link.startsWith('/') ? resolve(item.link as any) : resolve(`/human/${item.link}`)} class="hover:underline decoration-primary/50 underline-offset-4 transition-all">
										<span class={item.type === 'folder' ? 'font-bold text-foreground' : 'text-foreground'}>
											{item.name}
										</span>
									</a>
								{:else}
									<span class={item.type === 'folder' ? 'font-bold text-foreground' : 'text-foreground'}>
										{item.name}
									</span>
								{/if}
								{#if item.desc}
									<span class="text-muted-foreground opacity-50 text-xs ml-2"># {item.desc}</span>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<h3 class="text-xl font-bold">Example rules</h3>
				<p class="text-muted-foreground">
					You can add the following rule to your <code>.cursorrules</code> or similar configuration to help your AI agent use the documentation effectively:
				</p>
				<div class="bg-muted rounded-lg p-4 font-mono text-sm">
					{simpleRule}
				</div>

				<p class="text-muted-foreground">Or a more agressive</p>
				<div class="bg-muted rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">{aggressiveRule}</div>
			</div>
		</section>

		<!-- MCP Server (Optional) -->
		<section class="space-y-4 border-t pt-8" id="mcp">
			<h2 class="text-3xl font-bold">MCP Server</h2>
			<div class="text-muted-foreground">
				<p>You can run a Lovely Docs MCP server locally. Or you can access the one I'm running publicly.</p>
			</div>
			<div class="mx-auto w-full max-w-md gap-4">
				<Button href={resolve('/mcp')} variant="default" size="lg" class="flex-1 text-wrap w-full whitespace-pre-wrap text-center">
					<Bot class="mr-2" size={20} />Read the docs the way your agent sees them over MCP
				</Button>
			</div>

			<UsageInstructions />
		</section>
	</div>
</div>
<Footer />
