<script lang="ts">
	import { resolve } from '$app/paths';
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css';

	$effect(() => {
		if (mode.current === 'light') {
			import('highlight.js/styles/github.min.css');
		} else {
			import('highlight.js/styles/github-dark.min.css');
		}
	});
	let { children } = $props();
</script>

<ModeWatcher />
{@render children()}

<div class="hidden" aria-hidden="true">
	<a href={resolve('/human')}>human-index</a>
</div>
