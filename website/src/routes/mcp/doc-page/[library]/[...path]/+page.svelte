<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';
	import * as Card from '$lib/components/ui/card';
	import { mcpState } from '../../../state.svelte';

	let { data } = $props();

	const level = $derived(page.url.hash ? page.url.hash.slice(1) : 'digest');
	const content = $derived(data.content[level] ?? data.content['digest']);
</script>

{#snippet childNode(node: unknown, basePath: string)}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const fullPath = `${basePath}/${child}`}
				<a
					href={resolve(`/mcp/doc-page/${fullPath}#${level}`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					<span class="text-muted-foreground">- </span>{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const fullPath = `${basePath}/${key}`}
					<div>
						<a
							href={resolve(`/mcp/doc-page/${fullPath}#${level}`)}
							class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
							{key}<span class="text-muted-foreground">:</span>
						</a>
						<div class="pl-4 border-l border-muted ml-1">
							{@render childNode(value, fullPath)}
						</div>
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

{#if mcpState.renderMarkdown && content}
	<Markdown content={content.text} />

	{#if content.children && Array.isArray(content.children) && content.children.length > 0}
		<Card.Root class="border-border bg-card">
			<Card.Content class="font-mono text-xs">
				<div class="text-foreground/70 mb-2">Available sub-pages:</div>
				{@render childNode(
					content.children,
					page.params.path ? `${page.params.library ?? ''}/${page.params.path}` : (page.params.library ?? '')
				)}
			</Card.Content>
		</Card.Root>
	{/if}
{:else}
	<div class="font-mono text-xs">
		{#if content}
			<pre class="whitespace-pre-wrap text-foreground">{content.text}</pre>
			{#if content.children && Array.isArray(content.children) && content.children.length > 0}
				<div class="mt-4 border-t border-border pt-4">
					<div class="text-foreground/70 mb-2">Available sub-pages:</div>
					{@render childNode(
						content.children,
						page.params.path ? `${page.params.library ?? ''}/${page.params.path}` : (page.params.library ?? '')
					)}
				</div>
			{/if}
		{:else}
			<div class="text-destructive"># Content not available for level: {level}</div>
		{/if}
	</div>
{/if}
