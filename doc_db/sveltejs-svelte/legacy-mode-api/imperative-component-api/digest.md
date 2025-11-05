## Creating a Component

Client-side components compiled with `generate: 'dom'` are JavaScript classes:

```ts
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: { answer: 42 },
	anchor: null,
	context: new Map(),
	hydrate: false,
	intro: false
});
```

**Initialization options:**
- `target` (required): HTMLElement or ShadowRoot to render into
- `anchor`: Child of target to render before
- `props`: Object of properties
- `context`: Map of root-level context key-value pairs
- `hydrate`: Upgrade existing DOM from server-side rendering (requires `hydratable: true` compiler option)
- `intro`: Play transitions on initial render

## Component Methods

**`$set(props)`** - Programmatically update props (schedules async update):
```ts
component.$set({ answer: 42 });
```

**`$on(event, callback)`** - Listen to component events, returns unsubscribe function:
```ts
const off = component.$on('selected', (event) => {
	console.log(event.detail.selection);
});
off();
```

**`$destroy()`** - Remove component from DOM and trigger onDestroy handlers

## Component Props

With `accessors: true` compiler option, props become getters/setters with synchronous updates:
```ts
console.log(component.count);
component.count += 1;
```

## Server-side Components

Server-side components expose a `render()` method returning `{ head, html, css }`:

```ts
const App = require('./App.svelte').default;
const { head, html, css } = App.render(
	{ answer: 42 },
	{ context: new Map([['key', 'value']]) }
);
```

**Note:** This API applies to Svelte 3 and 4. Svelte 5 uses `mount()`, `unmount()`, and `$state` instead.