<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleResourceCommandChange, resourceCommands } from '$lib/mcp-tools-resource.js';
	import type { LayoutData } from './$types.js';
	type LibraryOption = LayoutData['mcp']['libraries'][number];

	const { data, children } = $props();

	const library = $derived(page.params.library);
	const pageIndex = $derived(data.mcp.pageIndexes.find((p: any) => p.label === library));

	const resourceRoot = 'page-index';

	const libraryOptoins = $derived.by(() => {
		const opts = data.mcp.libraries.map((lib: LibraryOption) => ({ value: lib.key, label: lib.name ?? lib.key }));
		return opts.length > 0 ? opts : [{ value: '', label: '(no libraries available)' }];
	});
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
			<Select.Root
				type="single"
				value={library}
				onValueChange={(lib) => {
					goto(resolve(`/mcp/resources/page-index/${lib}`));
				}}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Ecosystem">
					<span>{library}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border border-border text-popover-foreground">
					{#each libraryOptoins as lib}
						<Select.Item value={lib.value}>{lib.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Card.Content>
	</Card.Root>

	{@render children()}
</div>
