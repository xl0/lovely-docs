## Compile Errors Reference

Complete list of compiler error codes and messages for Svelte components.

### Animation Errors
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element with `animate:` must be the only child of a keyed `{#each}` block
- `animation_missing_key`: `animate:` requires a keyed `{#each}` block

### Attribute Errors
- `attribute_contenteditable_dynamic`: `contenteditable` cannot be dynamic with two-way binding
- `attribute_contenteditable_missing`: `contenteditable` required for textContent/innerHTML/innerText bindings
- `attribute_duplicate`: Attributes must be unique
- `attribute_empty_shorthand`: Attribute shorthand cannot be empty
- `attribute_invalid_event_handler`: Event attributes must be JavaScript expressions, not strings
- `attribute_invalid_multiple`: `multiple` must be static if select uses two-way binding
- `attribute_invalid_name`: Invalid attribute name
- `attribute_invalid_sequence_expression`: Sequence expressions in runes mode must be wrapped in parentheses
- `attribute_invalid_type`: `type` must be static if input uses two-way binding
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless it's the only value

### Binding Errors
- `bind_group_invalid_expression`: `bind:group` only works with Identifier or MemberExpression
- `bind_group_invalid_snippet_parameter`: Cannot `bind:group` to snippet parameters
- `bind_invalid_expression`: Can only bind to Identifier, MemberExpression, or `{get, set}` pair
- `bind_invalid_name`: Invalid binding name
- `bind_invalid_parens`: `bind:%name%={get, set}` must not have surrounding parentheses
- `bind_invalid_target`: `bind:%name%` only works with specific elements
- `bind_invalid_value`: Can only bind to state or props

### Block Errors
- `block_duplicate_clause`: Block clause cannot appear more than once
- `block_invalid_continuation_placement`: `{:...}` block invalid at this position
- `block_invalid_elseif`: Use `else if` not `elseif`
- `block_invalid_placement`: `{#%name%}` block cannot be at this location
- `block_unclosed`: Block was left open
- `block_unexpected_character`: Expected specific character after opening bracket
- `block_unexpected_close`: Unexpected block closing tag

### Component Errors
- `component_invalid_directive`: Directive type not valid on components

### Const Tag Errors
- `const_tag_cycle`: Cyclical dependency in `{@const}` declarations
- `const_tag_invalid_expression`: `{@const}` must be a single variable declaration
- `const_tag_invalid_placement`: `{@const}` must be child of specific blocks/components

### Declaration Errors
- `constant_assignment`: Cannot assign to constants
- `constant_binding`: Cannot bind to constants
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`

### CSS Errors
- `css_empty_declaration`: CSS declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` cannot follow certain combinators
- `css_global_block_invalid_declaration`: Top-level `:global {}` can only contain rules, not declarations
- `css_global_block_invalid_list`: `:global` cannot mix with non-global selectors in same list. Split into separate selectors:
  ```css
  :global { y { color: red; } }
  x y { color: red; }
  ```
- `css_global_block_invalid_modifier`: `:global` cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` can only be modified if descendant of other selectors
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` only at start or end of selector sequence
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` cannot contain type/universal selectors in compound selector
- `css_nesting_selector_invalid_placement`: Nesting selectors only inside rules or first in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` cannot be followed by type selector

### Debug/Directive Errors
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers, not expressions
- `directive_invalid_value`: Directive value must be JavaScript expression in curly braces
- `directive_missing_name`: Directive name cannot be empty

### Each Block Errors
- `each_item_invalid_assignment`: In runes mode, cannot reassign/bind to each block argument. Use array and index instead:
  ```svelte
  {#each array as entry, i}
    <button onclick={() => array[i] = 4}>change</button>
    <input bind:value={array[i]}>
  {/each}
  ```

### Effect/Event Errors
- `effect_invalid_placement`: `$effect()` only as expression statement
- `event_handler_invalid_component_modifier`: Only `once` modifier on components
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Certain modifiers cannot be used together

### Element Errors
- `element_invalid_closing_tag`: Attempted to close element that wasn't open
- `element_invalid_closing_tag_autoclosed`: Element already auto-closed by browser
- `element_unclosed`: Element left open
- `illegal_element_attribute`: Element doesn't support non-event attributes or spreads

### Export/Props Errors
- `export_undefined`: Exported name not defined
- `derived_invalid_export`: Cannot export derived state from module
- `legacy_export_invalid`: Cannot use `export let` in runes mode — use `$props()` instead
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode
- `props_duplicate`: Cannot use `$props()` more than once
- `props_id_invalid_placement`: `$props.id()` only at top level as variable declaration initializer
- `props_illegal_name`: Props starting with `$$` are reserved
- `props_invalid_identifier`: `$props()` only with object destructuring
- `props_invalid_pattern`: `$props()` cannot contain nested properties or computed keys
- `props_invalid_placement`: `$props()` only at top level as variable declaration initializer

### Global/Host Errors
- `global_reference_invalid`: Illegal variable name. Use `globalThis.%name%` for globals
- `host_invalid_placement`: `$host()` only inside custom element component instances

### Import/Module Errors
- `import_svelte_internal_forbidden`: Cannot import from `svelte/internal/*` (private API)
- `runes_mode_invalid_import`: Certain imports cannot be used in runes mode
- `script_duplicate`: Only one `<script>` and one `<script module>` allowed
- `script_invalid_attribute_value`: Script attributes must be boolean
- `script_invalid_context`: Context attribute must be "module"
- `script_reserved_attribute`: Attribute is reserved
- `module_illegal_default_export`: Components cannot have default exports

