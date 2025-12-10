## $app/state

Three read-only state objects: `page`, `navigating`, `updated`.

**navigating**: In-progress navigation with `from`, `to`, `type`, `delta` properties; `null` when idle.

**page**: Reactive object with current page data, form, state, URL, route, params, and error. Use `$derived` for reactivity; legacy `$:` won't update. Server-only during rendering; browser anytime.

**updated**: Boolean `current` property (initially `false`) that becomes `true` when new app version detected (if polling enabled). Call `check()` to force immediate check.