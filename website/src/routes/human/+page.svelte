<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Github, Bot, SquareArrowLeft, BookOpen } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Search from '$lib/components/Search.svelte';

	import dbg from 'debug';
	import { resolve } from '$app/paths';

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

	const filteredLibraries = $derived.by<[string, LibrarySummary][]>(() => {
		// If no ecosystems are selected, show all libraries
		console.log(selectedEcosystems);
		if (!selectedEcosystems.length) return Array.from(libraries.entries());
		// Otherwise, filter by selected ecosystems
		return Array.from(libraries.entries()).filter(([, lib]) =>
			lib.ecosystems.some((eco) => selectedEcosystems.includes(eco))
		);
	});
</script>

<div class="from-background to-muted/20 min-h-screen bg-gradient-to-b">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-12 flex items-center justify-between">
			<div class="flex items-baseline gap-3">
				<a href={resolve('/')} aria-label="Go back">
					<Button variant="ghost" size="icon" class="size-8">
						<SquareArrowLeft class="size-6" />
					</Button>
				</a>
				<div>
					<h1
						class="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent">
						Lovely Docs
					</h1>
					<p class="text-muted-foreground mt-2">Browse documentation libraries</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<Search />
				<a href={resolve('/mcp')} title="Switch to MCP view" aria-label="Switch to MCP view">
					<Button
						variant="outline"
						size="icon"
						class="mcp-theme bg-background text-foreground border-border hover:bg-accent">
						<Bot size={24} />
					</Button>
				</a>
				<a href="https://github.com/xl0/lovely-docs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
					<Button variant="outline" size="icon">
						<Github size={20} />
					</Button>
				</a>
				<ThemeToggle />
			</div>
		</div>

		<!-- Ecosystem Filters -->
		{#if allEcosystems.length}
			<div class="mb-8 flex flex-wrap gap-2">
				<span class="text-muted-foreground mr-2 self-center text-sm">Filter by:</span>
				{#each allEcosystems as eco}
					<Button
						variant={selectedEcosystems.includes(eco) ? 'default' : 'outline'}
						size="sm"
						class="transition-all"
						onclick={() => {
							selectedEcosystems = selectedEcosystems.includes(eco)
								? selectedEcosystems.filter((e) => e !== eco)
								: [...selectedEcosystems, eco];
						}}>
						{eco}
					</Button>
				{/each}
				{#if selectedEcosystems.length > 0}
					<Button variant="ghost" size="sm" class="text-muted-foreground" onclick={() => (selectedEcosystems = [])}>
						Clear filters
					</Button>
				{/if}
			</div>
		{/if}

		<!-- Libraries Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredLibraries as [key, library]}
				<a href={resolve(`/human/${key}`)} class="group block">
					<Card
						class="hover:border-primary/50 h-full transition-all duration-200 group-hover:scale-[1.02] hover:shadow-lg">
						<CardHeader class="pb-3">
							<CardTitle class="flex flex-col gap-3">
								<div class="flex items-start justify-between gap-3">
									<div class="flex min-w-0 flex-1 items-center gap-2">
										<BookOpen class="text-primary size-5 shrink-0" />
										<span class="truncate">{library.name}</span>
									</div>
									{#if library.source_type}
										<Badge variant="secondary" class="shrink-0">{library.source_type}</Badge>
									{/if}
								</div>
								{#if library.ecosystems?.length}
									<div class="flex flex-wrap gap-1.5">
										{#each library.ecosystems as eco}
											<Badge variant="outline" class="text-xs">
												{eco}
											</Badge>
										{/each}
									</div>
								{/if}
							</CardTitle>
						</CardHeader>
						<CardContent class="pb-4">
							{#if library.essence}
								<p class="text-muted-foreground line-clamp-3 text-sm">
									{library.essence}
								</p>
							{:else if library.source}
								<CardDescription class="line-clamp-2">
									{library.source.repo || library.source.name || 'No description'}
								</CardDescription>
							{/if}
							{#if library.source?.commit}
								<div class="border-border mt-3 border-t pt-3">
									<span class="text-muted-foreground font-mono text-xs">
										{library.source.commit.slice(0, 7)}
									</span>
								</div>
							{/if}
						</CardContent>
					</Card>
				</a>
			{/each}
		</div>

		{#if filteredLibraries.length === 0}
			<div class="py-12 text-center">
				<p class="text-muted-foreground">No libraries match the selected filters.</p>
			</div>
		{/if}
	</div>
</div>

<Footer />
