## Setting Classes

**Attribute approach (preferred):**
- Primitives: `class={condition ? 'large' : 'small'}`
- Objects: `class={{ cool, lame: !cool }}`
- Arrays: `class={[faded && 'saturate-0', large && 'scale-200']}`
- Nested arrays/objects flatten automatically
- Type-safe with `ClassValue` type

**Directive approach (legacy):**
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
<div class:cool>...</div>
```