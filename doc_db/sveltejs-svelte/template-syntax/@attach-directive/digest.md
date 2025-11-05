The `{@attach}` directive runs functions when an element mounts or when reactive state updates. Attachments can optionally return a cleanup function.

**Basic usage:**
```svelte
function myAttachment(element) {
  console.log(element.nodeName);
  return () => console.log('cleaning up');
}

<div {@attach myAttachment}>...</div>
```

**Attachment factories** - Return an attachment from a function to create reusable patterns:
```svelte
function tooltip(content) {
  return (element) => {
    const tooltip = tippy(element, { content });
    return tooltip.destroy;
  };
}

<button {@attach tooltip(content)}>Hover me</button>
```
The attachment re-runs whenever `content` changes.

**Inline attachments** - Define attachments directly on elements:
```svelte
<canvas {@attach (canvas) => {
  const context = canvas.getContext('2d');
  $effect(() => {
    context.fillStyle = color;
    context.fillRect(0, 0, canvas.width, canvas.height);
  });
}}></canvas>
```

**Passing to components** - Attachments become Symbol-keyed props that spread onto elements:
```svelte
<!-- Button.svelte -->
<button {...props}>{@render children?.()}</button>

<!-- App.svelte -->
<Button {@attach tooltip(content)}>Hover me</Button>
```

**Controlling re-runs** - Attachments are fully reactive and re-run on any state change. To avoid expensive setup work, pass data via a function and read it in a child effect:
```svelte
function foo(getBar) {
  return (node) => {
    veryExpensiveSetupWork(node);
    $effect(() => {
      update(node, getBar());
    });
  };
}
```

Use `createAttachmentKey` to add attachments programmatically, or `fromAction` to convert actions to attachments.