<script lang="ts">
	import { page } from '$app/state';
	import { getLibraryData } from '$lib/data.remote';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	
	const libraryName = page.params.name || '';
	
	// Helper to build navigation path from original key and map data
	function buildNavPath(originalPath: string, mapData: Record<string, any>): string {
		const entry = mapData[originalPath];
		
		if (entry.type === 'page') {
			// It's a page
			const pathParts = originalPath.split('/');
			const dirPart = pathParts.slice(0, -1).join('/');
			
			const dirInfo = dirPart ? mapData[dirPart] : null;
			const dirName = dirInfo?.name || '';
			
			return dirPart ? `${dirName}/${entry.name}` : entry.name;
		} else {
			// It's a directory
			return entry.name;
		}
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="mb-6">
		<a href="/" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
			← Back to libraries
		</a>
	</div>
	
	<h1 class="text-4xl font-bold tracking-tight mb-8">{libraryName}</h1>

	{#await getLibraryData(libraryName)}
		<div class="flex items-center justify-center py-12">
			<p class="text-muted-foreground">Loading library data...</p>
		</div>
	{:then data}
		{#if data.source}
			<Card class="mb-8">
				<CardHeader>
					<CardTitle>Source Information</CardTitle>
				</CardHeader>
				<CardContent>
					<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
						{#if data.source.repo}
							<dt class="font-semibold text-muted-foreground">Repository:</dt>
							<dd class="font-mono text-xs">{data.source.repo}</dd>
						{/if}
						{#if data.source.commit}
							<dt class="font-semibold text-muted-foreground">Commit:</dt>
							<dd class="font-mono text-xs">{data.source.commit}</dd>
						{/if}
						{#if data.source.doc_dir}
							<dt class="font-semibold text-muted-foreground">Documentation Directory:</dt>
							<dd class="font-mono text-xs">{data.source.doc_dir}</dd>
						{/if}
					</dl>
				</CardContent>
			</Card>
		{/if}
		
		<div class="mb-4">
			<h2 class="text-2xl font-semibold mb-2">Documentation Structure</h2>
			<p class="text-sm text-muted-foreground">Click on any item to view its documentation</p>
		</div>
		
		<div class="space-y-2">
			{#each Object.entries(data.map).sort(([a], [b]) => a.localeCompare(b)) as [path, info]}
				<a href="/library/{libraryName}/{buildNavPath(path, data.map)}" class="block">
					<Card class="hover:bg-accent transition-colors">
						<CardContent class="py-4">
							<div class="flex items-center justify-between">
								<div class="flex-1">
									{#if typeof info === 'object' && info.name}
										<div class="font-semibold">{info.name}</div>
										<div class="text-xs text-muted-foreground font-mono mt-1">{path}</div>
									{:else}
										<div class="font-mono text-sm">{path}</div>
									{/if}
								</div>
								{#if typeof info === 'object' && info.relevant !== undefined}
									<Badge variant={info.relevant ? 'default' : 'secondary'}>
										{info.relevant ? '✓ Relevant' : 'Not relevant'}
									</Badge>
								{/if}
							</div>
						</CardContent>
					</Card>
				</a>
			{/each}
		</div>
	{:catch error}
		<Card class="border-destructive">
			<CardContent class="py-6">
				<p class="text-destructive">Error loading library: {error.message}</p>
			</CardContent>
		</Card>
	{/await}
</div>
