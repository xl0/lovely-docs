## Overview
As of Svelte 5.36, `await` can be used in three new places:
- Top level of component `<script>`
- Inside `$derived(...)` declarations
- Inside markup

Enable with `experimental.async: true` in `svelte.config.js`. This flag will be removed in Svelte 6.

## Synchronized Updates
When an `await` expression depends on state, UI updates wait for the async work to complete, preventing inconsistent states:

```svelte
<script>
  let a = $state(1);
  async function add(a, b) {
    await new Promise((f) => setTimeout(f, 500));
    return a + b;
  }
</script>
<input type="number" bind:value={a}>
<p>{a} + 2 = {await add(a, 2)}</p>
```

Changing `a` won't update the result until `add()` resolves.

## Concurrency
Multiple independent `await` expressions in markup run in parallel:
```svelte
<p>{await one()}</p>
<p>{await two()}</p>
```

Sequential `await` in `<script>` or async functions behave like normal JavaScript. Independent `$derived` expressions update independently but run sequentially on first creation (triggers `await_waterfall` warning).

## Loading States
Use `<svelte:boundary>` with `pending` snippet for placeholder UI during initial load. After first resolution, use `$effect.pending()` to detect subsequent async work.

Use `settled()` to get a promise that resolves when current update completes:
```js
import { tick, settled } from 'svelte';
await tick();
color = 'new';
await settled();
```

## Error Handling
Errors in `await` expressions bubble to the nearest error boundary.

## Server-Side Rendering
Await the `render()` return value for async SSR:
```js
const { head, body } = await render(App);
```

With `<svelte:boundary pending>`, the pending snippet renders while content is ignored. Other `await` expressions resolve before `render()` returns.

## Forking
The `fork()` API (5.42+) runs `await` expressions expected to happen soon, useful for preloading:
```js
let pending = fork(() => { open = true; });
pending?.commit();
pending?.discard();
```

## Caveats
- Experimental feature subject to breaking changes outside semver major releases
- Block effects now run before `$effect.pre` or `beforeUpdate` when `experimental.async` is true