## $inspect

Development-only rune that logs values whenever they change, tracking deep reactivity. Use `$inspect(value)` to log, or `$inspect(value).with(callback)` to use a custom callback receiving `"init"` or `"update"` type.

`$inspect.trace()` (v5.14+) traces which reactive state caused an effect/derived to re-run; must be first statement in function body.