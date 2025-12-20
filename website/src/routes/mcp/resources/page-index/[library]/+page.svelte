<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import type { LayoutData } from '../$types.js';

	const { data } = $props();

	const library = $derived(page.params.library);
	const pageIndex = $derived(data.pageIndex);
	const verbose = $derived(page.url.hash.slice(1).includes('verbose=true'));
</script>

{#snippet treeNode(node: unknown, pathPart: string = '')}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const childPathPart = pathPart && pathPart !== '/' ? `${pathPart}/${child}` : child}
				{@const fullPath = childPathPart === '/' ? library : `${library}/${childPathPart}`}
				<a
					href={resolve(`/mcp/resources/doc-page/${fullPath}`)}
					class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
					<span class="text-muted-foreground">-</span>
					{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const childPathPart = pathPart && pathPart !== '/' ? `${pathPart}/${key}` : key}
					{@const fullPath = childPathPart === '/' ? library : `${library}/${childPathPart}`}
					<div>
						<a
							href={resolve(`/mcp/resources/doc-page/${fullPath}`)}
							class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
							{key}
							<span class="text-muted-foreground">:</span>
						</a>
						<div class="border-muted ml-1 border-l pl-4">
							{@render treeNode(value, childPathPart)}
						</div>
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

{#snippet verboseTreeNode(node: unknown, pathPart: string = '')}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const childPathPart = pathPart && pathPart !== '/' ? `${pathPart}/${key}` : key}
					{@const fullPath = childPathPart === '/' ? library : `${library}/${childPathPart}`}
					{@const essence = typeof value === 'string' ? value : (value as any).essence}
					{@const children = typeof value === 'object' && value !== null ? (value as any).children : null}

					<div class="">
						<a
							href={resolve(`/mcp/resources/doc-page/${fullPath}`)}
							class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left text-nowrap transition-colors">
							{key}
							<span class="text-muted-foreground shrink-0 whitespace-nowrap">: {essence}</span>
						</a>

						{#if children}
							<div class="border-muted ml-1 border-l pl-4">
								{@render verboseTreeNode(children, childPathPart)}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

<!-- Content -->
<Card.Root class="border-border bg-card">
	<Card.Content class="min-h-[320px] overflow-auto">
		{#if pageIndex && library}
			<div class="font-mono text-xs">
				{#if verbose}
					{@render verboseTreeNode(pageIndex?.verboseTree, '')}
				{:else}
					{@render treeNode(pageIndex?.tree, '')}
				{/if}
			</div>
		{:else}
			<p class="text-muted-foreground text-xs"># no pages found for {library}</p>
		{/if}
	</Card.Content>
</Card.Root>
