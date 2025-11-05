<script lang="ts">
	import { resolve } from '$app/paths';
	import Markdown from '$lib/components/Markdown.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent } from '$lib/components/ui/card';
	import dbg from 'debug';
	const debug = dbg('app:page:library:path');

	let { data } = $props();

	debug(data);

	// const { libraryName, itemPath, docItem } = data;
	const libraryName = $derived(data.libraryName);
	const itemPath = $derived(data.itemPath);
	const docItem = $derived(data.docItem);

	type MarkdownVariant = 'fulltext' | 'digest' | 'short_digest' | 'essence';

	const variantLabels: Record<MarkdownVariant, string> = {
		fulltext: 'Full Text',
		digest: 'Digest',
		short_digest: 'Short Digest',
		essence: 'Essence'
	};

	// Get available variants from actual markdown data (excluding essence)
	const availableVariants = $derived(
		(Object.keys(docItem.markdown) as MarkdownVariant[]).filter(
			(variant) => docItem.markdown[variant] && variant !== 'essence'
		)
	);

	// Initialize from hash or default to essence
	let selectedVariant = $state<MarkdownVariant>(
		(typeof window !== 'undefined' && (window.location.hash.slice(1) as MarkdownVariant)) || 'digest'
	);

	let showRaw = $state(false);

	// Update hash when variant changes
	function selectVariant(variant: MarkdownVariant) {
		selectedVariant = variant;
		if (typeof window !== 'undefined') {
			window.location.hash = variant;
		}
	}

	// Listen to hash changes
	$effect(() => {
		if (typeof window === 'undefined') return;

		const handleHashChange = () => {
			const hash = window.location.hash.slice(1) as MarkdownVariant;
			if (hash && availableVariants.includes(hash)) {
				selectedVariant = hash;
			}
		};

		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex items-center justify-between mb-6">
		<nav class="flex items-center gap-2 text-sm text-muted-foreground">
			<a href={resolve('/')} class="hover:text-foreground transition-colors">Home</a>
			<span>/</span>
			<a href={resolve(`/library/${libraryName}`)} class="hover:text-foreground transition-colors">{libraryName}</a>
			<span>/</span>
			{#each itemPath.split('/') as segment, i}
				{#if i > 0}
					<span>/</span>
				{/if}
				{#if i === itemPath.split('/').length - 1}
					<span class="text-foreground">{segment}</span>
				{:else}
					<a
						href={resolve(
							`/library/${libraryName}/${itemPath
								.split('/')
								.slice(0, i + 1)
								.join('/')}`
						)}
						class="hover:text-foreground transition-colors">
						{segment}
					</a>
				{/if}
			{/each}
		</nav>
		<ThemeToggle />
	</div>

	<div class="mb-6">
		<div class="flex items-center justify-between mb-2">
			<h1 class="text-3xl font-bold tracking-tight">
				{itemPath.split('/').pop() || itemPath}
			</h1>
			<Badge variant={docItem.relevant ? 'default' : 'secondary'}>
				{docItem.relevant ? '✓ Relevant' : 'Not relevant'}
			</Badge>
		</div>
		<p class="text-sm text-muted-foreground font-mono">
			Path: {docItem.path}
		</p>
		{#if docItem.markdown.essence}
			<div class="mt-3 text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
				{docItem.markdown.essence}
			</div>
		{/if}
	</div>

	<Card class="mb-6">
		<CardContent>
			<div class="flex items-center justify-between gap-4">
				<div class="flex flex-wrap gap-2">
					{#each availableVariants as variant}
						<Button
							variant={selectedVariant === variant ? 'default' : 'outline'}
							size="sm"
							onclick={() => selectVariant(variant)}>
							{variantLabels[variant]}
							{#if docItem.token_counts}
								{#if variant === 'fulltext' && docItem.token_counts.fulltext}
									<span class="ml-1 text-xs opacity-70">
										({docItem.token_counts.fulltext.toLocaleString()} tok)
									</span>
								{:else if variant === 'digest' && docItem.token_counts.digest && docItem.token_counts.fulltext}
									<span class="ml-1 text-xs opacity-70">
										({Math.round((docItem.token_counts.digest / docItem.token_counts.fulltext) * 100)}%)
									</span>
								{:else if variant === 'short_digest' && docItem.token_counts.short_digest && docItem.token_counts.fulltext}
									<span class="ml-1 text-xs opacity-70">
										({Math.round((docItem.token_counts.short_digest / docItem.token_counts.fulltext) * 100)}%)
									</span>
								{/if}
							{/if}
						</Button>
					{/each}
				</div>
				<Button variant={showRaw ? 'default' : 'outline'} size="sm" onclick={() => (showRaw = !showRaw)}>
					{showRaw ? 'Raw' : 'Markdown'}
				</Button>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardContent class="pt-6">
			{#if docItem.markdown[selectedVariant]}
				{#if showRaw}
					<pre class="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-lg overflow-auto">{docItem.markdown[
							selectedVariant
						]}</pre>
				{:else}
					<Markdown content={docItem.markdown[selectedVariant]!} />
				{/if}
			{:else}
				<div class="rounded-lg bg-destructive/10 p-4 text-destructive">
					<p class="font-semibold">Variant not available</p>
					<p class="text-sm mt-1">{variantLabels[selectedVariant]} is not available for this document.</p>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
