<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { mcpState } from '../../state.svelte';
	import Markdown from '$lib/components/Markdown.svelte';

	let { data } = $props<{ data: PageData }>();

	const level = $derived(page.url.hash ? page.url.hash.slice(1) : 'digest');
	const content = $derived(data.content[level] ?? data.content['digest']);

	function navigate(path: string) {
		const parts = path.split('/');
		const lib = parts[0];
		const rest = parts.slice(1).join('/');
		const url = `/mcp/${lib}${rest ? '/' + rest : ''}#${level}`;
		// @ts-ignore
		goto(resolve(url));
	}

	function getFullPath(basePath: string, child: string): string {
		return `${basePath}/${child}`;
	}
</script>

{#snippet childNode(node: unknown, basePath: string)}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const fullPath = getFullPath(basePath, child)}
				<button
					class="w-full text-left text-green-400 hover:text-green-100 hover:bg-green-900/20 transition-colors"
					onclick={() => navigate(fullPath)}>
					<span class="text-green-600">- </span>{child}
				</button>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const fullPath = getFullPath(basePath, key)}
					<div>
						<button
							class="w-full text-left text-green-400 hover:text-green-100 hover:bg-green-900/20 transition-colors"
							onclick={() => navigate(fullPath)}>
							{key}<span class="text-green-600">:</span>
						</button>
						<div class="pl-4 border-l border-green-900/30 ml-1">
							{@render childNode(value, fullPath)}
						</div>
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

{#if mcpState.renderMarkdown && content}
	<div
		class="border border-green-800 bg-black/80 p-6 rounded-md prose prose-invert prose-pre:bg-black/50 prose-pre:border prose-pre:border-green-900 prose-headings:text-green-400 prose-a:text-green-400 prose-strong:text-green-300 prose-code:text-green-300 max-w-none">
		<Markdown content={content.text} />
	</div>
	{#if content.children}
		<div class="border border-green-800 bg-black/80 p-4 rounded-md mt-4 font-mono text-xs">
			<div class="text-green-500 mb-2">Available sub-pages:</div>
			{@render childNode(
				content.children,
				page.params.path ? `${page.params.library ?? ''}/${page.params.path}` : (page.params.library ?? '')
			)}
		</div>
	{/if}
{:else}
	<div class="font-mono text-xs">
		{#if content}
			<pre class="whitespace-pre-wrap text-green-400">{content.text}</pre>
			{#if content.children}
				<div class="mt-4 border-t border-green-900/30 pt-4">
					<div class="text-green-500 mb-2">Available sub-pages:</div>
					{@render childNode(
						content.children,
						page.params.path ? `${page.params.library ?? ''}/${page.params.path}` : (page.params.library ?? '')
					)}
				</div>
			{/if}
		{:else}
			<div class="text-red-500"># Content not available for level: {level}</div>
		{/if}
	</div>
{/if}
