## Transitions

Transitions are triggered when elements enter or leave the DOM due to state changes. They are bidirectional and can be smoothly reversed mid-animation.

```svelte
import { fade } from 'svelte/transition';
let visible = $state(false);

<button onclick={() => visible = !visible}>toggle</button>
{#if visible}
  <div transition:fade>fades in and out</div>
{/if}
```

### Local vs Global

Transitions are local by default (only play when their block is created/destroyed). Use the `|global` modifier to play when parent blocks change:

```svelte
{#if x}
  {#if y}
    <p transition:fade>only when y changes</p>
    <p transition:fade|global>when x or y change</p>
  {/if}
{/if}
```

### Parameters

Transitions accept configuration parameters:

```svelte
<div transition:fade={{ duration: 2000 }}>fades over two seconds</div>
```

### Custom Transitions

Custom transition functions return an object with optional `delay`, `duration`, `easing`, `css`, and `tick` properties. The `css` function receives `t` (0-1 after easing) and `u` (1-t), and should return CSS string. Use `css` over `tick` when possible for better performance.

```js
function whoosh(node, params) {
  const existingTransform = getComputedStyle(node).transform.replace('none', '');
  return {
    duration: params.duration || 400,
    easing: params.easing || elasticOut,
    css: (t, u) => `transform: ${existingTransform} scale(${t})`
  };
}
```

The `tick` function is called during transition for imperative updates:

```js
function typewriter(node, { speed = 1 }) {
  const text = node.textContent;
  const duration = text.length / (speed * 0.01);
  return {
    duration,
    tick: (t) => {
      node.textContent = text.slice(0, ~~(text.length * t));
    }
  };
}
```

Transition functions receive a third `options` argument containing `direction` ('in', 'out', or 'both').

### Events

Elements with transitions dispatch: `introstart`, `introend`, `outrostart`, `outroend`

```svelte
<p
  transition:fly={{ y: 200, duration: 2000 }}
  onintrostart={() => (status = 'intro started')}
  onintroend={() => (status = 'intro ended')}
>
  Flies in and out
</p>
```