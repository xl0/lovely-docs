<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	const { data } = $props();

	let resourceCommand = $state<string>('doc-page');
	let selectedPath = $state('');
	let selectedLevel = $state('digest');

	const library = $derived(page.params.library);
	const pageIndex = $derived(data.mcp.pageIndexes.find((p: any) => p.label === library));
</script>

{#snippet treeNode(node: unknown, prefix: string = '')}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const fullPath = prefix ? `${prefix}/${child}` : child}
				<a
					href={resolve(`/mcp/doc-page/${fullPath}`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					<span class="text-muted-foreground">- </span>{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const fullPath = prefix ? `${prefix}/${key}` : key}
					<div>
						<a
							href={resolve(`/mcp/doc-page/${fullPath}`)}
							class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
							{key}<span class="text-muted-foreground">:</span>
						</a>
						<div class="pl-4 border-l border-muted ml-1">
							{@render treeNode(value, fullPath)}
						</div>
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

{#if !!data.mcp.pageIndexes && library}
	<div class="font-mono text-xs">
		<a
			href={resolve(`/mcp/doc-page/${library}`)}
			class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
			/<span class="text-muted-foreground">:</span>
		</a>
		<div class="pl-4 border-l border-muted ml-1">
			{@render treeNode(pageIndex?.tree, library)}
		</div>
	</div>
{:else}
	<p class="text-xs text-muted-foreground"># no pages found for {library}</p>
{/if}
