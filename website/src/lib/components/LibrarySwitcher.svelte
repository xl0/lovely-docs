<script lang="ts">
	import { Library } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Command from '$lib/components/ui/command';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	type LibraryInfo = { key: string; displayName: string };

	let { libraries, currentLibraryKey }: { libraries: LibraryInfo[]; currentLibraryKey?: string } = $props();

	let open = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			open = true;
		}
	}

	const sortedLibraries = $derived.by(() => {
		return [...libraries].sort((a, b) => {
			if (a.key === currentLibraryKey) return -1;
			if (b.key === currentLibraryKey) return 1;
			return a.displayName.localeCompare(b.displayName);
		});
	});
</script>

<svelte:document onkeydown={handleKeydown} />

<Button variant="outline" size="sm" class="text-muted-foreground hidden gap-2 sm:inline-flex" onclick={() => (open = true)}>
	<Library class="size-4" />
	<!-- <span>Libraries</span> -->
	<kbd
		class="bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
		<span class="text-xs">⌘</span>
		L
	</kbd>
</Button>

<Button variant="ghost" size="icon" class="sm:hidden" onclick={() => (open = true)} aria-label="Switch library">
	<Library class="size-5" />
</Button>

<Command.Dialog bind:open>
	<Command.Input placeholder="Switch library..." />
	<Command.List class="max-h-[400px] overflow-y-auto">
		<Command.Empty>No libraries found.</Command.Empty>
		<Command.Group>
			{#each sortedLibraries as lib (lib.key)}
				<Command.Item
					value={lib.key}
					keywords={[lib.displayName]}
					onSelect={() => {
						open = false;
						goto(resolve(`/human/${lib.key}`));
					}}>
					<div class="flex w-full items-center gap-2">
						<Library class="text-muted-foreground size-4" />
						<span class="font-medium">{lib.displayName}</span>
						{#if lib.key === currentLibraryKey}
							<span class="text-muted-foreground ml-auto text-xs">(current)</span>
						{/if}
					</div>
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
