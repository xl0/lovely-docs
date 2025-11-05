**await_invalid**: Don't use `await` in components passed to `render()`. Either await `render()` itself or wrap with `<svelte:boundary pending>`.

**html_deprecated**: Use `body` instead of `html` property in server render results.

**lifecycle_function_unavailable**: Methods like `mount` are unavailable on the server—don't call them during render.