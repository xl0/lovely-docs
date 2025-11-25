<script lang="ts">
	import type { LayoutData } from './$types';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { mcpState } from '$lib/mcp-state.svelte';
	import type { Snippet } from 'svelte';
	import { SquareArrowLeft, User } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	const { data, children } = $props<{ data: LayoutData; children: Snippet }>();

	const libraries = data.mcp.libraries;

	const tabs = [
		{ id: 'tools', label: '$ tools', description: 'listLibraries', href: '/mcp/tools/list-libraries' },
		{ id: 'resources', label: '$ resources', description: 'doc-index', href: '/mcp/resources/doc-index' }
	] as const;

	// Determine current mode based on URL
	const mode = $derived(page.route.id?.startsWith('/mcp/tools') ? 'tools' : 'resources');

	// Check if we're on a doc-page route for the markdown toggle
	const isDocPage = $derived(
		page.route.id?.startsWith('/mcp/resources/doc-page/') || page.route.id?.startsWith('/mcp/tools/get-page/')
	);
</script>

<div class="mcp-theme min-h-screen bg-background text-foreground font-mono">
	<div class="w-full px-4 py-8 space-y-2">
		<header class="border-b border-border pb-4 mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
			<div class="flex items-center gap-3">
				<a href={resolve('/')} aria-label="Go back">
					<Button variant="ghost" size="icon" class="size-8">
						<SquareArrowLeft class="size-6" />
					</Button>
				</a>
				<h1 class="text-2xl tracking-widest uppercase">lovely-docs</h1>
			</div>
			<div role="tablist" aria-label="MCP data views" class="flex gap-2 items-center">
				<a href={resolve('/human')} class="">
					<Button variant="outline" size="sm">
						<User size={16} />
					</Button>
				</a>
				<ThemeToggle class="size-8" />

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
							onclick={() => goto(resolve(tab.href))}>
							{tab.label}
							<span class="ml-1 text-[10px] opacity-60">{tab.description}</span>
						</Button>
					{/each}

					{#if isDocPage}
						<Button
							variant={mcpState.renderMarkdown ? 'default' : 'outline'}
							size="sm"
							class="ml-2 font-mono"
							onclick={() => (mcpState.renderMarkdown = !mcpState.renderMarkdown)}
							aria-label="Toggle markdown rendering">
							{mcpState.renderMarkdown ? 'MD: ON' : 'MD: OFF'}
						</Button>
					{/if}
				</div>
			</div>
		</header>

		<section aria-labelledby={`tab-${mode}`}>
			{@render children()}
		</section>
	</div>

	<!-- Hidden links for static site generation crawler -->
	<div class="hidden" aria-hidden="true">
		<!-- Index pages for each ecosystem -->
		<a href={resolve('/human')}>human-index</a>
		<a href={resolve('/mcp/resources/doc-index')}>doc-index</a>

		<!-- Page index for each library -->
		{#each libraries as lib}
			<a href={resolve(`/mcp/resources/page-index/${lib.key}`)}>page-index {lib.key}</a>
		{/each}
	</div>
</div>