### Inspect/Reactive Errors
- `inspect_trace_generator`: `$inspect.trace()` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace()` must be first statement in function
- `reactive_declaration_cycle`: Cyclical dependency in reactive declarations

### Rune Errors
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_arguments_length`: Rune must be called with specific number of arguments
- `rune_invalid_computed_property`: Cannot access computed property of rune
- `rune_invalid_name`: Not a valid rune
- `rune_invalid_spread`: Rune cannot be called with spread argument
- `rune_invalid_usage`: Cannot use rune in non-runes mode
- `rune_missing_parentheses`: Rune must have parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name
- `slot_attribute_invalid`: Slot attribute must be static
- `slot_attribute_invalid_placement`: Element with `slot=` must be child of component or custom element
- `slot_default_duplicate`: Cannot have default slot content alongside `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` only receives attributes and let directives
- `slot_element_invalid_name`: Slot attribute must be static
- `slot_element_invalid_name_default`: `default` is reserved, cannot be slot name
- `slot_snippet_conflict`: Cannot mix `<slot>` and `{@render}` tags in same component

### Snippet Errors
- `snippet_conflict`: Cannot use implicit children content with children snippet block
- `snippet_invalid_export`: Exported snippet can only reference `<script module>` or other exportable snippets
- `snippet_invalid_rest_parameter`: Snippets don't support rest parameters; use array instead
- `snippet_parameter_assignment`: Cannot reassign/bind to snippet parameter
- `snippet_shadowing_prop`: Snippet shadows prop with same name

### State Errors
- `state_field_duplicate`: State field already declared on class
- `state_field_invalid_assignment`: Cannot assign to state field before declaration
- `state_invalid_export`: Cannot export state from module if reassigned
- `state_invalid_placement`: `$state()` only as variable declaration, class field, or first constructor assignment

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to non-top-level stores
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Store subscriptions only in `.svelte` files

### Style/Transition Errors
- `style_directive_invalid_modifier`: `style:` only uses `important` modifier
- `style_duplicate`: Only one `<style>` element allowed
- `transition_conflict`: Cannot use multiple transition types on same element
- `transition_duplicate`: Cannot use multiple `%type%:` directives

### Svelte Meta Tag Errors
- `svelte_body_illegal_attribute`: `<svelte:body>` doesn't support non-event attributes
- `svelte_boundary_invalid_attribute`: Valid attributes: `onerror`, `failed`
- `svelte_boundary_invalid_attribute_value`: Attribute value must be non-string expression
- `svelte_component_invalid_this`: Invalid component definition
- `svelte_component_missing_this`: `<svelte:component>` must have `this` attribute
- `svelte_element_missing_this`: `<svelte:element>` must have `this` attribute
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` only has slot attribute and let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct child of component
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes/directives
- `svelte_meta_duplicate`: Only one `<%name%>` element allowed
- `svelte_meta_invalid_content`: `<%name%>` cannot have children
- `svelte_meta_invalid_placement`: `<svelte:...>` tags cannot be inside elements/blocks
- `svelte_meta_invalid_tag`: Invalid `<svelte:...>` tag name
- `svelte_options_deprecated_tag`: "tag" option deprecated — use "customElement" instead
- `svelte_options_invalid_attribute`: `<svelte:options>` only static attributes
- `svelte_options_invalid_attribute_value`: Invalid attribute value
- `svelte_options_invalid_customelement`: "customElement" must be string or object with tag/shadow/props
- `svelte_options_invalid_customelement_props`: "props" must be static object literal
- `svelte_options_invalid_customelement_shadow`: "shadow" must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name is reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute
- `svelte_self_invalid_placement`: `<svelte:self>` only in `{#if}`, `{#each}`, `{#snippet}` blocks or slots
- `title_illegal_attribute`: `<title>` cannot have attributes/directives
- `title_invalid_content`: `<title>` only text and `{tags}`

### Parsing/Syntax Errors
- `dollar_binding_invalid`: `$` name reserved, cannot use for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved, cannot use for variables/imports
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected 'if', 'each', 'await', 'key' or 'snippet'
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `invalid_arguments_usage`: `arguments` keyword not allowed in template/top level
- `js_parse_error`: JavaScript parse error
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode, use `$derived` or `$effect`
- `let_directive_invalid_placement`: `let:` directive at invalid position
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes
- `node_invalid_placement`: Element placement violates HTML restrictions (browser will repair)
- `options_invalid_value`: Invalid compiler option
- `options_removed`: Compiler option removed
- `options_unrecognised`: Unrecognized compiler option
- `render_tag_invalid_call_expression`: Cannot call snippet with apply/bind/call
- `render_tag_invalid_expression`: `{@render}` only contains call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread in `{@render}` tags
- `tag_invalid_name`: Invalid element/component name
- `tag_invalid_placement`: `{@%name%}` tag at invalid location
- `textarea_invalid_content`: `<textarea>` has either value attribute or child content, not both
- `typescript_invalid_feature`: TypeScript features not natively supported outside `<script>` tags
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word used incorrectly
- `unterminated_string_constant`: Unterminated string
- `void_element_invalid_content`: Void elements cannot have children/closing tags