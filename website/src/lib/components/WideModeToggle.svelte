<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import { Maximize2, Minimize2 } from '@lucide/svelte';
	import { wideMode } from '$lib/wide-mode.svelte';
</script>

<Toggle
	pressed={wideMode.value}
	onPressedChange={() => wideMode.toggle()}
	aria-label="Toggle wide mode"
	title={wideMode.value ? 'Exit wide mode' : 'Enter wide mode'}>
	{#if wideMode.value}
		<Minimize2 class="size-4" />
	{:else}
		<Maximize2 class="size-4" />
	{/if}
</Toggle>
