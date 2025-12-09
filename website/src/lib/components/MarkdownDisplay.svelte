<script lang="ts">
	import Markdown from '$lib/components/Markdown.svelte';

	type Props = {
		markdown: string;
		showRaw: boolean;
		variant?: string;
	};

	let { markdown, showRaw, variant = '' }: Props = $props();

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

{#if markdown}
	{#if showRaw}
		<pre class="raw-content bg-muted overflow-auto rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">{markdown}</pre>
	{:else}
		<Markdown content={markdown} {variant} />
	{/if}
{:else}
	<div class="bg-destructive/10 text-destructive rounded-lg p-4">
		<p class="font-semibold">Content not available</p>
		<p class="mt-1 text-sm">This variant is not available for this document.</p>
	</div>
{/if}
