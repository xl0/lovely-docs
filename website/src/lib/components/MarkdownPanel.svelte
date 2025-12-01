<script lang="ts">
	import MarkdownVariantSelector from '$lib/components/MarkdownVariantSelector.svelte';
	import MarkdownDisplay from '$lib/components/MarkdownDisplay.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import type { MarkdownVariant } from '$lib/markdown';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';

	type TokenCounts = { fulltext?: number; digest?: number; short_digest?: number } | undefined;
	type Props = {
		markdown: Partial<Record<MarkdownVariant, string>>;
		tokenCounts?: TokenCounts;
	};

	let { markdown, tokenCounts}: Props = $props();
    let showRaw = $state(false);
	const isMobile = new MediaQuery('(max-width: 640px)');

    // Force markdown view on mobile since the toggle button is hidden
    $effect(() => {
        if (isMobile.current) {
            showRaw = false;
        }
    });


	const variantLabels: Record<MarkdownVariant, string> = {
		fulltext: 'Full Text',
		digest: 'Digest',
		short_digest: 'Short Digest',
		essence: 'Essence'
	};

	const availableVariants = $derived.by(() => {
		return (Object.keys(markdown) as MarkdownVariant[]).filter((variant) => markdown[variant] && variant !== 'essence');
	});

	let selectedVariant: MarkdownVariant = $derived.by(() => {
        if (!browser || !page.url.hash) return "digest";
        return page.url.hash.replace('#', '') as MarkdownVariant;
    })

</script>

<div class="flex flex-col gap-2">
	<!-- Variant selector card -->
	<Card class="py-0 gap-0">
		<CardContent class="p-2">
			<div class="flex items-center justify-between gap-4">
				<MarkdownVariantSelector
					available={availableVariants}
					selected={selectedVariant}
					labels={variantLabels}
					{tokenCounts} />
				<Button
					variant={showRaw ? 'default' : 'outline'}
					size="sm"
					class="hidden sm:inline-flex"
					onclick={() => (showRaw = !showRaw)}>
					{showRaw ? 'Raw' : 'Markdown'}
				</Button>
			</div>
		</CardContent>
	</Card>

	<!-- Markdown content -->
	<div>
		<MarkdownDisplay {markdown} selected={selectedVariant} labels={variantLabels} {showRaw} />
	</div>
</div>
