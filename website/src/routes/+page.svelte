<script lang="ts">
	import { resolve } from '$app/paths';
	import { BookOpen, Bot, Terminal, FileText } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import UsageInstructions from '$lib/components/UsageInstructions.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	// Package manager state
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
</script>

<div class="mx-auto flex max-w-4xl flex-col items-center justify-start space-y-16 p-8">
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
			Human View
		</Button>

		<Button href={resolve('/mcp')} variant="outline" size="lg" class="flex-1">
			<Bot class="mr-2" size={20} />
			Agent View
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
					Actually, even some humans prefer the high-signal style of Lovely Docs: <a
						class="text-primary hover:text-foreground transition-colors"
						href={resolve('/human')}>Human view</a>
				</p>
				<p>
					An alternative approach is to use MCP, but it's just not the right protocol for accessing documentation. It's
					token-inefficient, pollutes the context window even when unused, lacks the flexibility of agent-specific
					tools, and in practice agents are very reluctant to use it. See <a
						class="text-primary hover:text-foreground transition-colors"
						href="#mcp">MCP Server</a> for setup instructions if you really want to use MCP.
				</p>
			</div>
		</section>

		<!-- Quick Start -->
		<section class="space-y-4">
			<h2 class="text-3xl font-bold">Quick Start</h2>
			<p class="text-muted-foreground text-lg leading-relaxed">
				Note: The Lovely Docs CLI is written in TypeScript, but your project can be written in any language
			</p>
			<figure class="bg-card relative rounded-lg border">
				<Tabs bind:value={selectedPm}>
					<!-- Package Manager Tabs -->
					<div class="flex items-center gap-2 border-b px-4 py-2">
						<div class="bg-foreground flex size-4 items-center justify-center rounded-[1px] opacity-70">
							<Terminal class="text-background size-3" />
						</div>
						<TabsList class="h-auto gap-1 rounded-none bg-transparent p-0">
							<TabsTrigger
								value="npm"
								class="data-[state=active]:border-input data-[state=active]:bg-accent h-7 rounded-md border border-transparent px-3 py-1 text-sm"
								>npm</TabsTrigger>
							<TabsTrigger
								value="pnpm"
								class="data-[state=active]:border-input data-[state=active]:bg-accent h-7 rounded-md border border-transparent px-3 py-1 text-sm"
								>pnpm</TabsTrigger>
							<TabsTrigger
								value="yarn"
								class="data-[state=active]:border-input data-[state=active]:bg-accent h-7 rounded-md border border-transparent px-3 py-1 text-sm"
								>yarn</TabsTrigger>
							<TabsTrigger
								value="bun"
								class="data-[state=active]:border-input data-[state=active]:bg-accent h-7 rounded-md border border-transparent px-3 py-1 text-sm"
								>bun</TabsTrigger>
						</TabsList>
					</div>

					<!-- Code Content -->
					<div class="overflow-x-auto">
						<TabsContent value="npm" class="m-0 space-y-3 p-4">
							<pre class="overflow-x-auto"><code class="font-mono text-sm">{pmCommands.npm.init}</code></pre>
							<pre class="overflow-x-auto"><code class="font-mono text-sm"
									>{pmCommands.npm.add} sveltejs_svelte</code></pre>
						</TabsContent>
						<TabsContent value="pnpm" class="m-0 space-y-3 p-4">
							<pre class="overflow-x-auto"><code class="font-mono text-sm">{pmCommands.pnpm.init}</code></pre>
							<pre class="overflow-x-auto"><code class="font-mono text-sm"
									>{pmCommands.pnpm.add} sveltejs_svelte</code></pre>
						</TabsContent>
						<TabsContent value="yarn" class="m-0 space-y-3 p-4">
							<pre class="overflow-x-auto"><code class="font-mono text-sm">{pmCommands.yarn.init}</code></pre>
							<pre class="overflow-x-auto"><code class="font-mono text-sm"
									>{pmCommands.yarn.add} sveltejs_svelte</code></pre>
						</TabsContent>
						<TabsContent value="bun" class="m-0 space-y-3 p-4">
							<pre class="overflow-x-auto"><code class="font-mono text-sm">{pmCommands.bun.init}</code></pre>
							<pre class="overflow-x-auto"><code class="font-mono text-sm"
									>{pmCommands.bun.add} sveltejs_svelte</code></pre>
						</TabsContent>
					</div>
				</Tabs>
			</figure>
		</section>

		<!-- File Structure -->
		<section class="space-y-4">
			<h2 class="flex items-center gap-2 text-3xl font-bold">
				<FileText size={28} />
				File Structure
			</h2>
			<p class="text-muted-foreground">
				Documentation is installed in <code class="bg-muted rounded px-1.5 py-0.5 text-sm">.lovely-docs/</code>:
			</p>
			<pre class="bg-muted overflow-x-auto rounded-lg p-4 text-sm"><code
					>├── sveltejs_svelte.md           # Library overview (digest)
