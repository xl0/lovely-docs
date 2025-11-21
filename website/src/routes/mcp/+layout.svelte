<script lang="ts">
	import type { LayoutData } from './$types';
	import * as Select from '$lib/components/ui/select';
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
		if (routeId === '/mcp/[library]/[...path]') {
			resourceCommand = 'doc-page';
			const params = page.params;
			if (params.library && params.library !== selectedLibrary) {
				selectedLibrary = params.library;
			}

			const fullPath = params.path ? `${params.library}/${params.path}` : (params.library ?? '');
			if (fullPath !== selectedPath) {
				selectedPath = fullPath;
			}

			const hash = page.url.hash.slice(1);
			if (hash && hash !== selectedLevel) {
				selectedLevel = hash;
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
			}
		} else {
			selectedEcosystem = value;
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
			const url = `/mcp/${lib}${rest ? '/' + rest : ''}#${selectedLevel}`;
			// @ts-ignore
			goto(resolve(url));
		}
	}
	function handleCommandChange(value: string) {
		const newCommand = value as ResourceCommandId;
		resourceCommand = newCommand;

		if (newCommand !== 'doc-page') {
			if (page.route.id !== '/mcp') {
				// @ts-ignore
				goto(resolve('/mcp'));
			}
		} else if (selectedPath) {
			navigate();
		}
	}
</script>

