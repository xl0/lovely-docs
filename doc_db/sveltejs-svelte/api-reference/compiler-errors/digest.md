## Compiler Errors Reference

Complete list of Svelte compiler error codes with descriptions and explanations.

### Animation Errors
- `animation_duplicate`: Element can only have one `animate:` directive
- `animation_invalid_placement`: Element using `animate:` must be the only child of a keyed `{#each}` block
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
- `attribute_unquoted_sequence`: Attribute values with `{...}` must be quoted unless only containing the expression

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
- `block_invalid_continuation_placement`: `{:...}` block invalid (unclosed preceding element/block)
- `block_invalid_elseif`: Use `else if` instead of `elseif`
- `block_invalid_placement`: `{#%name%}` block cannot be in this location
- `block_unclosed`: Block was left open
- `block_unexpected_character`: Expected specific character after opening bracket
- `block_unexpected_close`: Unexpected block closing tag

### Component Errors
- `component_invalid_directive`: Directive type not valid on components
- `svelte_component_invalid_this`: Invalid component definition
- `svelte_component_missing_this`: `<svelte:component>` requires `this` attribute

### Const Tag Errors
- `const_tag_cycle`: Cyclical dependency detected
- `const_tag_invalid_expression`: `{@const}` must be single variable declaration
- `const_tag_invalid_placement`: `{@const}` must be immediate child of specific blocks/components
- `const_tag_invalid_reference`: Const declaration not available in snippet scope

Example of invalid const reference:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error: foo not available -->
    {/snippet}
