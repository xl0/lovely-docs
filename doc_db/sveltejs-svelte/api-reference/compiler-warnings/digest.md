## Disabling Warnings

Use `<!-- svelte-ignore <code> -->` comments to suppress specific warnings:

```svelte
<!-- svelte-ignore a11y_autofocus -->
<input autofocus />
```

Multiple rules can be listed (comma-separated) with optional explanations:

```svelte
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions (because of reasons) -->
<div onclick>...</div>
```

## Accessibility Warnings (a11y_*)

- **a11y_accesskey**: Avoid `accesskey` attributes
- **a11y_aria_activedescendant_has_tabindex**: Elements with `aria-activedescendant` must have `tabindex`
- **a11y_aria_attributes**: Reserved elements (`meta`, `html`, `script`, `style`) shouldn't have `aria-*` attributes
- **a11y_autofocus**: Avoid `autofocus` attribute
- **a11y_click_events_have_key_events**: Non-interactive elements with `onclick` need keyboard handlers (`onkeyup`/`onkeydown`) and `tabindex`
- **a11y_consider_explicit_label**: Buttons/links need text or `aria-label`/`aria-labelledby`/`title`
- **a11y_distracting_elements**: Avoid `<marquee>` and `<blink>`
- **a11y_figcaption_index/parent**: `<figcaption>` must be first/last child of `<figure>` and immediate child
- **a11y_hidden**: Don't hide elements like `<h2>` with `aria-hidden="true"`
- **a11y_img_redundant_alt**: Alt text shouldn't contain "image", "picture", or "photo"
- **a11y_incorrect_aria_attribute_type**: ARIA attributes must have correct types (boolean, ID, integer, token, etc.)
- **a11y_interactive_supports_focus**: Interactive roles need `tabindex`
- **a11y_invalid_attribute**: Attributes like `href` must have valid values (not empty, `#`, or `javascript:`)
- **a11y_label_has_associated_control**: Labels must wrap a control or use `for` attribute with input ID
- **a11y_media_has_caption**: `<video>` needs `<track kind="captions">` (except when `muted`)
- **a11y_misplaced_role**: Reserved elements shouldn't have `role` attributes
- **a11y_misplaced_scope**: `scope` attribute only for `<th>` elements
- **a11y_missing_attribute**: Required attributes: `<a>` needs `href`, `<area>` needs `alt`/`aria-label`/`aria-labelledby`, `<html>` needs `lang`, `<iframe>` needs `title`, `<img>` needs `alt`, `<object>` needs `title`/`aria-label`/`aria-labelledby`, `<input type="image">` needs `alt`/`aria-label`/`aria-labelledby`
- **a11y_missing_content**: Headings and anchors must have text content
- **a11y_mouse_events_have_key_events**: `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`
- **a11y_no_abstract_role**: Abstract ARIA roles forbidden
- **a11y_no_interactive_element_to_noninteractive_role**: Can't use non-interactive roles on interactive elements
- **a11y_no_noninteractive_element_interactions**: Non-interactive elements (`<main>`, `<area>`, `<h1>`, `<p>`, `<img>`, `<li>`, `<ul>`, `<ol>`) shouldn't have event listeners
- **a11y_no_noninteractive_element_to_interactive_role**: Can't use interactive roles (`button`, `link`, `checkbox`, `menuitem`, `option`, `radio`, `searchbox`, `switch`, `textbox`) on non-interactive elements
- **a11y_no_noninteractive_tabindex**: Non-interactive elements can't have non-negative `tabindex`
- **a11y_no_redundant_roles**: Don't repeat implicit roles (e.g., `role="button"` on `<button>`)
- **a11y_no_static_element_interactions**: `<div>` with click handler needs ARIA role
- **a11y_positive_tabindex**: Avoid `tabindex > 0` (breaks tab order)
- **a11y_role_has_required_aria_props**: ARIA roles need required attributes
- **a11y_role_supports_aria_props**: Only use `aria-*` properties supported by the element's role
- **a11y_unknown_aria_attribute**: Only valid ARIA attributes allowed
- **a11y_unknown_role**: Only valid, non-abstract ARIA roles allowed

## Attribute Warnings

- **attribute_avoid_is**: `is` attribute not cross-browser compatible
- **attribute_global_event_reference**: Referencing `globalThis.%name%` without declaration
- **attribute_illegal_colon**: Attributes shouldn't contain `:` (conflicts with directives)
- **attribute_invalid_property_name**: Invalid HTML attribute name
- **attribute_quoted**: Quoted attributes on components will stringify in future versions

## Other Warnings

- **bidirectional_control_characters**: Bidirectional control characters detected (security risk)
- **bind_invalid_each_rest**: Rest operator in `each` binding won't work with original object
- **block_empty**: Empty block
- **component_name_lowercase**: Lowercase component names treated as HTML elements
- **css_unused_selector**: Unused CSS selector (use `:global` to preserve)
- **custom_element_props_identifier**: Can't infer custom element props with rest/non-destructured `$props()`
- **element_implicitly_closed**: Element implicitly closed by another (add explicit closing tag)
- **element_invalid_self_closing_tag**: Non-void elements shouldn't self-close; use explicit closing tags
- **event_directive_deprecated**: `on:%name%` deprecated; use `on%name%` attribute instead
- **export_let_unused**: Unused export property (use `export const` for external reference)
- **legacy_code**: Outdated syntax
- **legacy_component_creation**: Svelte 5 components aren't classes; use `mount` or `hydrate`
- **node_invalid_placement_ssr**: HTML structure violation causing browser repair and hydration mismatch
- **non_reactive_update**: Variable reassigned without `$state()` won't trigger updates
- **options_deprecated_accessors/immutable**: Deprecated options (no effect in runes mode)
- **options_missing_custom_element**: Missing `customElement: true` compile option
- **options_removed_***: Removed options (`enableSourcemap`, `hydratable`, `loopGuardTimeout`, `generate` renamed)
- **perf_avoid_inline_class/nested_class**: Declare classes at top level
- **reactive_declaration_invalid_placement**: Reactive declarations only at top level
- **reactive_declaration_module_script_dependency**: Module-level reassignments won't update reactive statements
- **script_context_deprecated**: `context="module"` deprecated; use `module` attribute
- **script_unknown_attribute**: Unrecognized script attribute
- **slot_element_deprecated**: `<slot>` deprecated; use `{@render ...}` instead
- **state_referenced_locally**: State reference captures initial value only; reference in function for reactivity
- **store_rune_conflict**: Local binding conflicts with `$%name%` store rune
- **svelte_component_deprecated**: `<svelte:component>` deprecated; components are dynamic by default
- **svelte_element_invalid_this**: `this` should be expression, not string
- **svelte_self_deprecated**: `<svelte:self>` deprecated; use self-imports
- **unknown_code**: Unrecognized warning code