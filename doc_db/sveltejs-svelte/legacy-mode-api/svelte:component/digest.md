In legacy mode, use `<svelte:component this={MyComponent} />` to dynamically render components. When the `this` expression changes, the component instance is destroyed and recreated. If `this` is falsy, no component is rendered.

In runes mode, `<MyComponent>` will automatically re-render when the component value changes, making `<svelte:component>` unnecessary.