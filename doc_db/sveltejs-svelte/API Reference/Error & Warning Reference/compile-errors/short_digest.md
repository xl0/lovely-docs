## Compile Errors Reference

Complete list of Svelte compiler error codes organized by category:

**Animation**: `animation_duplicate`, `animation_invalid_placement`, `animation_missing_key`

**Attributes**: `attribute_contenteditable_dynamic`, `attribute_duplicate`, `attribute_empty_shorthand`, `attribute_invalid_event_handler`, `attribute_invalid_multiple`, `attribute_invalid_name`, `attribute_invalid_sequence_expression`, `attribute_invalid_type`, `attribute_unquoted_sequence`

**Bindings**: `bind_group_invalid_expression`, `bind_invalid_expression`, `bind_invalid_name`, `bind_invalid_parens`, `bind_invalid_target`, `bind_invalid_value`

**Blocks**: `block_duplicate_clause`, `block_invalid_continuation_placement`, `block_invalid_elseif`, `block_invalid_placement`, `block_unclosed`, `block_unexpected_character`, `block_unexpected_close`

**CSS**: `css_empty_declaration`, `css_global_block_invalid_list` (split `:global` and scoped selectors), `css_global_invalid_placement`, `css_selector_invalid`

**Each blocks**: `each_item_invalid_assignment` — in runes mode use array index: `array[i] = 4` instead of `entry = 4`

**Props/Exports**: `export_undefined`, `legacy_export_invalid` (use `$props()` instead of `export let`), `props_duplicate`, `props_invalid_placement`

**Runes**: `rune_invalid_arguments`, `rune_invalid_name`, `rune_invalid_usage`, `rune_missing_parentheses`, `rune_removed`, `rune_renamed`

**Slots**: `slot_attribute_duplicate`, `slot_attribute_invalid`, `slot_default_duplicate`, `slot_snippet_conflict` (cannot mix `<slot>` and `{@render}`)

**Snippets**: `snippet_invalid_export`, `snippet_parameter_assignment`, `snippet_shadowing_prop`

**State**: `state_field_duplicate`, `state_invalid_placement`, `state_invalid_export`

**Svelte meta tags**: `svelte_component_missing_this`, `svelte_element_missing_this`, `svelte_fragment_invalid_placement`, `svelte_options_invalid_customelement`

**Parsing**: `expected_identifier`, `js_parse_error`, `legacy_reactive_statement_invalid` (use `$derived`/`$effect` instead of `$:`), `mixed_event_handler_syntaxes`, `node_invalid_placement`, `typescript_invalid_feature`, `unexpected_eof`