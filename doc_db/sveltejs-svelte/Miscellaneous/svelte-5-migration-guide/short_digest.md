## Key Changes

**Reactivity**: `let` → `$state`, `$:` → `$derived`/`$effect`, `export let` → `$props()`

**Events**: `on:click` → `onclick`, `createEventDispatcher` → callback props, event modifiers removed

**Slots**: `<slot />` → `children` prop with `{@render}`, named slots → props, `let:` → snippets

**Components**: Functions not classes; use `mount(App, {target})` instead of `new App({target})`

**Runes mode breaking changes**: No export bindings, `$bindable()` required for two-way binding, `accessors`/`immutable` ignored, stricter HTML/attributes

**Other**: Modern browsers only, whitespace simplified, `null`/`undefined` → empty string, form resets trigger bindings