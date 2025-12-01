Transforms any value into `""` or `undefined` for proper HTML boolean attributes. Returns empty string for truthy values (attribute present) or undefined for falsy values (attribute absent).

```svelte
<div data-active={boolAttr(isActive)}>Active</div>    <!-- <div data-active> if true -->
<div data-loading={boolAttr(isLoading)}>Loading</div>  <!-- <div> if false -->
```