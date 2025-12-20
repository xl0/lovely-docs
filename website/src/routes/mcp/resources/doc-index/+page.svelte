<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleResourceCommandChange, resourceCommands, type ResourceCommand } from '$lib/mcp-tools-resource.js';

	const { data } = $props();

	const ecosystems = $derived(data.ecosystems);
	const ecosystemOptions = $derived(ecosystems);

	const hashParts = $derived(page.url.hash.slice(1).split('&'));
	const selectedEcosystem = $derived(hashParts[0] || '*');
	const verbose = $derived(hashParts.includes('verbose=true'));

	const activeItem = $derived(data.items.find((r: any) => r.label === selectedEcosystem) || data.items.find((r: any) => r.label === '*'));

	function handleEcosystemChange(value: string) {
		const eco = value !== '*' ? value : '';
		const verb = verbose ? '&verbose=true' : '';
		const hash = eco || verb ? `#${eco}${verb}` : '';
		goto((resolve('/mcp/resources/doc-index') + hash) as string);
	}

	function toggleVerbose() {
		const eco = selectedEcosystem !== '*' ? selectedEcosystem : '';
		const verb = !verbose ? '&verbose=true' : '';
		const hash = eco || verb ? `#${eco}${verb}` : '';
		goto((resolve('/mcp/resources/doc-index') + hash) as string);
	}

	const resourceRoot = 'doc-index';
</script>

<div class="space-y-2">
	<!-- Selector Bar -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="flex flex-wrap items-center gap-2 font-mono text-sm">
			<span class="text-primary hidden sm:inline">URL:</span>
			<span class="text-foreground hidden sm:inline">lovely-docs://</span>

			<Select.Root
				type="single"
				value={resourceRoot}
				onValueChange={(v) => handleResourceCommandChange(v as ResourceCommand['id'], resourceRoot)}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Resource command">
					<span>index</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border-border text-popover-foreground border">
					{#each resourceCommands as cmd}
						<Select.Item value={cmd.id}>{cmd.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
			<span class="text-foreground">/</span>
			<Select.Root type="single" value={selectedEcosystem} onValueChange={handleEcosystemChange}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Ecosystem">
					<span>{selectedEcosystem}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border-border text-popover-foreground border">
					{#each ecosystemOptions as eco}
						<Select.Item value={eco}>{eco}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<span class="text-foreground">?</span>

			<div class="flex items-center gap-1">
				<span class="text-muted-foreground">verbose=</span>
				<label
					class="bg-background border-border hover:bg-accent/50 flex h-7 cursor-pointer items-center gap-2 rounded-md border px-2 transition-colors">
					<input type="checkbox" class="accent-primary h-3 w-3" checked={verbose} onchange={toggleVerbose} />
				</label>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Content -->
	<div class="min-h-[320px] overflow-auto p-4">
		{#if activeItem}
			<div class="font-mono text-sm">
				{#if verbose}
					{#each Object.entries(activeItem.verbose) as [lib, summary]}
						<a
							href={resolve(`/mcp/resources/page-index/${lib}`)}
							class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
							{lib}
							<span class="text-muted-foreground">: {summary}</span>
						</a>
					{/each}
				{:else}
					{#each activeItem.index as lib}
						<a
							href={resolve(`/mcp/resources/page-index/${lib}`)}
							class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
							<span class="text-muted-foreground">-</span>
							{lib}
						</a>
					{/each}
				{/if}
			</div>
		{:else}
			<p class="text-muted-foreground text-xs"># no libraries for ecosystem {selectedEcosystem}</p>
		{/if}
	</div>
</div>
