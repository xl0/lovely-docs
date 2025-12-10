## Remote Functions

**command**: Server-side function callable from browser via fetch
```js
const cmd = command(schema, (input) => result);
```

**query**: Server-side data fetcher callable from browser
```js
const q = query(schema, (input) => data);
const batch = query.batch(schema, (args) => (arg, idx) => result);
```

**form**: Form handler with validation
```js
const f = form(schema, (data, issue) => handleSubmit(data));
```

**prerender**: Server function for build-time execution with input generation
```js
const p = prerender(schema, (input) => data, { inputs: generator, dynamic: true });
```

## Utilities

**getRequestEvent**: Access current RequestEvent in server context (must call synchronously)

**read**: Read imported asset contents from filesystem
```js
const text = await read(asset).text();
```