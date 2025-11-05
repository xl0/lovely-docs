## Accessibility Warnings (a11y_*)

Enforce accessible HTML patterns:
- `a11y_accesskey`: Avoid `accesskey` attributes
- `a11y_aria_activedescendant_has_tabindex`: Elements with `aria-activedescendant` must have `tabindex`
- `a11y_aria_attributes`: Reserved elements (`meta`, `html`, `script`, `style`) shouldn't have `aria-*` attributes
- `a11y_autofocus`: Avoid `autofocus` on elements
- `a11y_click_events_have_key_events`: Non-interactive elements with `onclick` need keyboard handlers (`onkeyup`/`onkeydown`) and `tabindex`
- `a11y_consider_explicit_label`: Buttons and links need text or `aria-label`/`aria-labelledby`
- `a11y_distracting_elements`: Avoid `<marquee>` and `<blink>`
- `a11y_figcaption_index`: `<figcaption>` must be first or last child of `<figure>`
- `a11y_figcaption_parent`: `<figcaption>` must be immediate child of `<figure>`
- `a11y_hidden`: Certain elements (`h1-h6`) shouldn't be hidden with `aria-hidden="true"`
- `a11y_img_redundant_alt`: `alt` text shouldn't contain "image", "picture", or "photo"
- `a11y_incorrect_aria_attribute_type`: ARIA attributes must have correct types (boolean, ID, integer, token, etc.)
- `a11y_interactive_supports_focus`: Interactive roles need `tabindex`
- `a11y_invalid_attribute`: Attributes like `href` must have valid values (not empty, `#`, or `javascript:`)
- `a11y_label_has_associated_control`: Labels must wrap a control or use `for` attribute with input ID
- `a11y_media_has_caption`: `<video>` needs `<track kind="captions">` (unless `muted`)
- `a11y_misplaced_role`: Reserved elements shouldn't have `role` attributes
- `a11y_misplaced_scope`: `scope` attribute only for `<th>` elements
- `a11y_missing_attribute`: Required attributes: `<a>` needs `href`, `<area>` needs `alt`/`aria-label`/`aria-labelledby`, `<html>` needs `lang`, `<iframe>` needs `title`, `<img>` needs `alt`, `<object>` needs `title`/`aria-label`/`aria-labelledby`, `<input type="image">` needs `alt`/`aria-label`/`aria-labelledby`
- `a11y_missing_content`: Headings and anchors need text content
- `a11y_mouse_events_have_key_events`: `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`
- `a11y_no_abstract_role`: Abstract ARIA roles forbidden
- `a11y_no_interactive_element_to_noninteractive_role`: Interactive elements can't have non-interactive roles (`article`, `banner`, `complementary`, `img`, `listitem`, `main`, `region`, `tooltip`)
- `a11y_no_noninteractive_element_interactions`: Non-interactive elements (`main`, `area`, `h1-h6`, `p`, `img`, `li`, `ul`, `ol`) shouldn't have event listeners
- `a11y_no_noninteractive_element_to_interactive_role`: Non-interactive elements can't have interactive roles (`button`, `link`, `checkbox`, `menuitem`, `option`, `radio`, `searchbox`, `switch`, `textbox`)
- `a11y_no_noninteractive_tabindex`: Non-interactive elements can't have non-negative `tabindex`
- `a11y_no_redundant_roles`: Don't repeat implicit roles (e.g., `<button role="button">`)
- `a11y_no_static_element_interactions`: `<div>` with event handlers needs ARIA role
- `a11y_positive_tabindex`: Avoid `tabindex > 0` (breaks tab order)
- `a11y_role_has_required_aria_props`: ARIA roles need required attributes (e.g., `checkbox` needs `aria-checked`)
- `a11y_role_supports_aria_props`: Only use ARIA attributes supported by the element's role
- `a11y_unknown_aria_attribute`: Only valid ARIA attributes allowed
- `a11y_unknown_role`: Only valid, non-abstract ARIA roles allowed

## Attribute Warnings

- `attribute_avoid_is`: Avoid `is` attribute (cross-browser issues)
- `attribute_global_event_reference`: Warn when referencing `globalThis.%name%` without declaration
- `attribute_illegal_colon`: Attributes shouldn't contain `:` (conflicts with directives)
- `attribute_invalid_property_name`: Invalid HTML attribute names
- `attribute_quoted`: Quoted attributes on components will stringify in future versions

## Code Quality Warnings

- `bidirectional_control_characters`: Detect bidirectional control characters that can alter code appearance
- `bind_invalid_each_rest`: Rest operator in `{#each}` creates new object, breaking bindings
- `block_empty`: Empty blocks detected
- `component_name_lowercase`: Components must start with capital letter
- `css_unused_selector`: Unused CSS selectors removed (use `:global` to preserve)
- `custom_element_props_identifier`: Can't infer custom element props with rest elements or non-destructured `$props()`
- `element_implicitly_closed`: HTML elements implicitly closed by following tags
- `element_invalid_self_closing_tag`: Non-void elements shouldn't use self-closing syntax
- `event_directive_deprecated`: Use `on%name%` attribute instead of `on:%name%` directive
- `export_let_unused`: Unused export properties (use `export const` for external-only references)
- `legacy_code`: Deprecated syntax patterns
- `legacy_component_creation`: Svelte 5 components aren't classes; use `mount` or `hydrate`
- `node_invalid_placement_ssr`: HTML structure violations cause browser repairs, breaking hydration
- `non_reactive_update`: Variables reassigned without `$state()` won't trigger updates
- `options_deprecated_accessors`: `accessors` option deprecated in runes mode
- `options_deprecated_immutable`: `immutable` option deprecated in runes mode
- `options_missing_custom_element`: Missing `customElement: true` compile option
- `options_removed_*`: Removed options: `enableSourcemap`, `hydratable`, `loopGuardTimeout`
- `options_renamed_ssr_dom`: `generate: "dom"` → `"client"`, `generate: "ssr"` → `"server"`
- `perf_avoid_inline_class`: Declare classes at top level, not inline
- `perf_avoid_nested_class`: Don't declare classes in nested scopes
- `reactive_declaration_invalid_placement`: Reactive declarations only at top level
- `reactive_declaration_module_script_dependency`: Module-level reassignments don't trigger reactive statements
- `script_context_deprecated`: Use `module` attribute instead of `context="module"`
- `script_unknown_attribute`: Only `generics`, `lang`, `module` allowed on `<script>`
- `slot_element_deprecated`: Use `{@render ...}` instead of `<slot>`
- `state_referenced_locally`: Reassigned state loses reactivity when referenced in same scope; wrap in function for lazy evaluation
- `store_rune_conflict`: Local binding conflicts with `$%name%` store subscription
- `svelte_component_deprecated`: `<svelte:component>` deprecated; components are dynamic by default
- `svelte_element_invalid_this`: `<svelte:element this={...}>` should use expressions, not strings
- `svelte_self_deprecated`: Use self-imports instead of `<svelte:self>`
- `unknown_code`: Unrecognized warning code