<div class="min-h-screen bg-black text-green-400 font-mono">
	<div class="w-full px-4 py-8 space-y-6">
		<header class="border-b border-green-700 pb-4 mb-4">
			<h1 class="text-2xl tracking-widest uppercase">lovely-docs :: mcp console</h1>
			<p class="text-xs text-green-600 mt-1">Fake MCP interface over static docs. No network. No daemons. Just bits.</p>
		</header>

		<div
			role="tablist"
			aria-label="MCP data views"
			class="flex gap-2 border border-green-800/60 rounded-md p-2 bg-black/40 items-center">
			{#each tabs as tab}
				<button
					id={`tab-${tab.id}`}
					role="tab"
					class={`px-3 py-1 text-sm uppercase tracking-wide border border-green-800 rounded-sm transition ${
						mode === tab.id ? 'bg-green-900/40 text-green-100' : 'text-green-500'
					}`}
					aria-selected={mode === tab.id}
					aria-controls={`panel-${tab.id}`}
					onclick={() => (mode = tab.id)}>
					{tab.label}
					<span class="ml-1 text-[10px] text-green-600">{tab.description}</span>
				</button>
			{/each}

			{#if resourceCommand === 'doc-page'}
				<button
					class={`ml-auto px-2 py-0.5 text-xs border border-green-700 rounded-sm transition ${
						mcpState.renderMarkdown ? 'bg-green-900/40 text-green-100' : 'text-green-500'
					}`}
					onclick={() => (mcpState.renderMarkdown = !mcpState.renderMarkdown)}
					aria-label="Toggle markdown rendering">
					{mcpState.renderMarkdown ? 'MD: ON' : 'MD: OFF'}
				</button>
			{/if}
		</div>

		{#if mode === 'tools'}
			<section class="grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6">
				<aside class="space-y-4">
					<div class="border border-green-700 bg-black/60 p-3 space-y-2">
						<div class="text-xs text-green-500">ecosystem</div>
						<select
							class="w-full bg-black text-green-400 border border-green-700 text-xs px-1 py-0.5"
							value={selectedEcosystem}
							onchange={handleEcosystemChange}>
							{#each ecosystemOptions as eco}
								<option value={eco}>{eco}</option>
							{/each}
						</select>
					</div>

					<div class="border border-green-700 bg-black/60 p-3 flex items-center justify-between text-xs">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" class="accent-green-500" checked={verbose} onchange={toggleVerbose} />
							<span>verbose</span>
						</label>
						<span class="text-green-600">--detail {verbose ? 'on' : 'off'}</span>
					</div>
				</aside>

				<div
					class="border border-green-700 bg-black/80 p-4 overflow-auto min-h-[320px]"
					role="tabpanel"
					aria-labelledby="tab-tools">
					<h2 class="text-sm text-green-300 mb-2">$ mcp tools :: listLibraries</h2>
					{#if currentTools.length === 0}
						<p class="text-xs text-green-600"># no tools for this ecosystem</p>
					{:else}
						{#each currentTools as t}
							<div class="mb-4">
								<div class="text-xs text-green-500 mb-1"># ecosystem: {t.label}</div>
								<pre class="text-xs whitespace-pre-wrap">
{verbose ? t.verboseYaml : t.payloadYaml}
								</pre>
							</div>
						{/each}
					{/if}
				</div>
			</section>
		{:else}
			<section aria-labelledby="tab-resources" class="space-y-4">
				<div
					class="border border-green-800 bg-black/80 rounded px-4 py-3 text-sm flex flex-wrap items-center gap-2 font-mono">
					<span class="text-green-500">$</span>
					<span class="text-green-400">lovely-docs://</span>

					<Select.Root type="single" value={resourceCommand} onValueChange={handleCommandChange}>
						<Select.Trigger size="sm" class="bg-black/70 border-green-700 text-green-100" aria-label="Resource command">
							<span>{resourceCommand}</span>
						</Select.Trigger>
						<Select.Content class="bg-black border border-green-700 text-green-100">
							{#each resourceCommands as cmd}
								<Select.Item value={cmd.id}>{cmd.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<span class="text-green-400">/</span>
					<Select.Root type="single" value={targetValue} onValueChange={handleTargetChange}>
						<Select.Trigger
							size="sm"
							class="bg-black/70 border-green-700 text-green-100"
							aria-label={currentCommand?.target === 'library' ? 'Library' : 'Ecosystem'}>
							<span>{selectedTargetLabel}</span>
						</Select.Trigger>
						<Select.Content class="bg-black border border-green-700 text-green-100 max-h-56">
							{#each targetOptions as option}
								<Select.Item value={option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>

					{#if resourceCommand === 'doc-page'}
						<span class="text-green-400">/</span>
						<Select.Root type="single" value={selectedPath} onValueChange={handlePathChange}>
							<Select.Trigger
								size="sm"
								class="bg-black/70 border-green-700 text-green-100 min-w-[200px]"
								aria-label="Path">
								<span>{pathOptions.find((o) => o.value === selectedPath)?.label ?? selectedPath ?? '/'}</span>
							</Select.Trigger>
							<Select.Content class="bg-black border border-green-700 text-green-100 max-h-56">
								{#each pathOptions as option}
									<Select.Item value={option.value}>{option.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>

						<span class="text-green-400">?level=</span>
						<Select.Root type="single" value={selectedLevel} onValueChange={handleLevelChange}>
							<Select.Trigger size="sm" class="bg-black/70 border-green-700 text-green-100" aria-label="Level">
								<span>{selectedLevel}</span>
							</Select.Trigger>
							<Select.Content class="bg-black border border-green-700 text-green-100">
								{#each data.mcp.markdownVariants as v}
									<Select.Item value={v}>{v}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/if}
				</div>

				<div
					class="border border-green-700 bg-black/80 p-4 overflow-auto min-h-[320px]"
					role="tabpanel"
					aria-live="polite">
					{#if resourceCommand === 'doc-page'}
						{@render children()}
					{:else if resourceCommand === 'doc-index' || resourceCommand === 'doc-index-verbose'}
						{#if activeResource}
							<div class="font-mono text-xs whitespace-pre-wrap">
								{#if resourceCommand === 'doc-index'}
									{#each activeResource.index as lib}
										<button
											class="block w-full text-left text-green-400 hover:text-green-100 hover:bg-green-900/20 transition-colors"
											onclick={() => {
												resourceCommand = 'page-index';
												selectedLibrary = lib;
											}}>
											<span class="text-green-600">- </span>{lib}
										</button>
									{/each}
								{:else}
									{#each Object.entries(activeResource.verbose) as [lib, summary]}
										<button
											class="block w-full text-left text-green-400 hover:text-green-100 hover:bg-green-900/20 transition-colors"
											onclick={() => {
												resourceCommand = 'page-index';
												selectedLibrary = lib;
											}}>
											{lib}<span class="text-green-600">: {summary}</span>
										</button>
									{/each}
								{/if}
							</div>
						{:else}
							<p class="text-xs text-green-600"># no resources for this ecosystem</p>
						{/if}
					{:else if resourceCommand === 'page-index'}
						{#snippet treeNode(node: unknown, prefix: string = '')}
							{#if Array.isArray(node)}
								{#each node as child}
									{#if typeof child === 'string'}
										{@const fullPath = prefix ? `${prefix}/${child}` : child}
										<button
											class="w-full text-left text-green-400 hover:text-green-100 hover:bg-green-900/20 transition-colors"
											onclick={() => {
												resourceCommand = 'doc-page';
												selectedPath = fullPath;
												navigate();
											}}>
											<span class="text-green-600">- </span>{child}
										</button>
									{:else if typeof child === 'object' && child !== null}
										{#each Object.entries(child) as [key, value]}
											{@const fullPath = prefix ? `${prefix}/${key}` : key}
											<div>
												<button
													class="w-full text-left text-green-400 hover:text-green-100 hover:bg-green-900/20 transition-colors"
													onclick={() => {
														resourceCommand = 'doc-page';
														selectedPath = fullPath;
														navigate();
													}}>
													{key}<span class="text-green-600">:</span>
												</button>
												<div class="pl-4 border-l border-green-900/30 ml-1">
													{@render treeNode(value, fullPath)}
												</div>
											</div>
										{/each}
									{/if}
								{/each}
							{/if}
						{/snippet}

						{#if pageIndexes.find((p) => p.label === selectedLibrary)?.tree}
							<div class="font-mono text-xs whitespace-pre-wrap">
								<button
									class="w-full text-left text-green-400 hover:text-green-100 hover:bg-green-900/20 transition-colors"
									onclick={() => {
										resourceCommand = 'doc-page';
										selectedPath = selectedLibrary;
										navigate();
									}}>
									/<span class="text-green-600">:</span>
								</button>
								<div class="pl-4 border-l border-green-900/30 ml-1">
									{@render treeNode(pageIndexes.find((p) => p.label === selectedLibrary)?.tree, selectedLibrary)}
								</div>
							</div>
						{:else}
							<p class="text-xs text-green-600"># no pages found for {selectedLibrary}</p>
						{/if}
					{:else if !resourceOutput}
						<p class="text-xs text-green-600"># no resources for this ecosystem</p>
					{:else}
						<pre class="text-xs whitespace-pre-wrap">
{resourceOutput}
						</pre>
					{/if}
				</div>
			</section>
		{/if}
	</div>
</div>
