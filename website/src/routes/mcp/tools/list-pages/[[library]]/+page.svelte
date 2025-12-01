<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleToolCommandChange, toolCommands, type ToolCommand } from '$lib/mcp-tools-resource';

	const { data } = $props();

	const libraries = $derived(data.mcp.libraries);
	const libraryOptions = $derived(libraries.map((l: any) => l.key));
	const selectedLibrary = $derived(page.params.library ?? '');
	const verbose = $derived(page.url.hash.slice(1).includes('verbose=true'));

	const pageIndex = $derived(data.mcp.pageIndexes.find((p: any) => p.label === selectedLibrary));

	const resourceRoot = 'list-pages';

	function handleLibraryChange(value: string) {
		const verb = verbose ? '#&verbose=true' : '';
		goto(resolve(`/mcp/tools/list-pages/${value}${verb}`));
	}

	function toggleVerbose() {
		const verb = !verbose ? '#&verbose=true' : '';
		goto(resolve(`/mcp/tools/list-pages/${selectedLibrary}${verb}`));
	}
</script>

{#snippet treeNode(node: unknown, pathPart: string = '')}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const childPathPart = pathPart && pathPart !== '/' ? `${pathPart}/${child}` : child}
				{@const fullPath = childPathPart === '/' ? selectedLibrary : `${selectedLibrary}/${childPathPart}`}
				<a
					href={resolve(`/mcp/tools/get-page/${fullPath}#digest`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					<span class="text-muted-foreground">- </span>{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const childPathPart = pathPart && pathPart !== '/' ? `${pathPart}/${key}` : key}
					{@const fullPath = childPathPart === '/' ? selectedLibrary : `${selectedLibrary}/${childPathPart}`}
					<div>
						<a
							href={resolve(`/mcp/tools/get-page/${fullPath}#digest`)}
							class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
							{key}<span class="text-muted-foreground">:</span>
						</a>
						<div class="pl-4 border-l border-muted ml-1">
							{@render treeNode(value, childPathPart)}
						</div>
					</div>
				{/each}
			{/if}
		{/each}
	{/if}
{/snippet}

{#snippet verboseTreeNode(node: unknown, pathPart: string = '')}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const childPathPart = pathPart && pathPart !== '/' ? `${pathPart}/${key}` : key}
					{@const fullPath = childPathPart === '/' ? selectedLibrary : `${selectedLibrary}/${childPathPart}`}
					{@const essence = typeof value === 'string' ? value : (value as any).essence}
					{@const children = typeof value === 'object' && value !== null ? (value as any).children : null}

					<div class="mb-1">
						<a
							href={resolve(`/mcp/tools/get-page/${fullPath}`)}
							class="flex items-baseline overflow-hidden text-primary hover:text-primary/80 hover:bg-accent transition-colors w-full">
							<span class="whitespace-nowrap shrink-0">{key}</span>
							{#if essence}
								<span class="text-muted-foreground text-xs truncate" title={essence}>
									: {essence}
								</span>
							{/if}
						</a>

						{#if children}
							<div class="pl-4 border-l border-muted ml-1 mt-1">
								{@render verboseTreeNode(children, childPathPart)}
							</div>
						{/if}
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
			<div class="flex items-center gap-2">
				<span class="text-foreground/70">$</span>
				<div class="flex items-center">
					<Select.Root
						type="single"
						value={resourceRoot}
						onValueChange={(v) => handleToolCommandChange(v as ToolCommand['id'], resourceRoot)}>
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
	<div class="overflow-auto min-h-[320px] p-4">
		{#if pageIndex}
			<div class="font-mono text-xs">
				{#if verbose}
					{@render verboseTreeNode(pageIndex?.verboseTree, '')}
				{:else}
					{@render treeNode(pageIndex?.tree, '')}
				{/if}
			</div>
		{:else}
			<p class="text-xs text-muted-foreground"># select a library to view pages</p>
		{/if}
	</div>
</div>
