## await_invalid

Calling `render(...)` with a component containing an `await` expression causes asynchronous work during synchronous rendering. Solutions:
- Await the result of `render`
- Wrap the `await` or component in `<svelte:boundary>` with a `pending` snippet

## html_deprecated

The `html` property of server render results is deprecated. Use `body` instead.

## lifecycle_function_unavailable

Methods like `mount` cannot be invoked in server context. Avoid calling them during render.