## sequence

Helper function for chaining multiple `handle` hooks in middleware-like fashion.

### Behavior

- `transformPageChunk`: Applied in **reverse order** and merged
- `preload`: Applied in **forward order**, first one wins (subsequent calls skipped)
- `filterSerializedResponseHeaders`: Same as `preload` (first wins)

### Example

```js
import { sequence } from '@sveltejs/kit/hooks';

async function first({ event, resolve }) {
	console.log('first pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('first transform');
			return html;
		},
		preload: () => {
			console.log('first preload');
			return true;
		}
	});
	console.log('first post-processing');
	return result;
}

async function second({ event, resolve }) {
	console.log('second pre-processing');
	const result = await resolve(event, {
		transformPageChunk: ({ html }) => {
			console.log('second transform');
			return html;
		},
		preload: () => {
			console.log('second preload');
			return true;
		},
		filterSerializedResponseHeaders: () => {
			console.log('second filterSerializedResponseHeaders');
			return true;
		}
	});
	console.log('second post-processing');
	return result;
}

export const handle = sequence(first, second);
```

Execution order:
```
first pre-processing
first preload (wins, second preload skipped)
second pre-processing
second filterSerializedResponseHeaders (wins)
second transform
first transform (reverse order)
second post-processing
first post-processing
```

### Signature

```ts
function sequence(...handlers: Handle[]): Handle;
```