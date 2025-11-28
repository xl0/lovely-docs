<script lang="ts">
	import { onMount } from 'svelte';
	import { Search as SearchIcon } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import { createSearchIndex, searchIndex, type SearchResult } from '$lib/utils/search';

	let { libraryFilter, placeholder = 'Search documentation...' }: { libraryFilter?: string; placeholder?: string } =
		$props();

	let open = $state(false);
	let searchState = $state<'loading' | 'ready'>('loading');
	let searchQuery = $state('');
	let results = $state<SearchResult[]>([]);

	onMount(async () => {
		try {
			const response = await fetch('/search-index.json');
			const content = await response.json();
			createSearchIndex(content);
			searchState = 'ready';
		} catch (error) {
			console.error('Failed to load search index:', error);
		}
	});

	$effect(() => {
		if (searchState !== 'ready') return;
		results = searchIndex(searchQuery, libraryFilter);
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = true;
		}
	}

	let clearTimeoutId: number | undefined;

	function clearSearchWithDelay() {
		if (clearTimeoutId) window.clearTimeout(clearTimeoutId);
		clearTimeoutId = window.setTimeout(() => {
			searchQuery = '';
			clearTimeoutId = undefined;
		}, 300);
	}
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog
	bind:open
	shouldFilter={false}
	onOpenChange={(o) => {
		if (o) return;
		clearSearchWithDelay();
	}}>
	<Command.Input bind:value={searchQuery} {placeholder} />

	{#if searchQuery !== '' && results.length === 0}
		<Command.Empty>No results found.</Command.Empty>
	{/if}

	{#if searchQuery !== '' && results.length > 0}
		<Command.List>
			<Command.Group>
				{#each results as { displayName, href, snippet, libraryName } (href)}
					<Command.Item
						value={href}
						onSelect={() => {
							searchQuery = '';
							open = false;
							window.location.href = href;
						}}>
						<div class="flex w-full flex-col gap-1">
							<div class="flex w-full items-center justify-between">
								<span class="font-medium">{displayName}</span>
								<span class="text-muted-foreground text-xs">{libraryName}</span>
							</div>
							{#if snippet}
								<div
									class="text-muted-foreground [&_mark]:bg-primary/20 [&_mark]:text-foreground text-xs leading-relaxed [&_mark]:font-medium">
									{@html snippet}
								</div>
							{/if}
						</div>
					</Command.Item>
				{/each}
			</Command.Group>
		</Command.List>
	{/if}
</Command.Dialog>

<!-- Search trigger button -->
<Button
	variant="outline"
	size="sm"
	class="text-muted-foreground hidden gap-2 sm:inline-flex"
	onclick={() => (open = true)}>
	<SearchIcon class="size-4" />
	<span>Search...</span>
	<kbd
		class="bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
		<span class="text-xs">⌘</span>K
	</kbd>
</Button>

<!-- Mobile search button -->
<Button variant="ghost" size="icon" class="sm:hidden" onclick={() => (open = true)} aria-label="Search">
	<SearchIcon class="size-5" />
</Button>
