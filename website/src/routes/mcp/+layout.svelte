<script lang="ts">
	import type { LayoutData } from './$types';
	import * as Select from '$lib/components/ui/select';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { mcpState } from './state.svelte';
	import type { Snippet } from 'svelte';

	const { data, children } = $props<{ data: LayoutData; children: Snippet }>();

	type Ecosystem = LayoutData['mcp']['ecosystems'][number];
	type ResourceEntry = LayoutData['mcp']['resources'][number] & { index: string[]; verbose: Record<string, string> };
	type ToolEntry = LayoutData['mcp']['tools'][number];
	type LibraryOption = LayoutData['mcp']['libraries'][number];

	const tools = data.mcp.tools;
	const resources = data.mcp.resources;
	const libraries = data.mcp.libraries;
	const pageIndexes = data.mcp.pageIndexes as { label: string; yaml: string; paths: string[]; tree: unknown }[];
	const ecosystems = data.mcp.ecosystems;
	const ecosystemOptions = [...new Set(['*', ...ecosystems])];

	const tabs = [
		{ id: 'tools', label: '$ tools', description: 'listLibraries' },
		{ id: 'resources', label: '$ resources', description: 'doc-index' }
	] as const;
	type TabId = (typeof tabs)[number]['id'];

	let mode = $state<TabId>('resources');
	let selectedEcosystem = $state('*');
	let verbose = $state(false);

	type ResourceTarget = 'ecosystem' | 'library';
	type ResourceCommand =
		| { id: 'doc-index'; label: 'doc-index'; target: 'ecosystem'; field: ResourceField }
		| { id: 'doc-index-verbose'; label: 'doc-index-verbose'; target: 'ecosystem'; field: ResourceField }
		| { id: 'page-index'; label: 'page-index'; target: 'library'; field?: undefined }
		| { id: 'doc-page'; label: 'doc-page'; target: 'library'; field?: undefined };
	const resourceCommands: ResourceCommand[] = [
		{ id: 'doc-index', label: 'doc-index', target: 'ecosystem', field: 'indexYaml' },
		{ id: 'doc-index-verbose', label: 'doc-index-verbose', target: 'ecosystem', field: 'verboseYaml' },
		{ id: 'page-index', label: 'page-index', target: 'library' },
		{ id: 'doc-page', label: 'doc-page', target: 'library' }
	];
	type ResourceCommandId = ResourceCommand['id'];
	type ResourceField = 'indexYaml' | 'verboseYaml';
	let resourceCommand = $state<ResourceCommandId>('doc-index');
	let selectedLibrary = $state(libraries[0]?.key ?? '');
	let selectedPath = $state('');
	let selectedLevel = $state('digest');

	// Update selectedEcosystem when ecosystems changes
	$effect(() => {
		if (!ecosystemOptions.includes(selectedEcosystem)) {
			selectedEcosystem = ecosystemOptions[0];
		}
	});

	$effect(() => {
		if (currentCommand?.target === 'library') {
			if (!libraries.some((lib: LibraryOption) => lib.key === selectedLibrary)) {
				selectedLibrary = libraries[0]?.key ?? '';
			}
		}
	});

	$effect(() => {
		const routeId = page.route.id;
		const hash = page.url.hash.slice(1);

		// Handle doc-page route
		if (routeId === '/mcp/doc-page/[library]/[...path]') {
			resourceCommand = 'doc-page';
			const params = page.params;
			if (params.library && params.library !== selectedLibrary) {
				selectedLibrary = params.library;
			}

			const fullPath = params.path ? `${params.library}/${params.path}` : (params.library ?? '');
			if (fullPath !== selectedPath) {
				selectedPath = fullPath;
			}

			if (hash && hash !== selectedLevel) {
				selectedLevel = hash;
			}
		}
		// Handle doc-index route
		else if (routeId === '/mcp/doc-index') {
			resourceCommand = 'doc-index';
			// Ecosystem selection via hash
			if (hash && ecosystemOptions.includes(hash)) {
				selectedEcosystem = hash;
			}
		}
		// Handle doc-index-verbose route
		else if (routeId === '/mcp/doc-index-verbose') {
			resourceCommand = 'doc-index-verbose';
			// Ecosystem selection via hash
			if (hash && ecosystemOptions.includes(hash)) {
				selectedEcosystem = hash;
			}
		}
		// Handle page-index route
		else if (routeId === '/mcp/page-index/[library]') {
			resourceCommand = 'page-index';
			const params = page.params;
			if (params.library && params.library !== selectedLibrary) {
				selectedLibrary = params.library;
			}
		}
	});

	const currentCommand = $derived<ResourceCommand | undefined>(
		resourceCommands.find((cmd) => cmd.id === resourceCommand)
	);
	const currentTools = $derived<ToolEntry[]>(
		selectedEcosystem === '*' ? tools : tools.filter((t: ToolEntry) => t.label === selectedEcosystem)
	);
	const resourceField = $derived<ResourceField | undefined>(currentCommand?.field);
	const activeResource = $derived<ResourceEntry | undefined>(
		resources.find((r: ResourceEntry) => r.label === selectedEcosystem)
	);
	const pageIndexMap = $derived(new Map<string, string>(pageIndexes.map(({ label, yaml }) => [label, yaml])));
	const currentPaths = $derived(pageIndexes.find((p) => p.label === selectedLibrary)?.paths ?? []);
	const pathOptions = $derived(
		currentPaths.map((p) => {
			// Remove library prefix for display if possible, or just show full path
			// The user request implies {path*} which usually is relative to library?
			// But flattenPagePaths returns full paths.
			// Let's show the part after the library name if it starts with it.
			const label = p.startsWith(selectedLibrary + '/')
				? p.slice(selectedLibrary.length + 1)
				: p === selectedLibrary
					? '/'
					: p;
			return { value: p, label };
		})
	);
	const resourceOutput = $derived<string | null>(
		(() => {
			if (currentCommand?.target === 'library') {
				return selectedLibrary ? (pageIndexMap.get(selectedLibrary) ?? null) : null;
			}
			const field = resourceField;
			if (!field) return null;
			const active = activeResource;
			return active ? ((active[field] as string) ?? null) : null;
		})()
	);
	const targetOptions = $derived(
		currentCommand?.target === 'library'
			? (() => {
					const opts = libraries.map((lib: LibraryOption) => ({ value: lib.key, label: lib.name ?? lib.key }));
					return opts.length > 0 ? opts : [{ value: '', label: '(no libraries available)' }];
				})()
			: ecosystemOptions.map((eco) => ({ value: eco, label: eco }))
	);
	const targetValue = $derived(currentCommand?.target === 'library' ? selectedLibrary : selectedEcosystem);
	const selectedTargetLabel = $derived(
		(() => {
			const found = targetOptions.find((opt: { value: string; label: string }) => opt.value === targetValue);
			return found?.label ?? targetValue ?? '(none)';
		})()
	);

	function handleEcosystemChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		selectedEcosystem = select.value;
	}

	function handleTargetChange(value: string) {
		if (currentCommand?.target === 'library') {
			selectedLibrary = value;
			if (resourceCommand === 'doc-page') {
				selectedPath = value;
				navigate();
			} else if (resourceCommand === 'page-index') {
				// Navigate to page-index for this library
				// @ts-ignore
				goto(resolve(`/mcp/page-index/${value}`));
			}
		} else {
			selectedEcosystem = value;
			// Update URL hash for ecosystem selection in doc-index views
			if (resourceCommand === 'doc-index') {
				// @ts-ignore
				goto(resolve(`/mcp/doc-index${value !== '*' ? '#' + value : ''}`), { replaceState: true });
			} else if (resourceCommand === 'doc-index-verbose') {
				// @ts-ignore
				goto(resolve(`/mcp/doc-index-verbose${value !== '*' ? '#' + value : ''}`), { replaceState: true });
			}
		}
	}

	function toggleVerbose() {
		verbose = !verbose;
	}

	function handlePathChange(value: string) {
		selectedPath = value;
		navigate();
	}

	function handleLevelChange(value: string) {
		selectedLevel = value;
		navigate();
	}

	function navigate() {
		if (resourceCommand === 'doc-page' && selectedPath) {
			const parts = selectedPath.split('/');
			const lib = parts[0];
			const rest = parts.slice(1).join('/');
			const url = `/mcp/doc-page/${lib}${rest ? '/' + rest : ''}#${selectedLevel}`;
			// @ts-ignore
			goto(resolve(url));
		}
	}
	function handleCommandChange(value: string) {
		const newCommand = value as ResourceCommandId;
		resourceCommand = newCommand;

		if (newCommand === 'doc-page') {
			if (selectedPath) {
				navigate();
			}
		} else if (newCommand === 'doc-index') {
			const hash = selectedEcosystem !== '*' ? `#${selectedEcosystem}` : '';
			// @ts-ignore
			goto(resolve(`/mcp/doc-index${hash}`));
		} else if (newCommand === 'doc-index-verbose') {
			const hash = selectedEcosystem !== '*' ? `#${selectedEcosystem}` : '';
			// @ts-ignore
			goto(resolve(`/mcp/doc-index-verbose${hash}`));
		} else if (newCommand === 'page-index') {
			// @ts-ignore
			goto(resolve(`/mcp/page-index/${selectedLibrary}`));
		}
	}
