<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import Markdown from '$lib/components/Markdown.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import { handleCommandChange, resourceCommands } from '$lib/mcp-tools-resource';
	import { mcpState } from '../../../state.svelte';

	let { data } = $props();

	const libraries = $derived(data.mcp.libraries);
	const markdownVariants = $derived(data.mcp.markdownVariants);

	const selectedLibrary = $derived(page.params.library ?? '');
	const fullPath = $derived(
		page.params.path ? `${page.params.library}/${page.params.path}` : (page.params.library ?? '')
	);
	const level = $derived(page.url.hash ? page.url.hash.slice(1) : 'digest');
	const content = $derived(data.content[level] ?? data.content['digest']);

	// Get paths for current library
	const pageIndex = $derived(data.mcp.pageIndexes.find((p: any) => p.label === selectedLibrary));
	const pathOptions = $derived(
		(pageIndex?.paths ?? []).map((p: string) => {
			const label = p.startsWith(selectedLibrary + '/')
				? p.slice(selectedLibrary.length + 1)
				: p === selectedLibrary
					? '/'
					: p;
			return { value: p, label };
		})
	);

	const resourceRoot = 'doc-page';

	function handlePathChange(value: string) {
		const parts = value.split('/');
		const lib = parts[0];
		const rest = parts.slice(1).join('/');
		goto(resolve(`/mcp/doc-page/${lib}${rest ? '/' + rest : ''}#${level}`));
	}

	function handleLevelChange(value: string) {
		const parts = fullPath.split('/');
		const lib = parts[0];
		const rest = parts.slice(1).join('/');
		goto(resolve(`/mcp/doc-page/${lib}${rest ? '/' + rest : ''}#${value}`));
	}
</script>

{#snippet childNode(node: unknown, basePath: string)}
	{#if Array.isArray(node)}
		{#each node as child}
			{#if typeof child === 'string'}
				{@const fullPath = `${basePath}/${child}`}
				<a
					href={resolve(`/mcp/doc-page/${fullPath}#${level}`)}
					class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
					<span class="text-muted-foreground">- </span>{child}
				</a>
			{:else if typeof child === 'object' && child !== null}
				{#each Object.entries(child) as [key, value]}
					{@const fullPath = `${basePath}/${key}`}
					<div>
						<a
							href={resolve(`/mcp/doc-page/${fullPath}#${level}`)}
							class="w-full text-left text-primary hover:text-primary/80 hover:bg-accent transition-colors block">
							{key}<span class="text-muted-foreground">:</span>
						</a>
						<div class="pl-4 border-l border-muted ml-1">
							{@render childNode(value, fullPath)}
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

			<Select.Root type="single" value={resourceRoot} onValueChange={(v) => handleCommandChange(v, resourceRoot)}>
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

			<Select.Root type="single" value={fullPath} onValueChange={handlePathChange}>
				<Select.Trigger size="sm" class="bg-background border-border text-foreground min-w-[200px]" aria-label="Path">
					<span>{pathOptions.find((o) => o.value === fullPath)?.label ?? fullPath ?? '/'}</span>
				</Select.Trigger>
				<Select.Content class="bg-popover border border-border text-popover-foreground max-h-56">
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
							{@render childNode(
								content.children,
								page.params.path ? `${page.params.library ?? ''}/${page.params.path}` : (page.params.library ?? '')
							)}
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
								{@render childNode(
									content.children,
									page.params.path ? `${page.params.library ?? ''}/${page.params.path}` : (page.params.library ?? '')
								)}
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
