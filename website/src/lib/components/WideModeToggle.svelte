<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import { Maximize2, Minimize2 } from '@lucide/svelte';
	import { wideMode } from '$lib/ui-state.svelte';
</script>

<Toggle
	pressed={wideMode.current}
	onPressedChange={() => (wideMode.current = !wideMode.current)}
	aria-label="Toggle wide mode"
	title={wideMode.current ? 'Exit wide mode' : 'Enter wide mode'}>
	{#if wideMode.current}
		<Minimize2 class="size-4" />
	{:else}
		<Maximize2 class="size-4" />
	{/if}
</Toggle>