├── sveltejs_svelte.orig.md      # Full library docs
└── sveltejs_svelte/
    ├── LLM_MAP.md               # Hierarchical essence tree
    ├── runes.md                 # Section digest
    ├── runes.orig.md            # Section fulltext
    └── runes/
        ├── $derived.md          # Page digest
        └── $derived.orig.md     # Page fulltext</code></pre>
			<p class="text-muted-foreground">
				<strong>LLM_MAP.md</strong> provides a hierarchical overview with essence summaries at each level. Agents read this
				first to understand structure, then drill down to specific pages as needed.
			</p>

			<!-- Example LLM_MAP.md -->
			<details class="mt-4">
				<summary
					class="text-muted-foreground hover:text-foreground cursor-pointer text-sm font-semibold transition-colors"
					>Example LLM_MAP.md</summary>
				<pre class="bg-muted mt-3 overflow-x-auto rounded-lg p-4 text-sm"><code
						># sveltejs/svelte

Complete reference for Svelte 5 framework covering runes-based reactivity, template syntax, styling, component lifecycle, state management, animations, and migration from legacy mode.

  ./introduction.md: Svelte is a compiler framework for building UIs with components that combine HTML, CSS, and JavaScript, with setup via SvelteKit or Vite.
    ./introduction/overview.md: Svelte is a compiler-based framework for building web UIs by transforming declarative components into optimized JavaScript.
    ./introduction/getting_started.md: Instructions for setting up a new Svelte project using SvelteKit or Vite, with editor tooling and support resources.
    ./introduction/svelte_files.md: Svelte components are written in .svelte files with optional script, style, and markup sections; script blocks run per-instance while script module blocks run once at module load.
    ./introduction/.svelte.js_and_.svelte.ts_files.md: Svelte modules (.svelte.js/.svelte.ts) enable runes for reactive logic and state sharing.
    ./introduction/introduction.md: Documentation introduction page with no visible content in the provided excerpt.
  ./runes.md: Compiler-controlled `$`-prefixed keywords that manage reactive state, derived values, side effects, component inputs, and debugging in Svelte.
    ./runes/what_are_runes.md: Runes are $ -prefixed keywords in Svelte that control the compiler and are part of the language syntax.
    ./runes/$state.md: The $state rune creates reactive state in Svelte; arrays and objects become deeply reactive proxies, with variants for raw non-reactive state, snapshots, and eager updates.
    ./runes/$derived.md: The $derived rune creates reactive computed values that automatically update when their dependencies change, with support for complex derivations via $derived.by and temporary value overrides.
    ./runes/$effect.md: Effects run side effects when state updates, automatically tracking synchronous dependencies and re-running on changes, with variants for pre-DOM execution, tracking context detection, and manual control.
[...]
</code></pre>
			</details>
		</section>

		<!-- CLI Usage -->
		<section class="space-y-4">
			<h2 class="text-3xl font-bold">CLI Usage</h2>
			<div class="grid gap-3">
				<div class="space-y-2">
					<div class="text-muted-foreground text-sm font-semibold">Initialize</div>
					<code class="bg-muted block rounded px-4 py-2 font-mono text-sm">{pmCommands[selectedPm].init}</code>
				</div>
				<div class="space-y-2">
					<div class="text-muted-foreground text-sm font-semibold">List available libraries</div>
					<code class="bg-muted block rounded px-4 py-2 font-mono text-sm">{pmCommands[selectedPm].list}</code>
				</div>
				<div class="space-y-2">
					<div class="text-muted-foreground text-sm font-semibold">Add documentation</div>
					<code class="bg-muted block rounded px-4 py-2 font-mono text-sm"
						>{pmCommands[selectedPm].add} &lt;library&gt;</code>
				</div>
			</div>
		</section>

		<!-- MCP Server (Optional) -->
		<section class="space-y-4 border-t pt-8" id="mcp">
			<h2 class="text-3xl font-bold">MCP Server</h2>
			<div class="text-muted-foreground">
				<p>You can run a Lovely Docs MCP server locally. Or you can access the one I'm running publicly.</p>
			</div>
			<UsageInstructions />
		</section>
	</div>
</div>
