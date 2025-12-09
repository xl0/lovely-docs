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
		selectedMarkdown?: string;
		selectedVariantName?: string;
	};

	let { markdown, tokenCounts, selectedMarkdown = $bindable(''), selectedVariantName = $bindable('') }: Props = $props();
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

	const validVariants: MarkdownVariant[] = ['fulltext', 'digest', 'short_digest', 'essence'];
	let selectedVariant: MarkdownVariant = $derived.by(() => {
		if (!browser || !page.url.hash) return 'digest';
		const hash = page.url.hash.replace('#', '');
		// Hash may be just variant or variant-heading. Check for known variants as prefix.
		for (const v of validVariants) {
			if (hash === v || hash.startsWith(v + '-')) return v;
		}
		return 'digest';
	});

	// Computed selected markdown text
	let currentMarkdown = $derived(markdown[selectedVariant] ?? '');

	// Sync to bindable props
	$effect(() => {
		selectedMarkdown = currentMarkdown;
		selectedVariantName = selectedVariant;
	});
</script>

<div class="flex flex-col gap-2">
	<!-- Variant selector card -->
	<Card class="gap-0 py-0">
		<CardContent class="p-2">
			<div class="flex items-center justify-between gap-4">
				<MarkdownVariantSelector available={availableVariants} selected={selectedVariant} labels={variantLabels} {tokenCounts} />
				<Button variant={showRaw ? 'default' : 'outline'} size="sm" class="hidden sm:inline-flex" onclick={() => (showRaw = !showRaw)}>
					{showRaw ? 'Raw' : 'Markdown'}
				</Button>
			</div>
		</CardContent>
	</Card>

	<!-- Markdown content -->
	<div>
		<MarkdownDisplay markdown={currentMarkdown} {showRaw} variant={selectedVariant} />
	</div>
</div>
