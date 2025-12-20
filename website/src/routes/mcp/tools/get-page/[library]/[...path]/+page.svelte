<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import Markdown from '$lib/components/Markdown.svelte';
	import { handleToolCommandChange, toolCommands, type ToolCommand } from '$lib/mcp-tools-resource';
	import { mcpState } from '$lib/mcp-state.svelte';

	const { data } = $props();

	const libraries = $derived(data.libraries);
	const libraryOptions = $derived(libraries.map((l: any) => l.key));
	const markdownVariants = $derived(data.markdownVariants);

	const selectedLibrary = $derived(page.params.library ?? libraries[0].key ?? '');
	const selectedPath = $derived(page.params.path ?? '');
	const selectedLevel = $derived(page.url.hash.slice(1) || 'digest');

	const content = $derived(data.content ? (data.content[selectedLevel] ?? data.content['digest']) : null);

	// Paths are already relative to the library (no library prefix)
	const pathOptions = $derived(
		(data.paths ?? []).map((pathPart: string) => ({
			value: pathPart,
			label: pathPart
		}))
	);

	const resourceRoot = 'get-page';

	function updateUrl(lib: string, pathPart: string, lvl: string) {
		const hash = lvl !== 'digest' ? `#${lvl}` : '';
		goto(resolve(`/mcp/tools/get-page/${lib}${pathPart !== '/' ? '/' + pathPart : ''}${hash}`));
	}

	// Helper to construct full path for links
	function getFullPath(pathPart: string): string {
		return pathPart === '/' ? selectedLibrary : `${selectedLibrary}/${pathPart}`;
	}
</script>

{#snippet childNode(node: unknown, basePathPart: string)}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const childPathPart = basePathPart ? `${basePathPart}/${child}` : child}
				{@const childFullPath = getFullPath(childPathPart)}
				{@const hash = selectedLevel !== 'digest' ? `#${selectedLevel}` : ''}
				<a
					href={resolve(`/mcp/tools/get-page/${childFullPath}${hash}`)}
					class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
					<span class="text-muted-foreground">-</span>
					{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const childPathPart = basePathPart ? `${basePathPart}/${key}` : key}
					{@const childFullPath = getFullPath(childPathPart)}
					{@const hash = selectedLevel !== 'digest' ? `#${selectedLevel}` : ''}
					<div>
						<a
							href={resolve(`/mcp/tools/get-page/${childFullPath}${hash}`)}
							class="text-primary hover:text-primary/80 hover:bg-accent block w-full text-left transition-colors">
							{key}
							<span class="text-muted-foreground">:</span>
						</a>
						<div class="border-muted ml-1 border-l pl-4">
							{@render childNode(value, childPathPart)}
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
		<Card.Content class="flex flex-wrap items-center gap-2 font-mono text-sm">
			<div class="flex items-center gap-2">
				<span class="text-foreground/70">$</span>
				<div class="flex items-center">
					<Select.Root
						type="single"
						value={resourceRoot}
						onValueChange={(v) => handleToolCommandChange(v as ToolCommand['id'], resourceRoot)}>
						<Select.Trigger size="sm" class="bg-background border-border text-foreground h-7 px-2" aria-label="Tool command">
							<span>GetPage</span>
						</Select.Trigger>
						<Select.Content class="bg-popover border-border text-popover-foreground border">
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
				<Select.Root type="single" value={selectedLibrary} onValueChange={(v) => updateUrl(v, '', selectedLevel)}>
					<Select.Trigger size="sm" class="bg-background border-border text-foreground h-7 px-2" aria-label="Library">
						<span>{selectedLibrary || '(select)'}</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border-border text-popover-foreground max-h-[80dvh] border">
						{#each libraryOptions as lib}
							<Select.Item value={lib}>{lib}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<span class="text-foreground">,</span>

			<div class="flex items-center gap-1">
				<span class="text-muted-foreground">page=</span>
				<Select.Root type="single" value={selectedPath} onValueChange={(v) => updateUrl(selectedLibrary, v, selectedLevel)}>
					<Select.Trigger
						size="sm"
						class="bg-background border-border text-foreground h-7 w-full px-2 sm:w-auto sm:min-w-[200px]"
						aria-label="Page">
						<span>{pathOptions.find((o) => o.value === selectedPath)?.label ?? (selectedPath || '/')}</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border-border text-popover-foreground max-h-[80dvh] border">
						{#each pathOptions as option}
							<Select.Item value={option.value}>{option.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<span class="text-foreground">,</span>

			<div class="flex items-center gap-1">
				<span class="text-muted-foreground">level=</span>
				<Select.Root type="single" value={selectedLevel} onValueChange={(v) => updateUrl(selectedLibrary, selectedPath, v)}>
					<Select.Trigger size="sm" class="bg-background border-border text-foreground h-7 px-2" aria-label="Level">
						<span>{selectedLevel}</span>
					</Select.Trigger>
					<Select.Content class="bg-popover border-border text-popover-foreground border">
						{#each markdownVariants as v}
							<Select.Item value={v}>{v}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<span class="text-foreground">);</span>
		</Card.Content>
	</Card.Root>

	<!-- Content -->
	<div class="min-h-[320px] overflow-auto p-4">
		{#if content}
			{#if mcpState.renderMarkdown}
				<Markdown content={content.text} />
				{#if content.children && Array.isArray(content.children) && content.children.length > 0}
					<Card.Root class="border-border bg-card mt-4">
						<Card.Content class="overflow-x-auto font-mono text-xs">
							<div class="text-foreground/70 mb-2">Available sub-pages:</div>
							{@render childNode(content.children, selectedPath)}
						</Card.Content>
					</Card.Root>
				{/if}
			{:else}
				<div class="font-mono text-xs">
					<pre class="text-foreground whitespace-pre-wrap">{content.text}</pre>
					{#if content.children && Array.isArray(content.children) && content.children.length > 0}
						<div class="border-border mt-4 overflow-x-auto border-t pt-4">
							<div class="text-foreground/70 mb-2">Available sub-pages:</div>
							{@render childNode(content.children, selectedPath)}
						</div>
					{/if}
				</div>
			{/if}
		{:else}
			<p class="text-muted-foreground text-xs"># select library and page to view content</p>
		{/if}
	</div>
</div>
