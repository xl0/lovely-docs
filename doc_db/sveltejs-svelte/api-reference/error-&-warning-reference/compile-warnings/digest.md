## Accessibility Warnings (a11y_*)

**a11y_accesskey** - Avoid `accesskey` attributes; they create keyboard shortcut conflicts with screen readers.

**a11y_aria_activedescendant_has_tabindex** - Elements with `aria-activedescendant` must have `tabindex` to be tabbable.

**a11y_aria_attributes** - Reserved elements like `<meta>`, `<html>`, `<script>`, `<style>` should not have `aria-*` attributes.

**a11y_autofocus** - Avoid `autofocus` on elements; it causes usability issues for all users.

**a11y_click_events_have_key_events** - Non-interactive elements with `onclick` must have keyboard handlers (`onkeyup`/`onkeydown`) and `tabindex`. Prefer `<button>` or `<a>` elements instead.

**a11y_consider_explicit_label** - Buttons and links need text content or `aria-label`/`aria-labelledby`/`title`.

**a11y_distracting_elements** - Avoid `<marquee>` and `<blink>` elements.

**a11y_figcaption_parent** - `<figcaption>` must be immediate child of `<figure>` and first or last child.

**a11y_hidden** - Don't hide heading elements with `aria-hidden="true"`.

**a11y_img_redundant_alt** - Alt text shouldn't contain "image", "picture", or "photo" since screen readers already announce `<img>` as an image.

**a11y_incorrect_aria_attribute_type** - ARIA attributes require correct types: `aria-hidden` needs boolean, `aria-activedescendant` needs ID string, etc.

**a11y_interactive_supports_focus** - Elements with interactive roles (like `role="button"`) must have `tabindex`.

**a11y_invalid_attribute** - `href` should not be empty, `#`, or `javascript:`.

**a11y_label_has_associated_control** - Labels must wrap a control or use `for` attribute pointing to an input ID.

**a11y_media_has_caption** - `<video>` elements need `<track kind="captions">` (except when `muted`).

**a11y_misplaced_role** - Reserved elements shouldn't have `role` attributes.

**a11y_misplaced_scope** - `scope` attribute only valid on `<th>` elements.

**a11y_missing_attribute** - Required attributes: `<a>` needs `href`, `<area>` needs `alt`/`aria-label`/`aria-labelledby`, `<html>` needs `lang`, `<iframe>` needs `title`, `<img>` needs `alt`, `<object>` needs `title`/`aria-label`/`aria-labelledby`, `<input type="image">` needs `alt`/`aria-label`/`aria-labelledby`.

**a11y_missing_content** - Headings and anchors must have text content accessible to screen readers.

**a11y_mouse_events_have_key_events** - `onmouseover` needs `onfocus`, `onmouseout` needs `onblur`.

**a11y_no_abstract_role** - Abstract ARIA roles are forbidden.

**a11y_no_interactive_element_to_noninteractive_role** - Don't use non-interactive roles (`article`, `banner`, `complementary`, `img`, `listitem`, `main`, `region`, `tooltip`) on interactive elements like `<textarea>`.

**a11y_no_noninteractive_element_interactions** - Non-interactive elements (`<main>`, `<area>`, `<h1-h6>`, `<p>`, `<img>`, `<li>`, `<ul>`, `<ol>`) shouldn't have mouse/keyboard handlers.

**a11y_no_noninteractive_element_to_interactive_role** - Don't use interactive roles (`button`, `link`, `checkbox`, `menuitem`, `option`, `radio`, `searchbox`, `switch`, `textbox`) on non-interactive elements.

**a11y_no_noninteractive_tabindex** - Non-interactive elements shouldn't have non-negative `tabindex`.

**a11y_no_redundant_roles** - Don't add roles already set by browser (e.g., `role="button"` on `<button>`).

**a11y_no_static_element_interactions** - `<div>` with click handlers needs an ARIA role.

**a11y_positive_tabindex** - Avoid `tabindex > 0`; it breaks expected tab order.

