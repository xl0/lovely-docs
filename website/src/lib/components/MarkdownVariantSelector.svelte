<script lang="ts">
	import type { MarkdownVariant } from '$lib/markdown';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';

	type TokenCounts = { fulltext?: number; digest?: number; short_digest?: number } | undefined;
	type Props = {
		available: MarkdownVariant[];
		selected: MarkdownVariant;
		labels: Record<MarkdownVariant, string>;
		tokenCounts?: TokenCounts;
	};

	let { available, selected = $bindable(), labels, tokenCounts }: Props = $props();

	function formatPercent(part?: number, total?: number): string | undefined {
		if (!part || !total) return undefined;
		return `${Math.round((part / total) * 100)}%`;
	}
</script>

<div class="flex flex-nowrap gap-2 overflow-x-auto no-scrollbar">
	{#each available as variant}
		<Button
			variant={selected === variant ? 'default' : 'outline'}
			size="sm"
			class="shrink-0"
			onclick={() => {
				goto('#' + variant, {noScroll: true});
			}}>
			{labels[variant]}
			{#if tokenCounts}
				{#if variant === 'fulltext' && tokenCounts.fulltext}
					<span class="ml-1 text-xs opacity-70 hidden sm:inline">({tokenCounts.fulltext.toLocaleString()} tok)</span>
				{:else if variant === 'digest'}
					{#if tokenCounts.digest && tokenCounts.fulltext}
						<span class="ml-1 text-xs opacity-70 hidden sm:inline">({formatPercent(tokenCounts.digest, tokenCounts.fulltext)})</span>
					{/if}
				{:else if variant === 'short_digest'}
					{#if tokenCounts.short_digest && tokenCounts.fulltext}
						<span class="ml-1 text-xs opacity-70 hidden sm:inline"
							>({formatPercent(tokenCounts.short_digest, tokenCounts.fulltext)})</span>
					{/if}
				{/if}
			{/if}
		</Button>
	{/each}
	{#if !available.length}
		<p class="text-sm text-muted-foreground">No markdown available.</p>
	{/if}
</div>
