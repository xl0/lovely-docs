<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import type { LayoutData } from '../$types.js';

	const { data } = $props();

	const library = $derived(page.params.library);
	const pageIndex = $derived(data.mcp.pageIndexes.find((p: any) => p.label === library));
</script>

{#snippet treeNode(node: unknown, pathPart: string = '')}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const childPathPart = pathPart ? `${pathPart}/${child}` : child}
				{@const fullPath = `${library}/${childPathPart}`}
				<a
					href={resolve(`/mcp/resources/doc-page/${fullPath}`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					<span class="text-muted-foreground">- </span>{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const childPathPart = pathPart ? `${pathPart}/${key}` : key}
					{@const fullPath = `${library}/${childPathPart}`}
					<div>
						<a
							href={resolve(`/mcp/resources/doc-page/${fullPath}`)}
							class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
							{key}<span class="text-muted-foreground">:</span>
						</a>
						<div class="pl-4 border-l border-muted ml-1">
							{@render treeNode(value, childPathPart)}
						</div>
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

<!-- Content -->
<Card.Root class="border-border bg-card">
	<Card.Content class="overflow-auto min-h-[320px]">
		{#if !!data.mcp.pageIndexes && library}
			<div class="font-mono text-xs">
				<a
					href={resolve(`/mcp/resources/doc-page/${library}`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					/<span class="text-muted-foreground">:</span>
				</a>
				<div class="pl-4 border-l border-muted ml-1">
					{@render treeNode(pageIndex?.tree, '')}
				</div>
			</div>
		{:else}
			<p class="text-xs text-muted-foreground"># no pages found for {library}</p>
		{/if}
	</Card.Content>
</Card.Root>
