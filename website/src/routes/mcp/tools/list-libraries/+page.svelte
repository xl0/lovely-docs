<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleToolCommandChange, toolCommands } from '$lib/mcp-tools-resource';

	const { data } = $props();

	const ecosystems = $derived(data.mcp.ecosystems);
	const ecosystemOptions = $derived(ecosystems);
	const selectedEcosystem = $derived(page.url.hash.slice(1) || '*');
	const verbose = $derived(page.url.searchParams.get('detail') === 'true');

	const currentTools = $derived(data.mcp.tools.filter((t: any) => t.label === selectedEcosystem));

	const resourceRoot = 'list-libraries';

	function handleEcosystemChange(value: string) {
		const hash = value !== '*' ? `#${value}` : '';
		const query = verbose ? '?detail=true' : '';
		goto(resolve(`/mcp/tools/list-libraries${query}${hash}`));
	}

	function toggleVerbose() {
		const hash = selectedEcosystem !== '*' ? `#${selectedEcosystem}` : '';
		const query = !verbose ? '?detail=true' : '';
		goto(resolve(`/mcp/tools/list-libraries${query}${hash}`));
	}
</script>

<div class="space-y-2">
	<!-- Selector Bar -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="text-sm flex flex-wrap items-center gap-2 font-mono">
			<div class="flex items-center">
				<Select.Root type="single" value={resourceRoot} onValueChange={(v) => handleToolCommandChange(v, resourceRoot)}>
					<Select.Trigger
						size="sm"
						class="bg-background border-border text-foreground px-2 h-7"
						aria-label="Tool command">
						<span>ListLibraries</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border border-border text-popover-foreground">
						{#each toolCommands as cmd}
							<Select.Item value={cmd.id}>{cmd.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<span class="text-foreground ml-2">(</span>
			</div>

			<div class="flex items-center gap-1">
				<span class="text-muted-foreground">ecosystem=</span>
				<Select.Root type="single" value={selectedEcosystem} onValueChange={handleEcosystemChange}>
					<Select.Trigger
						size="sm"
						class="bg-background border-border text-foreground px-2 h-7"
						aria-label="Ecosystem">
						<span>{selectedEcosystem}</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border border-border text-popover-foreground">
						{#each ecosystemOptions as eco}
							<Select.Item value={eco}>{eco}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<span class="text-foreground">,</span>

			<div class="flex items-center gap-1">
				<span class="text-muted-foreground">verbose=</span>
				<label
					class="flex items-center gap-2 cursor-pointer bg-background border border-border px-2 h-7 rounded-md hover:bg-accent/50 transition-colors">
					<input type="checkbox" class="accent-primary h-3 w-3" checked={verbose} onchange={toggleVerbose} />
				</label>
			</div>

			<span class="text-foreground">);</span>
		</Card.Content>
	</Card.Root>

	<!-- Content -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="overflow-auto min-h-[320px]">
			{#if currentTools.length === 0}
				<p class="text-xs text-muted-foreground"># no tools for this ecosystem</p>
			{:else}
				{#each currentTools as t}
					<div class="mb-4">
						<div class="font-mono text-xs">
							{#if verbose}
								{#each Object.entries(t.verbose) as [lib, summary]}
									<a
										href={resolve(`/mcp/tools/list-pages/${lib}`)}
										class="block w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors">
										{lib}<span class="text-muted-foreground">: {summary}</span>
									</a>
								{/each}
							{:else}
								{#each t.payload as lib}
									<a
										href={resolve(`/mcp/tools/list-pages/${lib}`)}
										class="block w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors">
										<span class="text-muted-foreground">- </span>{lib}
									</a>
								{/each}
							{/if}
						</div>
					</div>
				{/each}
			{/if}
		</Card.Content>
	</Card.Root>
</div>
