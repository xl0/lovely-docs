## Accessibility (a11y_*)
- Avoid `accesskey`, `autofocus`
- Non-interactive elements with `onclick` need keyboard handlers and `tabindex`; prefer `<button>`/`<a>`
- `aria-activedescendant` needs `tabindex`
- Reserved elements (`<meta>`, `<html>`, `<script>`, `<style>`) shouldn't have `aria-*` or `role`
- Alt text shouldn't say "image"/"picture"/"photo"
- `<video>` needs `<track kind="captions">`
- Labels need associated controls via wrapping or `for` attribute
- Headings/anchors need text content
- `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`
- Don't mix interactive/non-interactive elements with wrong roles
- No positive `tabindex` values
- ARIA attributes must match role requirements

## Code Quality
- Components must start with capital letter
- Use `$state()` for reactive variables
- Declare classes at top level
- Use `<script module>` not `<script context="module">`
- Use `{@render}` not `<slot>`
- Use `mount()`/`hydrate()` not component classes
- HTML structure violations cause hydration issues: `<div>` in `<p>`, `<div>` in `<option>`, missing `<tbody>` in `<table>`
- State referenced after reassignment captures only initial value; wrap in function
- Unused CSS selectors removed; use `:global` to preserve
- Self-closing tags on non-void elements are ambiguous; use explicit closing tags