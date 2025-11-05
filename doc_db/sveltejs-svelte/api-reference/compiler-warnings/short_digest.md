## Disabling Warnings

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />

<!-- Multiple rules with explanation -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (reason) -->
<div onclick>...</div>
```

## Key Accessibility Warnings

- **a11y_click_events_have_key_events**: Non-interactive elements with `onclick` need `onkeyup`/`onkeydown` and `tabindex`
- **a11y_missing_attribute**: `<a>` needs `href`, `<img>` needs `alt`, `<html>` needs `lang`, `<iframe>` needs `title`
- **a11y_no_noninteractive_element_interactions**: Non-interactive elements (`<main>`, `<h1>`, `<p>`, `<img>`, `<li>`) shouldn't have event listeners
- **a11y_no_noninteractive_element_to_interactive_role**: Can't use interactive roles on non-interactive elements
- **a11y_no_static_element_interactions**: `<div>` with click handler needs ARIA role
- **a11y_positive_tabindex**: Avoid `tabindex > 0`
- **a11y_img_redundant_alt**: Alt text shouldn't contain "image", "picture", "photo"
- **a11y_media_has_caption**: `<video>` needs `<track kind="captions">`

## Other Important Warnings

- **non_reactive_update**: Variable reassigned without `$state()` won't trigger updates
- **state_referenced_locally**: State reference captures initial value; wrap in function for reactivity
- **element_invalid_self_closing_tag**: Non-void elements need explicit closing tags
- **css_unused_selector**: Use `:global` to preserve selectors targeting dynamic content
- **legacy_component_creation**: Use `mount` or `hydrate` instead of component classes
- **slot_element_deprecated**: Use `{@render ...}` instead of `<slot>`