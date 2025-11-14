<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Github } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import dbg from 'debug';

	const debug = dbg('app:page');

	type LibrarySummary = {
		name: string;
		source?: any;
		source_type?: string;
		ecosystems: string[];
		essence?: string;
	};

	const { data } = $props();
	const libraries = $derived(data.libraries as Map<string, LibrarySummary>);

	const allEcosystems = $derived.by<string[]>(() => {
		const set = new Set<string>();
		for (const [, lib] of libraries) {
			for (const eco of lib.ecosystems) set.add(eco);
		}
		return Array.from(set).sort();
	});

	let selectedEcosystems = $state<string[]>([]);

	// initialize selection to all ecosystems once data is available
	$effect(() => {
		selectedEcosystems = allEcosystems;
	});

	const filteredLibraries = $derived.by<[string, LibrarySummary][]>(() => {
		// If there are no ecosystem tags at all, just show all libraries.
		if (!allEcosystems.length) return Array.from(libraries.entries());
		// When some ecosystems exist but none are selected, show nothing.
		if (!selectedEcosystems.length) return [];
		return Array.from(libraries.entries()).filter(([, lib]) =>
			lib.ecosystems.some((eco) => selectedEcosystems.includes(eco))
		);
	});

	$effect(() => {
		debug(data);
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-4xl font-bold tracking-tight mb-2">Documentation Libraries</h1>
			<p class="text-muted-foreground text-lg">Browse available documentation collections</p>
		</div>
		<div class="flex items-center gap-2">
			<a href="https://github.com/xl0/lovely-docs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
				<Button variant="outline" size="icon">
					<Github size={20} />
				</Button>
			</a>
			<ThemeToggle />
		</div>
	</div>

	{#if allEcosystems.length}
		<div class="mb-6 flex flex-wrap gap-2">
			{#each allEcosystems as eco}
				<Button
					variant={selectedEcosystems.includes(eco) ? 'default' : 'outline'}
					size="sm"
					onclick={() => {
						selectedEcosystems = selectedEcosystems.includes(eco)
							? selectedEcosystems.filter((e) => e !== eco)
							: [...selectedEcosystems, eco];
					}}>
					{eco}
				</Button>
			{/each}
		</div>
	{/if}

	{#if allEcosystems.length && !selectedEcosystems.length}
		<p class="text-sm text-muted-foreground">
			No ecosystems selected. Choose one or more ecosystems above to see libraries.
		</p>
	{:else}
		<div class="grid gap-4 grid-cols-1">
			{#each filteredLibraries as [key, library]}
				<a href={key} class="block">
					<Card class="h-full hover:border-primary">
						<CardHeader>
							<CardTitle class="flex flex-col gap-2">
								<div class="flex items-center justify-between gap-3">
									<div class="flex items-center gap-2 flex-wrap">
										<span>{library.name}</span>
										{#if library.ecosystems?.length}
											<div class="flex flex-wrap gap-1">
												{#each library.ecosystems as eco}
													<Badge variant="outline" class="text-[0.7rem] px-1.5 py-0">
														{eco}
													</Badge>
												{/each}
											</div>
										{/if}
									</div>
									<div class="flex items-center gap-2">
										{#if library.source_type}
											<Badge variant="secondary">{library.source_type}</Badge>
										{/if}
										{#if library.source?.commit}
											<span class="text-xs text-muted-foreground font-mono">
												{library.source.commit.slice(0, 7)}
											</span>
										{/if}
									</div>
								</div>
								{#if library.essence}
									<span class="text-sm text-muted-foreground font-normal">{library.essence}</span>
								{:else if library.source}
									<CardDescription>
										{library.source.repo || library.source.name || 'No description'}
									</CardDescription>
								{/if}
							</CardTitle>
						</CardHeader>
					</Card>
				</a>
			{/each}
		</div>
	{/if}
</div>
