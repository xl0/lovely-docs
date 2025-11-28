<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import MarkdownPanel from '$lib/components/MarkdownPanel.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Github, Bot, Menu } from '@lucide/svelte';
	import type { LibraryDBItem, DocItem } from 'lovely-docs/doc-cache';

	let { data } = $props();
	let lib: Omit<LibraryDBItem, 'tree'> = $derived(data.libraryInfo);
	let libraryKey: string = $derived(data.libraryKey);
	let pathSegments: string[] = $derived(data.pathSegments ?? []);
	let currentNode: DocItem = $derived(data.currentNode);
	let fullTree: DocItem = $derived(data.fullTree);

	let isRoot = $derived(pathSegments.length === 0);

	let breadcrumbs = $derived(
		pathSegments.map((segment, i) => ({
			name: segment,
			href: `${libraryKey}/${pathSegments.slice(0, i + 1).join('/')}`,
			isLast: i === pathSegments.length - 1
		}))
	);

	let titleText = $derived(isRoot ? lib.name : (currentNode?.displayName ?? ''));

	let mobileMenuOpen = $state(false);

	// Prevent scroll propagation from sidebar to main content
	function handleSidebarWheel(e: WheelEvent) {
		const target = e.currentTarget as HTMLElement;
		const scrollTop = target.scrollTop;
		const scrollHeight = target.scrollHeight;
		const clientHeight = target.clientHeight;
		const wheelDelta = e.deltaY;

		// At top and scrolling up, or at bottom and scrolling down - prevent propagation
		if ((scrollTop === 0 && wheelDelta < 0) || (scrollTop + clientHeight >= scrollHeight && wheelDelta > 0)) {
			e.preventDefault();
		}
	}
</script>

<div class="flex w-full">
	<!-- Desktop Sidebar -->
	<aside
		class="border-border bg-background sticky top-0 hidden h-screen w-64 overflow-y-auto border-r lg:block"
		onwheel={handleSidebarWheel}>
		<div class="border-border border-b p-4">
			<a href={resolve('/human')} class="hover:text-primary text-lg font-semibold transition-colors">
				{lib.name}
			</a>
		</div>
		<div class="p-4">
			<DocSidebar tree={fullTree} {libraryKey} />
		</div>
	</aside>

	<!-- Main Content -->
	<div class="min-w-0 flex-1">
		<!-- Header -->
		<header
			class="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
			<div class="flex items-center justify-between px-4 py-3">
				<div class="flex items-center gap-3">
					<!-- Mobile Menu Button -->
					<Button variant="ghost" size="icon" class="lg:hidden" onclick={() => (mobileMenuOpen = true)}>
						<Menu class="h-5 w-5" />
					</Button>

					<!-- Breadcrumbs -->
					<nav class="text-muted-foreground flex items-center gap-2 text-sm">
						<a href={resolve('/human')} class="hover:text-foreground transition-colors">Home</a>
						<span>/</span>
						<a href={resolve(`/human/${libraryKey}`)} class="hover:text-foreground transition-colors">{lib.name}</a>
						{#each breadcrumbs as crumb}
							<span>/</span>
							{#if crumb.isLast}
								<span class="text-foreground">{crumb.name}</span>
							{:else}
								<a href={resolve(`/human/${crumb.href}`)} class="hover:text-foreground transition-colors">
									{crumb.name}
								</a>
							{/if}
						{/each}
					</nav>
				</div>

				<!-- Header Actions -->
				<div class="flex items-center gap-2">
					<a href={resolve('/mcp')} title="Switch to MCP view" aria-label="Switch to MCP view">
						<Button
							variant="outline"
							size="icon"
							class="mcp-theme bg-background text-foreground border-border hover:bg-accent">
							<Bot size={20} />
						</Button>
					</a>
					<a href="https://github.com/xl0/lovely-docs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
						<Button variant="outline" size="icon">
							<Github size={20} />
						</Button>
					</a>
					<ThemeToggle />
				</div>
			</div>
		</header>

		<!-- Page Content -->
		<main class="container mx-auto max-w-4xl px-4 py-8">
			{#if currentNode}
				<div class="mb-6">
					<div class="mb-3 flex items-center justify-between">
						<h1 class="text-4xl font-bold tracking-tight">
							{titleText}
						</h1>
						<Badge variant={currentNode.relevant ? 'default' : 'secondary'}>
							{currentNode.relevant ? '✓ Relevant' : 'Not relevant'}
						</Badge>
					</div>

					{#if currentNode?.markdown?.essence}
						<p class="text-muted-foreground border-primary/30 border-l-4 pl-4 text-lg italic">
							{currentNode.markdown.essence}
						</p>
					{/if}
				</div>

				<MarkdownPanel markdown={currentNode.markdown} tokenCounts={currentNode.token_counts} />
			{:else}
				<p class="text-destructive text-sm">Document not found.</p>
			{/if}
		</main>

		<Footer />
	</div>

	<!-- Mobile Sidebar Sheet -->
	<Sheet.Root bind:open={mobileMenuOpen}>
		<Sheet.Content side="left" class="w-80 overflow-y-auto p-0">
			<Sheet.Header class="border-border border-b p-4">
				<Sheet.Title>
					<a href={resolve('/human')} class="hover:text-primary text-lg font-semibold transition-colors">
						{lib.name}
					</a>
				</Sheet.Title>
			</Sheet.Header>
			<div class="p-4">
				<DocSidebar tree={fullTree} {libraryKey} />
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>
