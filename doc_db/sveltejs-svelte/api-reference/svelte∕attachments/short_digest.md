## createAttachmentKey
Creates a symbol key for programmatic attachments spread onto elements.

```js
const props = {
  [createAttachmentKey()]: (node) => { node.textContent = 'attached!'; }
};
```

## fromAction
Converts actions to attachments. Second argument must return the action's argument.

```js
<div {@attach fromAction(foo, () => bar)}>...</div>
```

## Attachment
Function running on element mount, optionally returning cleanup function for unmount.