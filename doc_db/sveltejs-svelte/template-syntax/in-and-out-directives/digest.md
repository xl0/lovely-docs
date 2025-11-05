The `in:` and `out:` directives apply transitions that are not bidirectional, unlike `transition:`. An `in` transition continues playing alongside an `out` transition if the block is removed while the transition is in progress, rather than reversing. If an `out` transition is aborted, transitions restart from scratch.

Example:
```svelte
<script>
  import { fade, fly } from 'svelte/transition';
  let visible = $state(false);
</script>

<label>
  <input type="checkbox" bind:checked={visible}>
  visible
</label>

{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```

The element flies in with a 200px vertical offset and fades out when removed, with both transitions playing independently.