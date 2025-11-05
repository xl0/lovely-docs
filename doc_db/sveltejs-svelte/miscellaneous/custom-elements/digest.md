## Compiling to Custom Elements

Svelte components can be compiled to web components using `customElement: true` compiler option. Specify a tag name with `<svelte:options customElement="my-element" />`. Access the host element via the `$host` rune.

```svelte
<svelte:options customElement="my-element" />
<script>
	let { name = 'world' } = $props();
</script>
<h1>Hello {name}!</h1>
<slot />
```

Inner components without a tag name remain regular Svelte components. The static `element` property contains the custom element constructor:

```js
import MyElement from './MyElement.svelte';
customElements.define('my-element', MyElement.element);
```

Use as regular DOM elements with props exposed as properties and attributes:

```js
const el = document.querySelector('my-element');
console.log(el.name);
el.name = 'everybody';
```

## Lifecycle

Custom elements wrap Svelte components. The inner component is created in the next tick after `connectedCallback`. Properties assigned before DOM insertion are saved and applied on creation. Shadow DOM updates happen in the next tick, allowing batched updates. The component is destroyed in the next tick after `disconnectedCallback`.

## Advanced Configuration

Use `customElement` as an object in `<svelte:options>` to configure:

- `tag: string` - Custom element tag name, auto-registers if set
- `shadow: "none"` - Disable shadow root (disables style encapsulation and slots)
- `props` - Configure individual properties:
  - `attribute: string` - Custom attribute name (default: lowercase property name)
  - `reflect: boolean` - Reflect prop changes back to DOM
  - `type: 'String' | 'Boolean' | 'Number' | 'Array' | 'Object'` - Type for attribute conversion
- `extend: function` - Receives custom element class, returns extended class for lifecycle customization or ElementInternals integration

```svelte
<svelte:options
	customElement={{
		tag: 'custom-element',
		shadow: 'none',
		props: {
			name: { reflect: true, type: 'Number', attribute: 'element-index' }
		},
		extend: (customElementConstructor) => {
			return class extends customElementConstructor {
				static formAssociated = true;
				constructor() {
					super();
					this.attachedInternals = this.attachInternals();
				}
				randomIndex() {
					this.elementIndex = Math.random();
				}
			};
		}
	}}
/>
```

## Important Limitations

- Styles are encapsulated in shadow DOM (unless `shadow: "none"`); global styles don't apply
- Styles are inlined as JavaScript strings, not extracted to CSS files
- Not suitable for server-side rendering
- Slotted content renders eagerly in DOM (not lazily like in Svelte)
- `let:` directive has no effect
- Context cannot be shared across custom elements
- Don't use property/attribute names starting with `on` (interpreted as event listeners)
- Must explicitly list all props; `let props = $props()` won't expose properties