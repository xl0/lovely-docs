The `@sveltejs/kit/node` module provides utilities for integrating SvelteKit with Node.js HTTP servers.

**createReadableStream** (available since 2.4.0)
Converts a file on disk to a readable stream.
```js
import { createReadableStream } from '@sveltejs/kit/node';
const stream = createReadableStream('./path/to/file.txt');
```

**getRequest**
Converts a Node.js `IncomingMessage` to a standard `Request` object. Accepts the incoming request, base path, and optional body size limit.
```js
import { getRequest } from '@sveltejs/kit/node';
const request = await getRequest({
  request: incomingMessage,
  base: '/app',
  bodySizeLimit: 1024 * 1024
});
```

**setResponse**
Writes a standard `Response` object to a Node.js `ServerResponse`.
```js
import { setResponse } from '@sveltejs/kit/node';
await setResponse(serverResponse, response);
```