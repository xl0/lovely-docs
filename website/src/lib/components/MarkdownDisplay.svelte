<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';
	import type { MarkdownVariant } from '$lib/markdown';

	type Props = {
		markdown: Partial<Record<MarkdownVariant, string>>;
		selected: MarkdownVariant;
		labels: Record<MarkdownVariant, string>;
		showRaw: boolean;
	};

	let { markdown, selected, labels, showRaw }: Props = $props();
</script>

{#if markdown[selected]}
	{#if showRaw}
		<pre class="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-auto">{markdown[selected]}</pre>
	{:else}
		<Markdown content={markdown[selected]!} />
	{/if}
{:else}
	<div class="rounded-lg bg-destructive/10 p-4 text-destructive">
		<p class="font-semibold">Variant not available</p>
		<p class="text-sm mt-1">{labels[selected]} is not available for this document.</p>
	</div>
{/if}
