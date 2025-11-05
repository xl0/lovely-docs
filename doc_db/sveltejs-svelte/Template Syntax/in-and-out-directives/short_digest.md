`in:` and `out:` directives apply non-bidirectional transitions. The `in` transition plays alongside `out` rather than reversing if the block is outroed during the transition. Aborted `out` transitions restart from scratch.

```svelte
{#if visible}
  <div in:fly={{ y: 200 }} out:fade>flies in, fades out</div>
{/if}
```