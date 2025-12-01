<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Github, Bot, SquareArrowLeft, BookOpen, Search as SearchIcon } from '@lucide/svelte';
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
	let libraryQuery = $state('');

	const filteredLibraries = $derived.by<[string, LibrarySummary][]>(() => {
		// Filter by ecosystems
		let filtered = Array.from(libraries.entries());

		if (selectedEcosystems.length) {
			filtered = filtered.filter(([, lib]) =>
				lib.ecosystems.some((eco) => selectedEcosystems.includes(eco))
			);
		}

		// Filter by search query
		if (libraryQuery.trim()) {
			const query = libraryQuery.toLowerCase();
			filtered = filtered.filter(([key, lib]) => {
				return lib.name.toLowerCase().includes(query) || key.toLowerCase().includes(query);
			});
		}

		return filtered;
	});
</script>

<div class="from-background to-muted/20 min-h-screen bg-linear-to-b">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<div class="mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex items-baseline gap-3">
				<a href={resolve('/')} aria-label="Go back">
					<Button variant="ghost" size="icon" class="size-8">
						<SquareArrowLeft class="size-6" />
					</Button>
				</a>
				<div>
					<h1
						class="from-foreground to-foreground/70 bg-linear-to-r bg-clip-text text-5xl font-bold tracking-tight text-transparent">
						Lovely Docs
					</h1>
					<p class="text-muted-foreground mt-2">Browse documentation libraries</p>
				</div>
			</div>
			<div class="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
				<Search />
				<div class="flex items-center gap-2">
					<a href={resolve('/mcp')} title="Switch to MCP view" aria-label="Switch to MCP view">
						<Button
							variant="outline"
							size="icon"
							class="mcp-theme bg-background text-foreground border-border hover:bg-accent">
							<Bot size={24} />
						</Button>
					</a>
					<a
						href="https://github.com/xl0/lovely-docs"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub">
						<Button variant="outline" size="icon">
							<Github size={20} />
						</Button>
					</a>
					<ThemeToggle />
				</div>
			</div>
		</div>

		<!-- Ecosystem Filters & Search -->
		<div class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{#if allEcosystems.length}
				<div class="flex flex-wrap gap-2">
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
				</div>
			{/if}

			<div class="relative w-full max-w-xs">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<SearchIcon class="text-muted-foreground size-4" />
				</div>
				<input
					type="text"
					placeholder="Filter libraries..."
					class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 pl-9 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					bind:value={libraryQuery} />
			</div>
		</div>

		<!-- Libraries Grid -->
		<div class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
			{#each filteredLibraries as [key, library]}
				<a href={resolve(`/human/${key}`)} class="group block">
					<Card
						class="hover:border-primary/50 h-full transition-all duration-200 group-hover:scale-[1.02] hover:shadow-lg py-0 gap-0">
						<CardHeader class="p-3 pb-1.5">
							<CardTitle class="text-base">
								<div class="flex items-center gap-2">
									<BookOpen class="text-primary size-4 shrink-0" />
									<span class="truncate shrink-0">{library.name}</span>

									{#if library.ecosystems?.length}
										{#each library.ecosystems as eco}
											<Badge variant="secondary" class="text-[10px] h-5 px-1.5 shrink-0 font-normal">
												{eco}
											</Badge>
										{/each}
									{/if}

									<div class="flex-1"></div>

									{#if library.source_type}
										<Badge
											variant="outline"
											class="text-[10px] h-5 px-1.5 shrink-0 hidden sm:inline-flex font-normal">
											{library.source_type}
										</Badge>
									{/if}

									{#if library.source?.commit}
										<span
											class="text-muted-foreground font-mono text-[10px] shrink-0 hidden md:inline-block font-normal">
											{library.source.commit.slice(0, 7)}
										</span>
									{/if}
								</div>
							</CardTitle>
						</CardHeader>
						<CardContent class="p-3 pt-0">
							<p class="text-muted-foreground text-sm line-clamp-2">
								{library.essence || library.source?.repo || library.source?.name || 'No description'}
							</p>
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
