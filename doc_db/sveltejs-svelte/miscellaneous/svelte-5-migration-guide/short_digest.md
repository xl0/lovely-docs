## Key Changes

**Reactivity**: `let` → `$state()`, `$:` → `$derived()` or `$effect()`

**Props**: `export let` → `let { prop } = $props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props

**Slots**: `<slot />` → `children` prop with `{@render children?.()}`

**Components**: `new Component()` → `mount(Component, { target })`

**Migration**: Run `npx sv migrate svelte-5` for automatic conversion