</svelte:boundary>
```

### CSS Errors
- `css_empty_declaration`: Declaration cannot be empty
- `css_expected_identifier`: Expected valid CSS identifier
- `css_global_block_invalid_combinator`: `:global` cannot follow combinator
- `css_global_block_invalid_declaration`: Top-level `:global {}` can only contain rules
- `css_global_block_invalid_list`: `:global` cannot mix with non-global selectors in list
- `css_global_block_invalid_modifier`: `:global` cannot modify existing selector
- `css_global_block_invalid_modifier_start`: `:global` only modifiable as descendant
- `css_global_block_invalid_placement`: `:global` cannot be inside pseudoclass
- `css_global_invalid_placement`: `:global(...)` only at start or end of sequence
- `css_global_invalid_selector`: `:global(...)` must contain exactly one selector
- `css_global_invalid_selector_list`: `:global(...)` cannot contain type/universal selectors in compound
- `css_nesting_selector_invalid_placement`: Nesting selectors only in rules or first in lone `:global(...)`
- `css_selector_invalid`: Invalid selector
- `css_type_selector_invalid_placement`: `:global(...)` cannot be followed by type selector

Invalid CSS example:
```css
:global, x {
    y { color: red; }
}
```
Split into:
```css
:global { y { color: red; } }
x y { color: red; }
```

### Debug/Directive Errors
- `debug_tag_invalid_arguments`: `{@debug}` arguments must be identifiers
- `directive_invalid_value`: Directive value must be JavaScript expression in curly braces
- `directive_missing_name`: Directive name cannot be empty

### Declaration/Export Errors
- `declaration_duplicate`: Variable already declared
- `declaration_duplicate_module_import`: Cannot declare variable with same name as import in `<script module>`
- `derived_invalid_export`: Cannot export derived state; export function instead
- `export_undefined`: Variable not defined
- `legacy_export_invalid`: Cannot use `export let` in runes mode; use `$props()` instead
- `module_illegal_default_export`: Component cannot have default export

### Each Block Errors
- `each_item_invalid_assignment`: Cannot reassign/bind to each block argument in runes mode; use array/index instead

Example:
```svelte
<!-- runes mode - invalid -->
{#each array as entry}
    <button onclick={() => entry = 4}>change</button>
{/each}

<!-- correct -->
{#each array as entry, i}
    <button onclick={() => array[i] = 4}>change</button>
{/each}
```

- `each_key_without_as`: `{#each}` without `as` clause cannot have key

### Effect/Event Errors
- `effect_invalid_placement`: `$effect()` only as expression statement
- `event_handler_invalid_component_modifier`: Only `once` modifier on components
- `event_handler_invalid_modifier`: Invalid event modifier
- `event_handler_invalid_modifier_combination`: Modifiers cannot be used together
- `mixed_event_handler_syntaxes`: Cannot mix `on:%name%` and `on%name%` syntaxes

### Element Errors
- `element_invalid_closing_tag`: Attempted to close unopened element
- `element_invalid_closing_tag_autoclosed`: Element already auto-closed by browser
- `element_unclosed`: Element left open
- `illegal_element_attribute`: Element doesn't support non-event attributes/spreads
- `textarea_invalid_content`: `<textarea>` cannot have both value attribute and child content
- `title_illegal_attribute`: `<title>` cannot have attributes/directives
- `title_invalid_content`: `<title>` only contains text and `{tags}`
- `void_element_invalid_content`: Void elements cannot have children/closing tags

### Global/Host Errors
- `global_reference_invalid`: Illegal variable name; use `globalThis.%name%` for globals
- `host_invalid_placement`: `$host()` only in custom element components

### Import/Inspect Errors
- `import_svelte_internal_forbidden`: Cannot import from `svelte/internal/*`
- `inspect_trace_generator`: `$inspect.trace()` cannot be in generator function
- `inspect_trace_invalid_placement`: `$inspect.trace()` must be first statement in function

### Props/Runes Errors
- `bindable_invalid_location`: `$bindable()` only in `$props()` declaration
- `props_duplicate`: Cannot use `%rune%()` more than once
- `props_id_invalid_placement`: `$props.id()` only at component top level as variable initializer
- `props_illegal_name`: Props starting with `$$` reserved for Svelte internals
- `props_invalid_identifier`: `$props()` only with object destructuring
- `props_invalid_pattern`: `$props()` cannot contain nested properties/computed keys
- `props_invalid_placement`: `$props()` only at component top level as variable initializer
- `rune_invalid_arguments`: Rune cannot be called with arguments
- `rune_invalid_arguments_length`: Rune must be called with specific argument count
- `rune_invalid_computed_property`: Cannot access computed property of rune
- `rune_invalid_name`: Not a valid rune
- `rune_invalid_spread`: Rune cannot be called with spread argument
- `rune_invalid_usage`: Cannot use rune in non-runes mode
- `rune_missing_parentheses`: Rune requires parentheses
- `rune_removed`: Rune has been removed
- `rune_renamed`: Rune renamed to different name
- `runes_mode_invalid_import`: Cannot use in runes mode

### Reactive/State Errors
- `reactive_declaration_cycle`: Cyclical dependency detected
- `state_field_duplicate`: State field already declared on class
- `state_field_invalid_assignment`: Cannot assign to state field before declaration
- `state_invalid_export`: Cannot export reassigned state; export function or mutate properties only
- `state_invalid_placement`: `%rune%()` only as variable/class field initializer or first constructor assignment
- `constant_assignment`: Cannot assign to constant
- `constant_binding`: Cannot bind to constant

### Render/Snippet Errors
- `render_tag_invalid_call_expression`: Cannot call snippet using apply/bind/call
- `render_tag_invalid_expression`: `{@render}` only contains call expressions
- `render_tag_invalid_spread_argument`: Cannot use spread in `{@render}` tags
- `snippet_conflict`: Cannot use `<slot>` and `{@render}` in same component
- `snippet_invalid_export`: Exported snippet only references `<script module>` or other exportable snippets
- `snippet_invalid_rest_parameter`: Snippets don't support rest parameters; use array
- `snippet_parameter_assignment`: Cannot reassign/bind to snippet parameter
- `snippet_shadowing_prop`: Snippet shadows prop with same name

Example of invalid exported snippet:
```svelte
<script module>
    export { greeting };
</script>
<script>
    let message = 'hello';
</script>
{#snippet greeting(name)}
    <p>{message} {name}!</p>  <!-- error: references non-module script -->
{/snippet}
```

### Slot Errors
- `slot_attribute_duplicate`: Duplicate slot name
- `slot_attribute_invalid`: Slot attribute must be static
- `slot_attribute_invalid_placement`: Element with slot must be child of component/custom element
- `slot_default_duplicate`: Cannot have default slot content with explicit `slot="default"`
- `slot_element_invalid_attribute`: `<slot>` only receives attributes and let directives
- `slot_element_invalid_name`: Slot name must be static
- `slot_element_invalid_name_default`: `default` reserved; cannot use as slot name
- `slot_snippet_conflict`: Cannot mix `<slot>` and `{@render}` tags

### Store Errors
- `store_invalid_scoped_subscription`: Cannot subscribe to non-top-level stores
- `store_invalid_subscription`: Cannot reference store value in `<script module>`
- `store_invalid_subscription_module`: Store `$` prefix only in `.svelte` files

### Svelte Meta Errors
- `svelte_body_illegal_attribute`: `<svelte:body>` doesn't support non-event attributes/spreads
- `svelte_boundary_invalid_attribute`: Valid attributes: `onerror`, `failed`
- `svelte:boundary_invalid_attribute_value`: Attribute must be non-string expression
- `svelte_element_missing_this`: `<svelte:element>` requires `this` attribute
- `svelte_fragment_invalid_attribute`: `<svelte:fragment>` only slot attribute and let: directive
- `svelte_fragment_invalid_placement`: `<svelte:fragment>` must be direct component child
- `svelte_head_illegal_attribute`: `<svelte:head>` cannot have attributes/directives
- `svelte_meta_duplicate`: Component can only have one `<%name%>` element
- `svelte_meta_invalid_content`: `<%name%>` cannot have children
- `svelte_meta_invalid_placement`: `<%name%>` cannot be inside elements/blocks
- `svelte_meta_invalid_tag`: Invalid `<svelte:...>` tag name
- `svelte_options_deprecated_tag`: `tag` option deprecated; use `customElement` instead
- `svelte_options_invalid_attribute`: `<svelte:options>` only static attributes
- `svelte_options_invalid_attribute_value`: Attribute value must be specific values
- `svelte_options_invalid_customelement`: `customElement` must be string or object with tag/shadow/props
- `svelte_options_invalid_customelement_props`: Props must be statically analyzable object
- `svelte_options_invalid_customelement_shadow`: `shadow` must be "open" or "none"
- `svelte_options_invalid_tagname`: Tag name must be lowercase and hyphenated
- `svelte_options_reserved_tagname`: Tag name is reserved
- `svelte_options_unknown_attribute`: Unknown `<svelte:options>` attribute
- `svelte_self_invalid_placement`: `<svelte:self>` only in `{#if}`, `{#each}`, `{#snippet}` or slots

### Script Errors
- `script_duplicate`: Component can have one `<script>` and one `<script module>`
- `script_invalid_attribute_value`: Script attribute must be boolean
- `script_invalid_context`: Context attribute must be "module"
- `script_reserved_attribute`: Attribute is reserved

### Style Errors
- `style_duplicate`: Component can have single `<style>` element
- `style_directive_invalid_modifier`: `style:` only uses `important` modifier

### Transition Errors
- `transition_conflict`: Cannot use `%type%:` with existing `%existing%:` directive
- `transition_duplicate`: Cannot use multiple `%type%:` directives on element

### Other Errors
- `const_tag_cycle`: Cyclical dependency
- `dollar_binding_invalid`: `$` name reserved for variables/imports
- `dollar_prefix_invalid`: `$` prefix reserved for variables/imports
- `duplicate_class_field`: Class field already declared
- `expected_attribute_value`: Expected attribute value
- `expected_block_type`: Expected 'if', 'each', 'await', 'key' or 'snippet'
- `expected_identifier`: Expected identifier
- `expected_pattern`: Expected identifier or destructure pattern
- `expected_token`: Expected specific token
- `expected_whitespace`: Expected whitespace
- `experimental_async`: Cannot use `await` unless `experimental.async` compiler option true
- `invalid_arguments_usage`: `arguments` keyword not in template/top level
- `js_parse_error`: JavaScript parse error
- `legacy_await_invalid`: Cannot use `await` outside runes mode
- `legacy_props_invalid`: Cannot use `$$props` in runes mode
- `legacy_reactive_statement_invalid`: `$:` not allowed in runes mode; use `$derived`/`$effect`
- `legacy_rest_props_invalid`: Cannot use `$$restProps` in runes mode
- `let_directive_invalid_placement`: `let:` directive at invalid position
- `node_invalid_placement`: Element placement violates HTML restrictions; browser will repair HTML breaking Svelte assumptions
- `options_invalid_value`: Invalid compiler option
- `options_removed`: Compiler option removed
- `options_unrecognised`: Unrecognised compiler option
- `tag_invalid_name`: Invalid element/component name
- `tag_invalid_placement`: `{@%name%}` tag cannot be in this location
- `typescript_invalid_feature`: TypeScript features not natively supported; use preprocessor
- `unexpected_eof`: Unexpected end of input
- `unexpected_reserved_word`: Reserved word cannot be used here
- `unterminated_string_constant`: Unterminated string

### HTML Repair Examples
Browser HTML repair breaks Svelte assumptions:
- `<p>hello <div>world</div></p>` → `<p>hello </p><div>world</div><p></p>` (div closes p)
- `<option><div>option a</div></option>` → `<option>option a</option>` (div removed)
- `<table><tr><td>cell</td></tr></table>` → `<table><tbody><tr><td>cell</td></tr></tbody></table>` (tbody inserted)