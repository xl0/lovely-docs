## createAttachmentKey

Creates a symbol key for programmatic attachment creation. When spread onto an element, the symbol key is recognized as an attachment. Useful for library authors as an alternative to `{@attach ...}` syntax.

```js
import { createAttachmentKey } from 'svelte/attachments';

const props = {
  class: 'cool',
  onclick: () => alert('clicked'),
  [createAttachmentKey()]: (node) => {
    node.textContent = 'attached!';
  }
};
```

## fromAction

Converts an action into an attachment with identical behavior. The second argument must be a function that returns the action's argument, not the argument itself.

```js
// with an action
<div use:foo={bar}>...</div>

// with an attachment
<div {@attach fromAction(foo, () => bar)}>...</div>
```

## Attachment

An attachment is a function that runs when an element mounts to the DOM and optionally returns a cleanup function called on unmount. Can be attached via `{@attach ...}` tag or by spreading an object with a property created by `createAttachmentKey`.

```ts
interface Attachment<T extends EventTarget = Element> {
  (element: T): void | (() => void);
}
```