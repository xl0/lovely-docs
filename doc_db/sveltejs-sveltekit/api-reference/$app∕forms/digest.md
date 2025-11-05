## applyAction

Updates the `form` property of the current page with given data and updates `page.status`. Redirects to the nearest error page on error.

```js
import { applyAction } from '$app/forms';
await applyAction(result);
```

## deserialize

Deserializes the response from a form submission.

```js
import { deserialize } from '$app/forms';

const response = await fetch('/form?/action', {
  method: 'POST',
  body: new FormData(event.target)
});
const result = deserialize(await response.text());
```

## enhance

Enhances a `<form>` element to work without JavaScript by intercepting submission. The `submit` callback receives FormData and the action, and can call `cancel()` to prevent submission or use an `abort` controller to cancel ongoing submissions.

Returns a callback function that is invoked with the server response. If no callback is provided or nothing is returned, the default behavior applies:
- Updates `form` prop with returned data if action is on same page
- Updates `page.status`
- Resets form and invalidates all data on successful submission without redirect
- Redirects on redirect response
- Redirects to error page on unexpected error

Custom callbacks can invoke `update()` to use default behavior with options:
- `reset: false` - don't reset form values after successful submission
- `invalidateAll: false` - don't call `invalidateAll` after submission

```js
import { enhance } from '$app/forms';

<form use:enhance={(submit) => {
  return async (response) => {
    // custom handling
    await update({ reset: false });
  };
}}>
```