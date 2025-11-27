<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Github, Bot, ArrowLeft, SquareArrowLeft } from '@lucide/svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

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

<div class="container mx-auto">
	<div class="flex items-center justify-between mb-8">
		<div class="flex items-baseline gap-2">
			<a href={resolve('/')} aria-label="Go back">
				<Button variant="ghost" size="icon" class="size-8">
					<SquareArrowLeft class="size-6" />
				</Button>
			</a>
			<h1 class="text-4xl font-bold tracking-tight">Lovely Docs</h1>
		</div>
		<div class="flex items-center gap-2">
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

	<div class="grid gap-2 grid-cols-1">
		{#each filteredLibraries as [key, library]}
			<a href={resolve(`/human/${key}`)} class="block">
				<Card class="h-full hover:border-primary p-4 pb-2">
					<CardHeader class="p-0">
						<CardTitle class="flex flex-col gap-2 p-0">
							<div class="flex items-center justify-between gap-3">
								<div class="flex items-center gap-2 flex-wrap">
									<span>{library.name}</span>
									{#if library.ecosystems?.length}
										<div class="flex flex-wrap gap-1">
											{#each library.ecosystems as eco}
												<Badge variant="outline">
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
</div>
