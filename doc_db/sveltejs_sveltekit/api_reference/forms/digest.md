## applyAction

Updates the `form` property of the current page with given data and updates `page.status`. Redirects to the nearest error page on error.

```ts
function applyAction<Success, Failure>(
  result: ActionResult<Success, Failure>
): Promise<void>;
```

## deserialize

Deserializes the response from a form submission.

```js
import { deserialize } from '$app/forms';

async function handleSubmit(event) {
  const response = await fetch('/form?/action', {
    method: 'POST',
    body: new FormData(event.target)
  });
  const result = deserialize(await response.text());
}
```

```ts
function deserialize<Success, Failure>(
  result: string
): ActionResult<Success, Failure>;
```

## enhance

Enhances a `<form>` element to work without JavaScript fallback.

The `submit` function is called on submission with FormData and the action to trigger. Call `cancel` to prevent submission. Use the abort `controller` to cancel if another submission starts. If a function is returned, it's called with the server response.

Default behavior (if no custom function or if `update` is called):
- Updates `form` prop with returned data if action is on same page
- Updates `page.status`
- Resets form and invalidates all data on successful submission without redirect
- Redirects on redirect response
- Redirects to error page on unexpected error

Custom callback options:
- `reset: false` - don't reset form values after successful submission
- `invalidateAll: false` - don't call `invalidateAll` after submission

```ts
function enhance<Success, Failure>(
  form_element: HTMLFormElement,
  submit?: SubmitFunction<Success, Failure>
): {
  destroy(): void;
};
```