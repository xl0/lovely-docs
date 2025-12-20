<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleToolCommandChange, toolCommands, type ToolCommand } from '$lib/mcp-tools-resource';

	const { data } = $props();

	const ecosystems = $derived(data.ecosystems);
	const ecosystemOptions = $derived(ecosystems);
	const hashParts = $derived(page.url.hash.slice(1).split('&'));
	const selectedEcosystem = $derived(hashParts[0] || '*');
	const verbose = $derived(hashParts.includes('verbose=true'));

	const currentTools = $derived(data.tools.filter((t: any) => t.label === selectedEcosystem));

	const resourceRoot = 'list-libraries';

	function handleEcosystemChange(value: string) {
		const eco = value !== '*' ? value : '';
		const verb = verbose ? '&verbose=true' : '';
		const hash = eco || verb ? `#${eco}${verb}` : '';
		goto(resolve(`/mcp/tools/list-libraries`) + hash);
	}

	function toggleVerbose() {
		const eco = selectedEcosystem !== '*' ? selectedEcosystem : '';
		const verb = !verbose ? '&verbose=true' : '';
		const hash = eco || verb ? `#${eco}${verb}` : '';
		goto(resolve(`/mcp/tools/list-libraries`) + hash);
	}
</script>

<div class="space-y-2">
	<!-- Selector Bar -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="flex flex-wrap items-center gap-2 font-mono text-sm">
			<div class="flex items-center">
				<Select.Root
					type="single"
					value={resourceRoot}
					onValueChange={(v) => handleToolCommandChange(v as ToolCommand['id'], resourceRoot)}>
					<Select.Trigger size="sm" class="bg-background border-border text-foreground h-7 px-2" aria-label="Tool command">
						<span>ListLibraries</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border-border text-popover-foreground border">
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
					<Select.Trigger size="sm" class="bg-background border-border text-foreground h-7 px-2" aria-label="Ecosystem">
						<span>{selectedEcosystem}</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border-border text-popover-foreground border">
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
					class="bg-background border-border hover:bg-accent/50 flex h-7 cursor-pointer items-center gap-2 rounded-md border px-2 transition-colors">
					<input type="checkbox" class="accent-primary h-3 w-3" checked={verbose} onchange={toggleVerbose} />
				</label>
			</div>

			<span class="text-foreground">);</span>
		</Card.Content>
	</Card.Root>

	<!-- Content -->
	<div class="min-h-[320px] overflow-auto p-4">
		{#if currentTools.length === 0}
			<p class="text-muted-foreground text-xs"># no tools for this ecosystem</p>
		{:else}
			{#each currentTools as t}
				<div class="mb-4">
					<div class="font-mono text-xs">
						{#if verbose}
							{#each Object.entries(t.verbose) as [lib, summary]}
								<a
									href={resolve(`/mcp/tools/list-pages/${lib}`)}
									class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
									{lib}
									<span class="text-muted-foreground">: {summary}</span>
								</a>
							{/each}
						{:else}
							{#each t.payload as lib}
								<a
									href={resolve(`/mcp/tools/list-pages/${lib}`)}
									class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
									<span class="text-muted-foreground">-</span>
									{lib}
								</a>
							{/each}
						{/if}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
