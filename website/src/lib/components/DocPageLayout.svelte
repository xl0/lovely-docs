<script lang="ts">
	import { resolve } from '$app/paths';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import WideModeToggle from '$lib/components/WideModeToggle.svelte';
	import DocSidebar from '$lib/components/DocSidebar.svelte';
	import DocOutline from '$lib/components/DocOutline.svelte';
	import MarkdownPanel from '$lib/components/MarkdownPanel.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Search from '$lib/components/Search.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Github, Bot, Menu, ChevronDown, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen } from '@lucide/svelte';
	import { sidebarOpen, outlineOpen, wideMode } from '$lib/ui-state.svelte';
	import type { LibraryDBItem, DocItem } from 'lovely-docs/doc-cache';

	let { data } = $props();
	let lib: Omit<LibraryDBItem, 'tree'> = $derived(data.libraryInfo);
	let libraryKey: string = $derived(data.libraryKey);
	let pathSegments: string[] = $derived(data.pathSegments ?? []);
	let currentNode: DocItem = $derived(data.currentNode);
	let fullTree: DocItem = $derived(data.fullTree);
	// Sort libraries: current first, then alphabetically
	let allLibraries = $derived.by(() => {
		const libs = (data.allLibraries ?? []) as { key: string; displayName: string }[];
		return [...libs].sort((a, b) => {
			if (a.key === libraryKey) return -1;
			if (b.key === libraryKey) return 1;
			return a.displayName.localeCompare(b.displayName);
		});
	});

	let isRoot = $derived(pathSegments.length === 0);
	let hasChildren = $derived(Object.keys(fullTree.children).length > 0);

	// Compute siblings for each breadcrumb level (current node first, then others)
	type SiblingInfo = { key: string; displayName: string; isCurrent: boolean };
	let siblings = $derived.by(() => {
		const result: SiblingInfo[][] = [];
		let node: DocItem = fullTree;
		for (let i = 0; i < pathSegments.length; i++) {
			const segment = pathSegments[i];
			const siblingsAtLevel = Object.entries(node.children).map(([key, child]) => ({
				key,
				displayName: child.displayName,
				isCurrent: key === segment
			}));
			// Sort: current first, then alphabetically
			siblingsAtLevel.sort((a, b) => {
				if (a.isCurrent) return -1;
				if (b.isCurrent) return 1;
				return a.displayName.localeCompare(b.displayName);
			});
			result.push(siblingsAtLevel);
			node = node.children[segment];
		}
		return result;
	});

	let breadcrumbs = $derived(
		pathSegments.map((segment, i) => ({
			name: segment,
			href: `${libraryKey}/${pathSegments.slice(0, i + 1).join('/')}`,
			isLast: i === pathSegments.length - 1
		}))
	);

	let titleText = $derived(isRoot ? lib.name : (currentNode?.displayName ?? ''));

	// Bound from MarkdownPanel - the currently selected markdown variant
	let selectedMarkdown = $state('');
	let selectedVariantName = $state('');

	// Bound from DocOutline - whether TOC has items
	let hasToc = $state(false);

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
	<!-- Desktop Sidebar (only show if library has children and sidebar is open) -->
	{#if hasChildren && sidebarOpen.current}
		<aside
			class="border-border bg-background sticky top-0 hidden h-screen w-64 overflow-y-auto border-r lg:block"
			onwheel={handleSidebarWheel}>
			<div class="border-border border-b p-4">
				<a href={resolve(`/human/${libraryKey}`)} class="hover:text-primary text-lg font-semibold transition-colors">
					{lib.name}
				</a>
			</div>
			<div class="p-4">
				<DocSidebar tree={fullTree} {libraryKey} />
			</div>
		</aside>
	{/if}

	<!-- Main Content -->
	<div class="min-w-0 flex-1">
		<!-- Header -->
		<header class="border-border bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 border-b backdrop-blur">
			<div class="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-3">
					<!-- Mobile Menu Button (only show if library has children) -->
					{#if hasChildren}
						<Button variant="ghost" size="icon" class="lg:hidden" onclick={() => (mobileMenuOpen = true)}>
							<Menu class="h-5 w-5" />
						</Button>
					{/if}

					<!-- Desktop Sidebar Toggle -->
					<span class="hidden lg:flex" title={hasChildren ? '' : 'The library has only 1 page'}>
						<Button variant="outline" size="icon" disabled={!hasChildren} onclick={() => (sidebarOpen.current = !sidebarOpen.current)}>
							{#if sidebarOpen.current && hasChildren}
								<PanelLeftClose size={20} />
							{:else}
								<PanelLeftOpen size={20} />
							{/if}
						</Button>
					</span>

					<!-- Breadcrumbs -->
					<nav class="text-muted-foreground flex flex-wrap items-center gap-1 text-sm">
						<a href={resolve('/human')} class="hover:text-foreground transition-colors">Home</a>
						<span class="mx-1">/</span>

						<!-- Library breadcrumb with dropdown -->
						{#if allLibraries.length > 0}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger class="hover:text-foreground inline-flex items-center gap-0.5 transition-colors">
									<a href={resolve(`/human/${libraryKey}`)} class="hover:text-foreground" onclick={(e) => e.stopPropagation()}>
										{lib.name}
									</a>
									<ChevronDown class="h-3 w-3" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="start" class="max-h-64 overflow-y-auto">
									{#each allLibraries as otherLib}
										<DropdownMenu.Item>
											<a href={resolve(`/human/${otherLib.key}`)} class="block w-full">{otherLib.displayName}</a>
										</DropdownMenu.Item>
									{/each}
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{:else}
							<a href={resolve(`/human/${libraryKey}`)} class="hover:text-foreground transition-colors">{lib.name}</a>
						{/if}

						<!-- Path breadcrumbs with dropdowns -->
						{#each breadcrumbs as crumb, i}
							<span class="mx-1">/</span>
							{@const crumbSiblings = siblings[i] ?? []}
							{#if crumb.isLast}
								{#if crumbSiblings.length > 0}
									<DropdownMenu.Root>
										<DropdownMenu.Trigger class="text-foreground inline-flex items-center gap-0.5">
											{crumb.name}
											<ChevronDown class="h-3 w-3" />
										</DropdownMenu.Trigger>
										<DropdownMenu.Content align="start" class="max-h-64 overflow-y-auto">
											{#each crumbSiblings as sibling}
												{@const siblingHref = `${libraryKey}/${pathSegments.slice(0, i).join('/')}${i > 0 ? '/' : ''}${sibling.key}`}
												<DropdownMenu.Item>
													<a href={resolve(`/human/${siblingHref}`)} class="block w-full">{sibling.displayName}</a>
												</DropdownMenu.Item>
											{/each}
										</DropdownMenu.Content>
									</DropdownMenu.Root>
								{:else}
									<span class="text-foreground">{crumb.name}</span>
								{/if}
							{:else if crumbSiblings.length > 0}
								<DropdownMenu.Root>
									<DropdownMenu.Trigger class="hover:text-foreground inline-flex items-center gap-0.5 transition-colors">
										<a href={resolve(`/human/${crumb.href}`)} class="hover:text-foreground" onclick={(e) => e.stopPropagation()}>
											{crumb.name}
										</a>
										<ChevronDown class="h-3 w-3" />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="start" class="max-h-64 overflow-y-auto">
										{#each crumbSiblings as sibling}
											{@const siblingHref = `${libraryKey}/${pathSegments.slice(0, i).join('/')}${i > 0 ? '/' : ''}${sibling.key}`}
											<DropdownMenu.Item>
												<a href={resolve(`/human/${siblingHref}`)} class="block w-full">{sibling.displayName}</a>
											</DropdownMenu.Item>
										{/each}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							{:else}
								<a href={resolve(`/human/${crumb.href}`)} class="hover:text-foreground transition-colors">{crumb.name}</a>
							{/if}
						{/each}
					</nav>
				</div>

				<!-- Header Actions -->
				<div class="flex items-center gap-2 self-end sm:self-auto">
					<Search libraryFilter={libraryKey} placeholder="Search in {lib.name}..." />
					<a href={resolve('/mcp')} title="Switch to MCP view" aria-label="Switch to MCP view" class="hidden sm:block">
						<Button variant="outline" size="icon" class="mcp-theme bg-background text-foreground border-border hover:bg-accent">
							<Bot size={20} />
						</Button>
					</a>
					<a href="https://github.com/xl0/lovely-docs" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
						<Button variant="outline" size="icon">
							<Github size={20} />
						</Button>
					</a>
					<ThemeToggle />
					<div class="hidden lg:block">
						<WideModeToggle />
					</div>
					<!-- Outline Toggle -->
					<span class="hidden xl:block" title={hasToc ? '' : 'No headings in this document'}>
						<Button
							variant="outline"
							size="icon"
							disabled={!hasToc}
							onclick={() => (outlineOpen.current = !outlineOpen.current)}>
							{#if outlineOpen.current && hasToc}
								<PanelRightClose size={20} />
							{:else}
								<PanelRightOpen size={20} />
							{/if}
						</Button>
					</span>
				</div>
			</div>
		</header>

		<!-- Page Content with Outline -->
		<div class="flex">
			<main class="min-w-0 flex-1 px-4 py-8" class:max-w-4xl={!wideMode.current} class:mx-auto={!wideMode.current}>
				{#if currentNode}
					<div class="mb-4">
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

					<MarkdownPanel
						markdown={currentNode.markdown}
						tokenCounts={currentNode.token_counts}
						bind:selectedMarkdown
						bind:selectedVariantName />
				{:else}
					<p class="text-destructive text-sm">Document not found.</p>
				{/if}
			</main>

			<!-- Hidden DocOutline to compute hasToc -->
			<div class="hidden">
				<DocOutline markdown={selectedMarkdown} variant={selectedVariantName} bind:hasToc />
			</div>
			<!-- Right Outline Panel (hidden on smaller screens) -->
			{#if selectedMarkdown && outlineOpen.current && hasToc}
				<aside class="sticky top-16 hidden h-fit w-52 shrink-0 py-8 pr-4 xl:block">
					<DocOutline markdown={selectedMarkdown} variant={selectedVariantName} />
				</aside>
			{/if}
		</div>

		<Footer />
	</div>

	<!-- Mobile Sidebar Sheet (only render if library has children) -->
	{#if hasChildren}
		<Sheet.Root bind:open={mobileMenuOpen}>
			<Sheet.Content side="left" class="w-80 overflow-y-auto p-0">
				<Sheet.Header class="border-border border-b p-4">
					<Sheet.Title>
						<a
							href={resolve('/human')}
							class="hover:text-primary text-lg font-semibold transition-colors"
							onclick={() => (mobileMenuOpen = false)}>
							{lib.name}
						</a>
					</Sheet.Title>
				</Sheet.Header>
				<div class="p-4" onclick={() => (mobileMenuOpen = false)} onkeydown={() => (mobileMenuOpen = false)} role="button" tabindex="0">
					<DocSidebar tree={fullTree} {libraryKey} />
				</div>
			</Sheet.Content>
		</Sheet.Root>
	{/if}
</div>
