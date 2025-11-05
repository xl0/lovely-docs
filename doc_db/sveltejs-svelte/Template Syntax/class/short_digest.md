## Setting Classes

**Attribute approach (preferred in Svelte 5.16+):**
- Strings: `class={condition ? 'large' : 'small'}`
- Objects: `class={{ cool, lame: !cool }}`
- Arrays: `class={[faded && 'saturate-0', large && 'scale-200']}`
- Nested arrays/objects flatten automatically

**Directive approach (legacy):**
```svelte
<div class:cool={cool} class:lame={!cool}>...</div>
<!-- shorthand: -->
<div class:cool class:lame={!cool}>...</div>
```

Use `ClassValue` type for type-safe component props.