**a11y_role_has_required_aria_props** - ARIA roles require specific attributes (e.g., `role="checkbox"` needs `aria-checked`).

**a11y_role_supports_aria_props** - Only use ARIA attributes supported by the element's role.

**a11y_unknown_aria_attribute** - Only valid ARIA attributes from WAI-ARIA spec allowed.

**a11y_unknown_role** - Only valid, non-abstract ARIA roles allowed.

## Attribute Warnings

**attribute_avoid_is** - The `is` attribute isn't cross-browser supported.

**attribute_global_event_reference** - Referencing `globalThis.%name%` suggests a missing variable declaration.

**attribute_illegal_colon** - Attributes shouldn't contain `:` to avoid ambiguity with Svelte directives.

**attribute_invalid_property_name** - Invalid HTML attribute names.

**attribute_quoted** - Quoted attributes on components will be stringified in future versions.

## Code Quality Warnings

**bidirectional_control_characters** - Bidirectional control characters can alter code behavior; see trojansource.codes.

**bind_invalid_each_rest** - Rest operator in `{#each}` creates new object, breaking bindings with original.

**block_empty** - Empty blocks detected.

**component_name_lowercase** - Components must start with capital letter or treated as HTML elements.

**css_unused_selector** - Unused CSS selectors removed. Use `:global` to preserve selectors targeting `{@html}` content or child components.

**custom_element_props_identifier** - Using rest element or non-destructured `$props()` prevents custom element property inference; destructure or specify `customElement.props`.

**element_implicitly_closed** - Some HTML elements auto-close (e.g., `<p>` inside `<p>`). Add explicit closing tags.

**element_invalid_self_closing_tag** - HTML has no self-closing tags. Use `<div>...</div>` not `<div />`.

**event_directive_deprecated** - Use `on%name%` attribute instead of `on:%name%` directive.

**export_let_unused** - Unused export properties; use `export const` for external-only references.

**legacy_code** - Outdated syntax; use suggested replacement.

**legacy_component_creation** - Svelte 5 components aren't classes; use `mount()` or `hydrate()` from 'svelte'.

**node_invalid_placement_ssr** - HTML structure violations cause browser repairs breaking hydration. Examples: `<div>` in `<p>`, `<div>` in `<option>`, missing `<tbody>` in `<table>`.

**non_reactive_update** - Variables reassigned but not declared with `$state()` won't trigger updates.

**options_deprecated_accessors** - `accessors` option deprecated; no effect in runes mode.

**options_deprecated_immutable** - `immutable` option deprecated; no effect in runes mode.

**options_missing_custom_element** - Using custom element features without `customElement: true` compile option.

**options_removed_*** - Removed options: `enableSourcemap`, `hydratable`, `loopGuardTimeout`.

**options_renamed_ssr_dom** - `generate: "dom"` and `generate: "ssr"` renamed to `"client"` and `"server"`.

**perf_avoid_inline_class** - Declare classes at top level, not inline with `new class`.

**perf_avoid_nested_class** - Declare classes at top level scope.

**reactive_declaration_invalid_placement** - Reactive declarations only at top level of instance script.

**reactive_declaration_module_script_dependency** - Module-level reassignments don't trigger reactive statements.

**script_context_deprecated** - Use `<script module>` instead of `<script context="module">`.

**script_unknown_attribute** - Script attributes must be `generics`, `lang`, or `module`.

**slot_element_deprecated** - Use `{@render}` tags instead of `<slot>`.

**state_referenced_locally** - Referencing state after reassignment captures only initial value. Wrap in function for lazy evaluation or use derived values.

**store_rune_conflict** - Local binding conflicts with `$%name%` store rune; rename to avoid ambiguity.

**svelte_component_deprecated** - `<svelte:component>` deprecated; components are dynamic by default. Use `{@const Component = ...}` or self-imports.

**svelte_element_invalid_this** - `<svelte:element this={...}>` should use expressions, not string attributes.

**svelte_self_deprecated** - Use self-imports instead of `<svelte:self>`.

**unknown_code** - Unrecognized warning code.