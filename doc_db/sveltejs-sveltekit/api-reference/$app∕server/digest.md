## $app/server API Reference

Server-side utilities for SvelteKit applications.

### command
Creates a remote command that executes on the server when called from the browser via fetch.
```js
import { command } from '$app/server';
const myCommand = command(() => computeValue());
```

### form
Creates a form object for server-side form handling with optional validation.
```js
import { form } from '$app/server';
const myForm = form((data, invalid) => processFormData(data));
```

### getRequestEvent
Returns the current RequestEvent in server hooks, load functions, actions, and endpoints. Must be called synchronously in environments without AsyncLocalStorage.
```js
import { getRequestEvent } from '$app/server';
const event = getRequestEvent();
```

### prerender
Creates a remote prerender function that executes on the server. Supports optional validation and input generation for static site generation.
```js
import { prerender } from '$app/server';
const prerenderFn = prerender(() => generateStaticContent());
```

### query
Creates a remote query that fetches data from the server when called from the browser.
```js
import { query } from '$app/server';
const getData = query(() => fetchServerData());
```

#### query.batch
Collects multiple query calls and executes them in a single request (available since 2.35).
```js
const batchQuery = query.batch('unchecked', (args) => (arg, idx) => processArg(arg));
```

### read
Reads the contents of an imported asset from the filesystem.
```js
import { read } from '$app/server';
import somefile from './somefile.txt';
const asset = read(somefile);
const text = await asset.text();
```