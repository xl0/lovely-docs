<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DocTree from '$lib/components/DocTree.svelte';
	import MarkdownPanel from '$lib/components/MarkdownPanel.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Github, ChevronDown } from '@lucide/svelte';
	import type { LibraryDBItem, DocItem } from 'lovely-docs-mcp/doc-cache';
	import dbg from 'debug';

	let { data } = $props();
	let lib: LibraryDBItem = $derived(data.library);
	let libraryKey: string = $derived(data.libraryKey);
	let pathSegments: string[] = $derived(data.pathSegments ?? []);
	let debug = $derived(dbg(`app:page:library/${libraryKey}/${pathSegments.join('/')}`));

	let isRoot = $derived(pathSegments.length === 0);

	let breadcrumbs = $derived(
		pathSegments.map((segment, i) => ({
			name: segment,
			href: `${libraryKey}/${pathSegments.slice(0, i + 1).join('/')}`,
			isLast: i === pathSegments.length - 1
		}))
	);

	let item: DocItem | undefined = $derived.by(() => {
		let current: DocItem = lib.tree;
		for (const p of pathSegments) {
			const child = current.children[p];
			debug({ current, p, child });
			if (!child) return undefined;
			current = child;
		}
		return current;
	});

	let currentNode: DocItem | undefined = $derived(isRoot ? lib.tree : item);
	let hasChildren = $derived(currentNode && Object.keys(currentNode.children).length > 0);
	let titleText = $derived(isRoot ? lib.name : (currentNode?.displayName ?? ''));

	let collapsibleStorageKey = $state('');
	let collapsibleOpen = $state(false);

    /// XXX This state management stuff needs a rework
	// compute storage key whenever library or path changes
	$effect(() => {
		const suffix = isRoot ? '__root' : pathSegments.join('/');
		collapsibleStorageKey = `ld:collapsible:${libraryKey}:${suffix}`;
	});

	$effect(() => {
		if (typeof window === 'undefined') return;

		let initial = isRoot ? true : false;
		try {
			const stored = window.localStorage.getItem(collapsibleStorageKey);
			if (stored !== null) initial = stored === '1';
		} catch {
			// ignore storage errors
		}
		collapsibleOpen = initial;
	});

	$effect(() => {
		if (typeof window === 'undefined') return;
		try {
			window.localStorage.setItem(collapsibleStorageKey, collapsibleOpen ? '1' : '0');
		} catch {
			// ignore storage errors
		}
	});

	$effect(() => {
		debug({ lib, libraryKey, currentNode, pathSegments, isRoot, hasChildren, collapsibleOpen });
	});
</script>

<div class="container mx-auto px-4 py-8 max-w-6xl">
	<div class="flex items-center justify-between mb-6">
		<nav class="flex items-center gap-2 text-sm text-muted-foreground">
			<a href={resolve('/')} class="hover:text-foreground transition-colors">Home</a>
			<span>/</span>
			<a href={resolve(`/${libraryKey}`)} class="hover:text-foreground transition-colors">{lib.name}</a>
			{#each breadcrumbs as crumb}
				<span>/</span>
				{#if crumb.isLast}
					<span class="text-foreground">{crumb.name}</span>
				{:else}
					<a href={resolve(`/${crumb.href}`)} class="hover:text-foreground transition-colors">
						{crumb.name}
					</a>
				{/if}
			{/each}
		</nav>
		<div class="flex items-center gap-2">
			<a href="https://github.com/xl0/lovely-docs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
				<Button variant="outline" size="icon">
					<Github size={20} />
				</Button>
			</a>
			<ThemeToggle />
		</div>
	</div>

	{#if currentNode}
		<Collapsible.Root class="mt-6" bind:open={collapsibleOpen}>
			<div class="flex items-center justify-between mb-2">
				<Collapsible.Trigger class="inline-flex items-center gap-2 text-left hover:opacity-80 transition-opacity group">
					<h1 class="text-3xl font-bold tracking-tight">
						{titleText}
					</h1>
					{#if hasChildren}
						<ChevronDown class="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
					{/if}
				</Collapsible.Trigger>
				<Badge variant={currentNode.relevant ? 'default' : 'secondary'}>
					{currentNode.relevant ? '✓ Relevant' : 'Not relevant'}
				</Badge>
			</div>

			{#if currentNode?.markdown?.essence}
				<div class="mb-3 text-sm text-muted-foreground italic border-l-2 border-muted pl-3">
					{currentNode.markdown.essence}
				</div>
			{/if}

			{#if isRoot}
				<Card class="mb-4">
					<CardContent>
						<dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
							{#if lib.source.repo}
								<dt class="font-semibold text-muted-foreground">Repository:</dt>
								<dd class="font-mono text-xs">{lib.source.repo}</dd>
							{/if}
							{#if lib.source.commit}
								<dt class="font-semibold text-muted-foreground">Commit:</dt>
								<dd class="font-mono text-xs">{lib.source.commit}</dd>
							{/if}
							{#if lib.source.doc_dir}
								<dt class="font-semibold text-muted-foreground">Documentation Directory:</dt>
								<dd class="font-mono text-xs">{lib.source.doc_dir}</dd>
							{/if}
						</dl>
					</CardContent>
				</Card>
			{/if}

			{#if hasChildren}
				<Collapsible.Content class="mt-3">
					<Card>
						<CardContent class="px-4">
							{#if isRoot}
								<DocTree node={lib.tree} {libraryKey} />
							{:else}
								<DocTree node={currentNode} {libraryKey} basePath={pathSegments.join('/') + '/'} />
							{/if}
						</CardContent>
					</Card>
				</Collapsible.Content>
			{/if}
		</Collapsible.Root>

		<div class="mt-4">
			<MarkdownPanel markdown={currentNode.markdown} tokenCounts={currentNode.token_counts}/>
		</div>
	{:else}
		<p class="text-sm text-destructive mt-4">Document not found.</p>
	{/if}
</div>
