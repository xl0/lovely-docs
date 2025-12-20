<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleResourceCommandChange, resourceCommands, type ResourceCommand } from '$lib/mcp-tools-resource.js';
	type LibraryOption = { key: string; name: string };

	const { data, children } = $props();

	const library = $derived(page.params.library);

	const resourceRoot = 'page-index';

	const libraryOptions = $derived.by(() => {
		const libs = data.libraries ?? [];
		const opts = libs.map((lib: LibraryOption) => ({ value: lib.key, label: lib.name ?? lib.key }));
		return opts.length > 0 ? opts : [{ value: '', label: '(no libraries available)' }];
	});

	const verbose = $derived(page.url.hash.slice(1).includes('verbose=true'));

	function toggleVerbose() {
		const verb = !verbose ? '&verbose=true' : '';
		const hash = verb ? `#${verb}` : '';
		goto(resolve(`/mcp/resources/page-index/${library}${hash}`));
	}
</script>

<div class="space-y-2">
	<!-- Selector Bar -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="flex flex-wrap items-center gap-2 font-mono text-sm">
			<span class="text-primary">URL:</span>
			<span class="text-foreground">lovely-docs://</span>

			<Select.Root
				type="single"
				value={resourceRoot}
				onValueChange={(v) => handleResourceCommandChange(v as ResourceCommand['id'], resourceRoot)}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Resource command">
					<span>{resourceRoot}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border-border text-popover-foreground border">
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
					const verb = verbose ? '&verbose=true' : '';
					const hash = verb ? `#${verb}` : '';
					goto(resolve(`/mcp/resources/page-index/${lib}${hash}`));
				}}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Ecosystem">
					<span>{library}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border-border text-popover-foreground border">
					{#each libraryOptions as lib}
						<Select.Item value={lib.value}>{lib.label}</Select.Item>
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

	{@render children()}
</div>
