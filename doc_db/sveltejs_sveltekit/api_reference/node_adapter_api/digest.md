## createReadableStream

Converts a file on disk to a readable stream.

```js
import { createReadableStream } from '@sveltejs/kit/node';

const stream = createReadableStream('/path/to/file');
```

Available since 2.4.0.

## getRequest

Converts a Node.js `IncomingMessage` to a Fetch API `Request` object.

```js
import { getRequest } from '@sveltejs/kit/node';

const request = await getRequest({
  request: incomingMessage,
  base: '/app',
  bodySizeLimit: 1024 * 1024 // optional, in bytes
});
```

Parameters:
- `request`: Node.js `http.IncomingMessage`
- `base`: Base path for the application
- `bodySizeLimit`: Optional maximum request body size in bytes

## setResponse

Writes a Fetch API `Response` object to a Node.js `ServerResponse`.

```js
import { setResponse } from '@sveltejs/kit/node';

await setResponse(serverResponse, fetchResponse);
```

Parameters:
- `res`: Node.js `http.ServerResponse`
- `response`: Fetch API `Response` object