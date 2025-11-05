## Default Slots

```svelte
<Modal>This is slotted content</Modal>
<!-- renders with -->
<slot></slot>
```

## Named Slots

```svelte
<Modal>
  <div slot="buttons"><button>close</button></div>
</Modal>
<!-- renders with -->
<slot name="buttons"></slot>
```

## Fallback Content

```svelte
<slot>Default content if nothing provided</slot>
```

## Passing Data to Slots

```svelte
<!-- Component -->
<slot item={process(data)} />

<!-- Parent -->
<FancyList let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

For named slots, use `let:` on the element with `slot` attribute.
