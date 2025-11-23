<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleToolCommandChange, toolCommands } from '$lib/mcp-tools-resource';

	const { data } = $props();

	const libraries = $derived(data.mcp.libraries);
	const libraryOptions = $derived(libraries.map((l: any) => l.key));
	const selectedLibrary = $derived(page.params.library ?? '');

	const pageIndex = $derived(data.mcp.pageIndexes.find((p: any) => p.label === selectedLibrary));

	const resourceRoot = 'list-pages';

	function handleLibraryChange(value: string) {
		goto(resolve(`/mcp/tools/list-pages/${value}`));
	}
</script>

{#snippet treeNode(node: unknown, prefix: string = '')}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const fullPath = prefix ? `${prefix}/${child}` : child}
				<a
					href={resolve(`/mcp/tools/get-page/${fullPath}?level=digest`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					<span class="text-muted-foreground">- </span>{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const fullPath = prefix ? `${prefix}/${key}` : key}
					<div>
						<a
							href={resolve(`/mcp/tools/get-page/${fullPath}?level=digest`)}
							class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
							{key}<span class="text-muted-foreground">:</span>
						</a>
						<div class="pl-4 border-l border-muted ml-1">
							{@render treeNode(value, fullPath)}
						</div>
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

<div class="space-y-2">
	<!-- Selector Bar -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="text-sm flex flex-wrap items-center gap-2 font-mono">
			<span class="text-foreground/70">$</span>

			<div class="flex items-center">
				<Select.Root type="single" value={resourceRoot} onValueChange={(v) => handleToolCommandChange(v, resourceRoot)}>
					<Select.Trigger
						size="sm"
						class="bg-background border-border text-foreground px-2 h-7"
						aria-label="Tool command">
						<span>ListPages</span>
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
				<span class="text-muted-foreground">library=</span>
				<Select.Root type="single" value={selectedLibrary} onValueChange={handleLibraryChange}>
					<Select.Trigger
						size="sm"
						class="bg-background border-border text-foreground px-2 h-7 min-w-[100px]"
						aria-label="Library">
						<span>{selectedLibrary || '(select)'}</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border border-border text-popover-foreground max-h-60">
						{#each libraryOptions as lib}
							<Select.Item value={lib}>{lib}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<span class="text-foreground">);</span>
		</Card.Content>
	</Card.Root>

	<!-- Content -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="overflow-auto min-h-[320px]">
			{#if pageIndex}
				<div class="font-mono text-xs">
					<a
						href={resolve(`/mcp/tools/get-page/${selectedLibrary}?level=digest`)}
						class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
						/<span class="text-muted-foreground">:</span>
					</a>
					<div class="pl-4 border-l border-muted ml-1">
						{@render treeNode(pageIndex.tree, selectedLibrary)}
					</div>
				</div>
			{:else}
				<p class="text-xs text-muted-foreground"># select a library to view pages</p>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
