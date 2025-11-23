<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleResourceCommandChange, resourceCommands } from '$lib/mcp-tools-resource.js';

	const { data } = $props();

	const ecosystems = $derived(data.mcp.ecosystems);
	const ecosystemOptions = $derived(ecosystems);
	const selectedEcosystem = $derived(page.url.hash.slice(1) || '*');
	const activeResource = $derived(
		data.mcp.resources.find((r) => r.label === selectedEcosystem) || data.mcp.resources.find((r) => r.label === '*')
	);

	function handleEcosystemChange(value: string) {
		const hash = value !== '*' ? `#${value}` : '';
		goto(resolve(`/mcp/resources/doc-index${hash}`));
	}

	const resourceRoot = 'doc-index';
</script>

<div class="space-y-2">
	<!-- Selector Bar -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="text-sm flex flex-wrap items-center gap-2 font-mono">
			<span class="text-foreground/70">$</span>
			<span class="text-foreground">lovely-docs://</span>

			<Select.Root
				type="single"
				value={resourceRoot}
				onValueChange={(v) => handleResourceCommandChange(v, resourceRoot)}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Resource command">
					<span>{resourceRoot}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border border-border text-popover-foreground">
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
				<Select.Content class="bg-popover border border-border text-popover-foreground">
					{#each ecosystemOptions as eco}
						<Select.Item value={eco}>{eco}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Card.Content>
	</Card.Root>

	<!-- Content -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="overflow-auto min-h-[320px]">
			{#if activeResource}
				<div class="font-mono text-sm">
					{#each activeResource.index as lib}
						<a
							href={resolve(`/mcp/resources/page-index/${lib}`)}
							class="block w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors">
							<span class="text-muted-foreground">- </span>{lib}
						</a>
					{/each}
				</div>
			{:else}
				<p class="text-xs text-muted-foreground"># no resources for ecosystem {selectedEcosystem}</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
