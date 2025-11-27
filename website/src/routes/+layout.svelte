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
<div class='min-h-screen flex flex-col justify-between'>
	{@render children()}

	<footer class="ml-auto mr-8 mb-4 mt-4 text-sm text-muted">
		Made by <a
			href="https://alexey.work/?ref=ld"
			target="_blank"
			rel="noopener noreferrer"
			class="text-muted-foreground hover:underline">Alexey</a> with ❤️

	</footer>

	<div class="hidden" aria-hidden="true">
		<a href={resolve('/human')}>human-index</a>
	</div>
</div>