</script>

<div class="mcp-theme min-h-screen bg-background text-foreground font-mono">
	<div class="w-full px-4 py-8 space-y-2">
		<header class="border-b border-border pb-4 mb-4">
			<h1 class="text-2xl tracking-widest uppercase">lovely-docs :: mcp console</h1>
			<p class="text-xs text-muted-foreground mt-1">
				Fake MCP interface over static docs. No network. No daemons. Just bits.
			</p>
		</header>

		<Card.Root class="border-border bg-card/40">
			<Card.Content class="">
				<div role="tablist" aria-label="MCP data views" class="flex gap-2 items-center">
					{#each tabs as tab}
						<Button
							variant={mode === tab.id ? 'default' : 'outline'}
							size="sm"
							class="uppercase tracking-wide font-mono"
							id={`tab-${tab.id}`}
							role="tab"
							aria-selected={mode === tab.id}
							aria-controls={`panel-${tab.id}`}
							onclick={() => (mode = tab.id)}>
							{tab.label}
							<span class="ml-1 text-[10px] opacity-60">{tab.description}</span>
						</Button>
					{/each}

					{#if resourceCommand === 'doc-page'}
						<Button
							variant={mcpState.renderMarkdown ? 'default' : 'outline'}
							size="sm"
							class="ml-auto font-mono"
							onclick={() => (mcpState.renderMarkdown = !mcpState.renderMarkdown)}
							aria-label="Toggle markdown rendering">
							{mcpState.renderMarkdown ? 'MD: ON' : 'MD: OFF'}
						</Button>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		{#if mode === 'tools'}
			<section class="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
				<aside class="space-y-4">
					<Card.Root class="border-border bg-card">
						<Card.Content class="space-y-2">
							<div class="text-xs text-foreground/70">ecosystem</div>
							<select
								class="w-full bg-background text-foreground border border-border text-xs px-1 py-0.5 rounded"
								value={selectedEcosystem}
								onchange={handleEcosystemChange}>
								{#each ecosystemOptions as eco}
									<option value={eco}>{eco}</option>
								{/each}
							</select>
						</Card.Content>
					</Card.Root>

					<Card.Root class="border-border bg-card">
						<Card.Content class="flex items-center justify-between text-xs">
							<label class="flex items-center gap-2 cursor-pointer">
								<input type="checkbox" class="accent-primary" checked={verbose} onchange={toggleVerbose} />
								<span>verbose</span>
							</label>
							<span class="text-muted-foreground">--detail {verbose ? 'on' : 'off'}</span>
						</Card.Content>
					</Card.Root>
				</aside>

				<Card.Root class="border-border bg-card">
					<Card.Content class="overflow-auto min-h-[320px]" role="tabpanel" aria-labelledby="tab-tools">
						<h2 class="text-sm text-foreground/90 mb-2">$ mcp tools :: listLibraries</h2>
						{#if currentTools.length === 0}
							<p class="text-xs text-muted-foreground"># no tools for this ecosystem</p>
						{:else}
							{#each currentTools as t}
								<div class="mb-4">
									<div class="text-xs text-foreground/70 mb-1"># ecosystem: {t.label}</div>
									<pre class="text-xs whitespace-pre-wrap">
{verbose ? t.verboseYaml : t.payloadYaml}
									</pre>
								</div>
							{/each}
						{/if}
					</Card.Content>
				</Card.Root>
			</section>
		{:else}
			<section aria-labelledby="tab-resources" class="space-y-2">
				<Card.Root class="border-border bg-card">
					<Card.Content class="text-sm flex flex-wrap items-center gap-2 font-mono">
						<span class="text-foreground/70">$</span>
						<span class="text-foreground">lovely-docs://</span>

						<Select.Root type="single" value={resourceCommand} onValueChange={handleCommandChange}>
							<Select.Trigger
								size="sm"
								class="bg-background border-border text-foreground"
								aria-label="Resource command">
								<span>{resourceCommand}</span>
							</Select.Trigger>
							<Select.Content class="bg-popover border border-border text-popover-foreground">
								{#each resourceCommands as cmd}
									<Select.Item value={cmd.id}>{cmd.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
						<span class="text-foreground">/</span>
						<Select.Root type="single" value={targetValue} onValueChange={handleTargetChange}>
							<Select.Trigger
								size="sm"
								class="bg-background border-border text-foreground"
								aria-label={currentCommand?.target === 'library' ? 'Library' : 'Ecosystem'}>
								<span>{selectedTargetLabel}</span>
							</Select.Trigger>
							<Select.Content class="bg-popover border border-border text-popover-foreground max-h-56">
								{#each targetOptions as option}
									<Select.Item value={option.value}>{option.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>

						{#if resourceCommand === 'doc-page'}
							<span class="text-foreground">/</span>
							<Select.Root type="single" value={selectedPath} onValueChange={handlePathChange}>
								<Select.Trigger
									size="sm"
									class="bg-background border-border text-foreground min-w-[200px]"
									aria-label="Path">
									<span>{pathOptions.find((o) => o.value === selectedPath)?.label ?? selectedPath ?? '/'}</span>
								</Select.Trigger>
								<Select.Content class="bg-popover border border-border text-popover-foreground max-h-56">
									{#each pathOptions as option}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>

							<span class="text-foreground">?level=</span>
							<Select.Root type="single" value={selectedLevel} onValueChange={handleLevelChange}>
								<Select.Trigger size="sm" class="bg-background border-border text-foreground" aria-label="Level">
									<span>{selectedLevel}</span>
								</Select.Trigger>
								<Select.Content class="bg-popover border border-border text-popover-foreground">
									{#each data.mcp.markdownVariants as v}
										<Select.Item value={v}>{v}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/if}
					</Card.Content>
				</Card.Root>

				<Card.Root class="">
					<Card.Content class="overflow-auto min-h-[320px]" role="tabpanel" aria-live="polite">
						{@render children()}
					</Card.Content>
				</Card.Root>
			</section>
		{/if}
	</div>

	<!-- Hidden links for static site generation crawler -->
	<div class="hidden" aria-hidden="true">
		<!-- Index pages for each ecosystem -->
		<a href={resolve('/mcp/doc-index')}>doc-index</a>
		<a href={resolve('/mcp/doc-index-verbose')}>doc-index-verbose</a>
			<a href={resolve(`/mcp/doc-index`)}>doc-index</a>
			<a href={resolve(`/mcp/doc-index-verbose`)}>doc-index-verbose</a>
		<!-- Page index for each library -->
		{#each libraries as lib}
			<a href={resolve(`/mcp/page-index/${lib.key}`)}>page-index {lib.key}</a>
		{/each}
	</div>
</div>
