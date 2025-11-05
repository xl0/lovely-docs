## Transitions

Triggered when elements enter/leave DOM. Bidirectional and reversible.

```svelte
<div transition:fade={{ duration: 2000 }}>fades in and out</div>
```

**Local vs Global**: Local by default (only when block changes). Use `|global` for parent changes.

**Custom Functions**: Return object with `delay`, `duration`, `easing`, `css`, `tick`. Use `css` for performance:

```js
function whoosh(node, params) {
  return {
    duration: 400,
    css: (t, u) => `transform: scale(${t})`
  };
}
```

**Events**: `introstart`, `introend`, `outrostart`, `outroend`