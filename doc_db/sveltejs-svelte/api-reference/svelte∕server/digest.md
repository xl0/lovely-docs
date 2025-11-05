## render

Server-side only function for rendering Svelte components to HTML. Available when compiling with the `server` option.

**Function signature:**
```js
render(component, options?)
```

**Parameters:**
- `component`: A Svelte component (SvelteComponent or Component type)
- `options` (optional):
  - `props`: Component props (excludes `$$slots` and `$$events`)
  - `context`: Map for passing context values
  - `idPrefix`: String prefix for generated IDs

**Returns:** `RenderOutput` object with `body` and `head` properties containing the rendered HTML.

**Example:**
```js
import { render } from 'svelte/server';
import MyComponent from './MyComponent.svelte';

const output = render(MyComponent, {
  props: { title: 'Hello' },
  context: new Map([['theme', 'dark']]),
  idPrefix: 'app-'
});

// output.body contains the component HTML
// output.head contains any <svelte:head> content
```