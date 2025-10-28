<script lang="ts">
	import { page } from '$app/state';
	import { getMarkdown, getLibraryData, type MarkdownVariant } from '$lib/data.remote';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import Markdown from '$lib/components/Markdown.svelte';
	
	const libraryName = page.params.name || '';
	const itemPath = page.params.path || ''; // This is now a name-based path like "Introduction/getting-started"
	
	let selectedVariant = $state<MarkdownVariant>('essence');
	
	// Helper to find original key from name-based path
	function findOriginalKey(namePath: string, mapData: Record<string, any>): string | null {
		for (const [key, value] of Object.entries(mapData)) {
			if (typeof value === 'object' && value.name) {
				// Build the name-based path for this key
				if (value.type === 'page') {
					const keyParts = key.split('/');
					const dirPart = keyParts.slice(0, -1).join('/');
					const dirInfo = dirPart ? mapData[dirPart] : null;
					const dirName = dirInfo?.name || '';
					const fileName = value.name;
					const builtPath = dirPart ? `${dirName}/${fileName}` : fileName;
					if (builtPath === namePath) return key;
				} else {
					if (value.name === namePath) return key;
				}
			}
		}
		return null;
	}
	
	const variantLabels: Record<MarkdownVariant, string> = {
		fulltext: 'Full Text',
		digest: 'Digest',
		short_digest: 'Short Digest',
		essence: 'Essence'
	};
</script>

{#if !itemPath}
	<div class="container mx-auto px-4 py-8 max-w-6xl">
		<p class="text-muted-foreground">Redirecting...</p>
	</div>
	<script>
		window.location.href = `/library/${libraryName}`;
	</script>
{:else}
<div class="container mx-auto px-4 py-8 max-w-6xl">
	<nav class="flex items-center gap-2 text-sm text-muted-foreground mb-6">
		<a href="/" class="hover:text-foreground transition-colors">Home</a>
		<span>/</span>
		<a href="/library/{libraryName}" class="hover:text-foreground transition-colors">{libraryName}</a>
		<span>/</span>
		<span class="text-foreground">{itemPath}</span>
	</nav>

	{#await getLibraryData(libraryName)}
		<div class="flex items-center justify-center py-12">
			<p class="text-muted-foreground">Loading...</p>
		</div>
	{:then data}
		{@const originalKey = findOriginalKey(itemPath, data.map)}
		{@const itemInfo = originalKey ? data.map[originalKey] : null}
		{@const availableVariants = itemInfo?.type === 'directory' 
			? (['fulltext', 'digest', 'essence'] as const)
			: (['fulltext', 'digest', 'short_digest', 'essence'] as const)}
		
		<div class="mb-6">
			<div class="flex items-center justify-between mb-2">
				<h1 class="text-3xl font-bold tracking-tight">
					{#if itemInfo?.name}
						{itemInfo.name}
					{:else}
						{itemPath}
					{/if}
				</h1>
				{#if itemInfo?.relevant !== undefined}
					<Badge variant={itemInfo.relevant ? 'default' : 'secondary'}>
						{itemInfo.relevant ? '✓ Relevant' : 'Not relevant'}
					</Badge>
				{/if}
			</div>
			{#if originalKey}
				<p class="text-sm text-muted-foreground font-mono">Key: {originalKey}</p>
			{/if}
		</div>
		
		<Card class="mb-6">
			<CardHeader>
				<CardTitle class="text-lg">View Mode</CardTitle>
				<CardDescription>Select how you want to view this documentation</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-2">
					{#each availableVariants as variant}
						<Button 
							variant={selectedVariant === variant ? 'default' : 'outline'}
							size="sm"
							onclick={() => selectedVariant = variant}
						>
							{variantLabels[variant]}
						</Button>
					{/each}
				</div>
			</CardContent>
		</Card>
		
		<Card>
			<CardContent class="pt-6">
				{#await getMarkdown({ library: libraryName, path: itemPath, variant: selectedVariant })}
					<div class="flex items-center justify-center py-12">
						<p class="text-muted-foreground">Loading {variantLabels[selectedVariant]}...</p>
					</div>
				{:then markdown}
					<Markdown content={markdown} />
				{:catch error}
					<div class="rounded-lg bg-destructive/10 p-4 text-destructive">
						<p class="font-semibold">Failed to load markdown</p>
						<p class="text-sm mt-1">{error.message}</p>
					</div>
				{/await}
			</CardContent>
		</Card>
	{:catch error}
		<Card class="border-destructive">
			<CardContent class="py-6">
				<p class="text-destructive font-semibold">Error: {error.message}</p>
			</CardContent>
		</Card>
	{/await}
</div>
{/if}
