## Node Adapter Utilities

Three functions for integrating SvelteKit with Node.js HTTP servers:

- **createReadableStream(file)** — Convert file to readable stream (v2.4.0+)
- **getRequest({request, base, bodySizeLimit?})** — Convert Node.js `IncomingMessage` to Fetch `Request`
- **setResponse(res, response)** — Write Fetch `Response` to Node.js `ServerResponse`