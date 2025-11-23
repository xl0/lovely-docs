<script lang="ts">
	import type { LayoutData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { mcpState } from './state.svelte';
	import type { Snippet } from 'svelte';

	const { data, children } = $props<{ data: LayoutData; children: Snippet }>();

	const libraries = data.mcp.libraries;
	const ecosystems = data.mcp.ecosystems;

	const tabs = [
		{ id: 'tools', label: '$ tools', description: 'listLibraries' },
		{ id: 'resources', label: '$ resources', description: 'doc-index' }
	] as const;
	type TabId = (typeof tabs)[number]['id'];

	let mode = $state<TabId>('resources');
	let selectedEcosystem = $state('*');
	let verbose = $state(false);

	// Check if we're on a doc-page route for the markdown toggle
	const isDocPage = $derived(page.route.id === '/mcp/doc-page/[library]/[...path]');

	function handleEcosystemChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedEcosystem = select.value;
	}

	function toggleVerbose() {
		verbose = !verbose;
	}

	const currentTools = $derived(
		selectedEcosystem === '*' ? data.mcp.tools : data.mcp.tools.filter((t: any) => t.label === selectedEcosystem)
	);
	const ecosystemOptions = $derived(['*', ...ecosystems]);
</script>

<div class="mcp-theme min-h-screen bg-background text-foreground font-mono">
	<div class="w-full px-4 py-8 space-y-2">
		<header class="border-b border-border pb-4 mb-4">
			<h1 class="text-2xl tracking-widest uppercase">lovely-docs :: mcp console</h1>
			<p class="text-xs text-muted-foreground mt-1">
				Fake MCP interface over static docs. No network. No daemons. Just bits.
			</p>
		</header>

		<Card.Root class="border-border bg-card/40">
			<Card.Content class="">
				<div role="tablist" aria-label="MCP data views" class="flex gap-2 items-center">
					{#each tabs as tab}
						<Button
							variant={mode === tab.id ? 'default' : 'outline'}
							size="sm"
							class="uppercase tracking-wide font-mono"
							id={`tab-${tab.id}`}
							role="tab"
							aria-selected={mode === tab.id}
							aria-controls={`panel-${tab.id}`}
							onclick={() => (mode = tab.id)}>
							{tab.label}
							<span class="ml-1 text-[10px] opacity-60">{tab.description}</span>
						</Button>
					{/each}

					{#if isDocPage}
						<Button
							variant={mcpState.renderMarkdown ? 'default' : 'outline'}
							size="sm"
							class="ml-auto font-mono"
							onclick={() => (mcpState.renderMarkdown = !mcpState.renderMarkdown)}
							aria-label="Toggle markdown rendering">
							{mcpState.renderMarkdown ? 'MD: ON' : 'MD: OFF'}
						</Button>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		{#if mode === 'tools'}
			<section class="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
				<aside class="space-y-4">
					<Card.Root class="border-border bg-card">
						<Card.Content class="space-y-2">
							<div class="text-xs text-foreground/70">ecosystem</div>
							<select
								class="w-full bg-background text-foreground border border-border text-xs px-1 py-0.5 rounded"
								value={selectedEcosystem}
								onchange={handleEcosystemChange}>
								{#each ecosystemOptions as eco}
									<option value={eco}>{eco}</option>
								{/each}
							</select>
						</Card.Content>
					</Card.Root>

					<Card.Root class="border-border bg-card">
						<Card.Content class="flex items-center justify-between text-xs">
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" class="accent-primary" checked={verbose} onchange={toggleVerbose} />
								<span>verbose</span>
							</label>
							<span class="text-muted-foreground">--detail {verbose ? 'on' : 'off'}</span>
						</Card.Content>
					</Card.Root>
				</aside>

				<Card.Root class="border-border bg-card">
					<Card.Content class="overflow-auto min-h-[320px]" role="tabpanel" aria-labelledby="tab-tools">
						<h2 class="text-sm text-foreground/90 mb-2">$ mcp tools :: listLibraries</h2>
						{#if currentTools.length === 0}
							<p class="text-xs text-muted-foreground"># no tools for this ecosystem</p>
						{:else}
							{#each currentTools as t}
								<div class="mb-4">
									<div class="text-xs text-foreground/70 mb-1"># ecosystem: {t.label}</div>
									<pre class="text-xs whitespace-pre-wrap">
{verbose ? t.verboseYaml : t.payloadYaml}
									</pre>
								</div>
							{/each}
						{/if}
					</Card.Content>
				</Card.Root>
			</section>
		{:else}
			<section aria-labelledby="tab-resources">
				{@render children()}
			</section>
		{/if}
	</div>

	<!-- Hidden links for static site generation crawler -->
	<div class="hidden" aria-hidden="true">
		<!-- Index pages for each ecosystem -->
		<a href={resolve('/mcp/doc-index')}>doc-index</a>
		<a href={resolve('/mcp/doc-index-verbose')}>doc-index-verbose</a>
		<!-- Page index for each library -->
		{#each libraries as lib}
			<a href={resolve(`/mcp/page-index/${lib.key}`)}>page-index {lib.key}</a>
		{/each}
	</div>
</div>
