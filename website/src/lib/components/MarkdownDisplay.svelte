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

	function handleKeyDown(event: KeyboardEvent) {
		if (showRaw && (event.ctrlKey || event.metaKey) && event.key === 'a') {
			event.preventDefault();
			const pre = document.querySelector('.raw-content');
			if (pre) {
				const range = document.createRange();
				range.selectNodeContents(pre);
				const selection = window.getSelection();
				if (selection) {
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if markdown[selected]}
	{#if showRaw}
		<pre
			class="raw-content whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-auto">{markdown[selected]}</pre>
	{:else}
		<Markdown content={markdown[selected]!} />
	{/if}
{:else}
	<div class="rounded-lg bg-destructive/10 p-4 text-destructive">
		<p class="font-semibold">Variant not available</p>
		<p class="text-sm mt-1">{labels[selected]} is not available for this document.</p>
	</div>
{/if}
