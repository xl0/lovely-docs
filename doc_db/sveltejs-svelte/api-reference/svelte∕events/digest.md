## on()

Attaches an event handler to DOM elements (window, document, HTMLElement, MediaQueryList, or generic EventTarget) and returns a function to remove the handler.

Unlike `addEventListener`, using `on()` preserves the correct handler execution order relative to declaratively-added handlers (like `onclick` attributes), which use event delegation for performance.

**Signature:**
```js
on(element, type, handler, options?) => () => void
```

**Parameters:**
- `element`: Window, Document, HTMLElement, MediaQueryList, or EventTarget
- `type`: Event type string
- `handler`: Callback function receiving the event
- `options`: Optional AddEventListenerOptions

**Returns:** Function that removes the event handler when called

**Example:**
```js
import { on } from 'svelte/events';

const unsubscribe = on(window, 'resize', (event) => {
  console.log('Window resized');
});

// Later, remove the handler
unsubscribe();
```