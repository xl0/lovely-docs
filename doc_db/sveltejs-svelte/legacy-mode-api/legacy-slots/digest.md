## Default Slots

In legacy mode, content inside component tags is slotted content, rendered using `<slot>`:

```svelte
<!-- App.svelte -->
<Modal>This is some slotted content</Modal>

<!-- Modal.svelte -->
<div class="modal">
  <slot></slot>
</div>
```

To render a literal `<slot>` element, use `<svelte:element this={'slot'} />`.

## Named Slots

Add `slot="..."` attribute to elements on the parent side:

```svelte
<!-- App.svelte -->
<Modal>
  This is some slotted content
  <div slot="buttons">
    <button on:click={() => open = false}>close</button>
  </div>
</Modal>

<!-- Modal.svelte -->
<div class="modal">
  <slot></slot>
  <hr>
  <slot name="buttons"></slot>
</div>
```

## Fallback Content

Define fallback content inside the `<slot>` element:

```svelte
<slot>
  This will be rendered if no slotted content is provided
</slot>
```

## Passing Data to Slots

Slots can pass values back to the parent using props. The parent exposes values using `let:` directive:

```svelte
<!-- FancyList.svelte -->
<ul>
  {#each items as data}
    <li class="fancy">
      <slot item={process(data)} />
    </li>
  {/each}
</ul>

<!-- App.svelte -->
<FancyList {items} let:item={processed}>
  <div>{processed.text}</div>
</FancyList>
```

For named slots, the `let:` directive goes on the element with the `slot` attribute:

```svelte
<!-- FancyList.svelte -->
<ul>
  {#each items as item}
    <li class="fancy">
      <slot name="item" item={process(data)} />
    </li>
  {/each}
</ul>
<slot name="footer" />

<!-- App.svelte -->
<FancyList {items}>
  <div slot="item" let:item>{item.text}</div>
  <p slot="footer">Copyright (c) 2019 Svelte Industries</p>
</FancyList>
```

Shorthand: `let:item` equals `let:item={item}`, and `<slot {item}>` equals `<slot item={item}>`.
