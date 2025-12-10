**$state**: Reactive state; objects/arrays become deep proxies; `$state.raw` for non-mutating, `$state.snapshot` for static snapshots; pass-by-value semantics.

**$derived**: Computed reactive values auto-updating on dependency changes; `$derived.by()` for complex logic; can temporarily reassign for optimistic UI; push-pull reactivity with referential equality optimization.

**$effect**: Side effects on state changes with auto-dependency tracking; teardown functions; `$effect.pre` (pre-DOM), `$effect.tracking()` (context check), `$effect.root` (manual scope); avoid for state sync ($derived) or linking values.

**$props**: Component inputs via destructuring with defaults, renaming, rest capture; `$props.id()` for unique instance IDs; type annotations supported.

**$bindable**: Bidirectional prop binding; child marks prop with `$bindable()`, parent uses `bind:` directive; allows child mutation of state proxies.

**$inspect**: Dev-only logging on reactive changes; `.with()` customizes logging; `.trace()` shows what state triggered effects.

**$host**: Access host element in custom element components for dispatching custom events.