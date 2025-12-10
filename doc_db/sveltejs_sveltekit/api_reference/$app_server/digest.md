## command

Creates a remote command that executes on the server when called from the browser via `fetch`.

```js
import { command } from '$app/server';

// No input
const cmd1 = command(() => serverSideValue);

// With validation
const cmd2 = command('unchecked', (input) => processInput(input));
const cmd3 = command(schema, (input) => processInput(input));
```

## form

Creates a form object spreadable onto `<form>` elements.

```js
import { form } from '$app/server';

const myForm = form(() => ({ success: true }));
const validatedForm = form(schema, (data, issue) => handleSubmit(data));
```

## getRequestEvent

Returns the current `RequestEvent` in server hooks, server `load` functions, actions, and endpoints. Must be called synchronously in environments without `AsyncLocalStorage`.

```js
import { getRequestEvent } from '$app/server';

const event = getRequestEvent();
```

## prerender

Creates a remote prerender function that executes on the server during build.

```js
import { prerender } from '$app/server';

const fn = prerender(() => data);
const validated = prerender(schema, (input) => data, {
  inputs: function* () { yield input1; yield input2; },
  dynamic: true
});
```

## query

Creates a remote query that executes on the server when called from the browser.

```js
import { query } from '$app/server';

const q1 = query(() => fetchData());
const q2 = query('unchecked', (input) => fetchData(input));
const q3 = query(schema, (input) => fetchData(input));
```

### query.batch

Collects multiple query calls and executes them in a single request (available since 2.35).

```js
const batchQuery = query.batch(schema, (args) => 
  (arg, idx) => processArg(arg)
);
```

## read

Reads the contents of an imported asset from the filesystem.

```js
import { read } from '$app/server';
import somefile from './somefile.txt';

const asset = read(somefile);
const text = await asset.text();
```