<script>
	import { getLibraries } from '$lib/data.remote';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';


	let { libraries } = await getLibraries();

</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="mb-8">
		<h1 class="text-4xl font-bold tracking-tight mb-2">Documentation Libraries</h1>
		<p class="text-muted-foreground text-lg">Browse available documentation collections</p>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each libraries as library}
			<a href="library/{library.name}" class="block transition-transform hover:scale-[1.02]">
				<Card class="h-full hover:shadow-lg transition-shadow">
					<CardHeader>
						<CardTitle class="flex items-center justify-between">
							<span>{library.name}</span>
							{#if library.source_type}
								<Badge variant="secondary">{library.source_type}</Badge>
							{/if}
						</CardTitle>
						{#if library.source}
							<CardDescription class="line-clamp-2">
								{library.source.repo || library.source.name || 'No description'}
							</CardDescription>
						{/if}
					</CardHeader>
					{#if library.source?.commit}
						<CardContent>
							<div class="text-xs text-muted-foreground font-mono">
								{library.source.commit.slice(0, 7)}
							</div>
						</CardContent>
					{/if}
				</Card>
			</a>
		{/each}
	</div>
</div>
