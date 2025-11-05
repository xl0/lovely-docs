## Compiler Errors Reference

Complete list of Svelte compiler error codes organized by category:

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_duplicate`, `attribute_invalid_event_handler`, `attribute_invalid_type`, `attribute_unquoted_sequence`, etc.

**Bindings**: `bind_group_invalid_expression`, `bind_invalid_expression`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_close`

**Components**: `component_invalid_directive`, `svelte_component_missing_this`

**Const Tags**: `const_tag_cycle`, `const_tag_invalid_placement`, `const_tag_invalid_reference`

Invalid const reference example:
```svelte
<svelte:boundary>
    {@const foo = 'bar'}
    {#snippet failed()}
        {foo}  <!-- error: not available -->
    {/snippet}
</svelte:boundary>
```

**CSS**: `css_empty_declaration`, `css_global_block_invalid_list`, `css_global_invalid_placement`, etc.

Invalid CSS:
```css
:global, x { y { color: red; } }  <!-- error: mixing global/scoped -->
```

**Each Blocks**: `each_item_invalid_assignment`, `each_key_without_as`

Runes mode requires array/index instead of reassigning entry:
```svelte
{#each array as entry, i}
    <button onclick={() => array[i] = 4}>change</button>
{/each}
```

**Props/Runes**: `props_duplicate`, `props_invalid_placement`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_renamed`

**Snippets**: `snippet_invalid_export`, `snippet_parameter_assignment`, `snippet_shadowing_prop`

Invalid exported snippet:
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

**Slots**: `slot_attribute_invalid`, `slot_default_duplicate`, `slot_element_invalid_name_default`

**Stores**: `store_invalid_subscription`, `store_invalid_subscription_module`

**Svelte Meta**: `svelte_boundary_invalid_attribute`, `svelte_element_missing_this`, `svelte_options_invalid_customelement`, `svelte_self_invalid_placement`

**Transitions**: `transition_conflict`, `transition_duplicate`

**Other**: `dollar_binding_invalid`, `expected_identifier`, `experimental_async`, `legacy_await_invalid`, `legacy_export_invalid`, `legacy_reactive_statement_invalid`, `node_invalid_placement`, `typescript_invalid_feature`, `unexpected_eof`