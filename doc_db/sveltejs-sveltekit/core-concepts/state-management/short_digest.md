**Avoid shared state on server**: Don't store data in shared variables—authenticate with cookies and use databases instead.

**No side-effects in load**: Load functions must be pure; return data instead of writing to stores.

**Use context API**: Attach state to component tree with `setContext`/`getContext` instead of global state. Pass functions to maintain reactivity.

**Component state is preserved**: Components reuse on navigation; use `$derived` for reactive values or `{#key}` to force remounting.

**URL for persistent state**: Store filters/sorting in URL search parameters.

**Snapshots for ephemeral state**: Use snapshots for temporary UI state like accordion toggles.