## Runes

`$`-prefixed compiler keywords for reactivity:

- **$state**: Creates reactive variables; arrays/objects become deeply reactive proxies
- **$derived**: Computed state that auto-updates on dependency changes
- **$effect**: Side-effect functions that track dependencies and re-run on changes; supports teardown functions
- **$props**: Receives component inputs with destructuring and defaults
- **$bindable**: Enables two-way data binding on props
- **$inspect**: Development-only reactive logging and tracing
- **$host**: Accesses host element in custom element components