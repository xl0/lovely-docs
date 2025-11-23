<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleResourceCommandChange, resourceCommands } from '$lib/mcp-tools-resource';
	import { mcpState } from '$lib/mcp-state.svelte';

	let { data } = $props();

	const libraries = $derived(data.mcp.libraries);
	const markdownVariants = $derived(data.mcp.markdownVariants);

	const selectedLibrary = $derived(page.params.library ?? '');
	const selectedPath = $derived(page.params.path ?? '');
	const level = $derived(page.url.hash ? page.url.hash.slice(1) : 'digest');
	const content = $derived(data.content[level] ?? data.content['digest']);

	// Get paths for current library
	const pageIndex = $derived(data.mcp.pageIndexes.find((p: any) => p.label === selectedLibrary));

	// Paths are already relative to the library (no library prefix)
	const pathOptions = $derived(
		(pageIndex?.paths ?? []).map((pathPart: string) => ({
			value: pathPart,
			label: pathPart === '/' ? '/' : pathPart
		}))
	);

	const resourceRoot = 'doc-page';

	function handlePathChange(pathPart: string) {
		goto(resolve(`/mcp/resources/doc-page/${selectedLibrary}${pathPart !== '/' ? '/' + pathPart : ''}#${level}`));
	}

	function handleLevelChange(value: string) {
		goto(resolve(`/mcp/resources/doc-page/${selectedLibrary}${selectedPath ? '/' + selectedPath : ''}#${value}`));
	}

	// Helper to construct full path for links
	function getFullPath(pathPart: string): string {
		return pathPart ? `${selectedLibrary}/${pathPart}` : selectedLibrary;
	}
</script>

{#snippet childNode(node: unknown, basePathPart: string)}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const childPathPart = basePathPart ? `${basePathPart}/${child}` : child}
				{@const childFullPath = getFullPath(childPathPart)}
				<a
					href={resolve(`/mcp/resources/doc-page/${childFullPath}#${level}`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					<span class="text-muted-foreground">- </span>{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const childPathPart = basePathPart ? `${basePathPart}/${key}` : key}
					{@const childFullPath = getFullPath(childPathPart)}
					<div>
						<a
							href={resolve(`/mcp/resources/doc-page/${childFullPath}#${level}`)}
							class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
							{key}<span class="text-muted-foreground">:</span>
						</a>
						<div class="pl-4 border-l border-muted ml-1">
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
				value={selectedLibrary}
				onValueChange={(lib) => goto(resolve(`/mcp/resources/doc-page/${lib}#${level}`))}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Library">
					<span>{selectedLibrary || '(select)'}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border border-border text-popover-foreground max-h-[80dvh]">
					{#each libraries.map((l) => l.key) as lib}
						<Select.Item value={lib}>{lib}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<span class="text-foreground">/</span>

			<Select.Root type="single" value={selectedPath} onValueChange={handlePathChange}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground min-w-[200px]" aria-label="Path">
					<span>{pathOptions.find((o) => o.value === selectedPath)?.label ?? (selectedPath || '/')}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border border-border text-popover-foreground max-h-[80dvh]">
					{#each pathOptions as option}
						<Select.Item value={option.value}>{option.label}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>

			<span class="text-foreground">?level=</span>

			<Select.Root type="single" value={level} onValueChange={handleLevelChange}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Level">
					<span>{level}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border border-border text-popover-foreground">
					{#each markdownVariants as v}
						<Select.Item value={v}>{v}</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</Card.Content>
	</Card.Root>

	<!-- Content -->
	<Card.Root class="border-border bg-card">
		<Card.Content class="overflow-auto min-h-[320px]">
			{#if mcpState.renderMarkdown && content}
				<Markdown content={content.text} />

				{#if content.children && Array.isArray(content.children) && content.children.length > 0}
					<Card.Root class="border-border bg-card mt-4">
						<Card.Content class="font-mono text-xs">
							<div class="text-foreground/70 mb-2">Available sub-pages:</div>
							{@render childNode(content.children, selectedPath)}
						</Card.Content>
					</Card.Root>
				{/if}
			{:else}
				<div class="font-mono text-xs">
					{#if content}
						<pre class="whitespace-pre-wrap text-foreground">{content.text}</pre>
						{#if content.children && Array.isArray(content.children) && content.children.length > 0}
							<div class="mt-4 border-t border-border pt-4">
								<div class="text-foreground/70 mb-2">Available sub-pages:</div>
								{@render childNode(content.children, selectedPath)}
							</div>
						{/if}
					{:else}
						<div class="text-destructive"># Content not available for level: {level}</div>
					{/if}
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</div>
