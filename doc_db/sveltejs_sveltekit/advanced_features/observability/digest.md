## Overview

SvelteKit can emit server-side OpenTelemetry spans (available since 2.31) for:
- `handle` hook and `handle` functions in `sequence`
- Server and universal `load` functions (when run on server)
- Form actions
- Remote functions

Requires opt-in via `svelte.config.js`:
```js
const config = {
	kit: {
		experimental: {
			tracing: { server: true },
			instrumentation: { server: true }
		}
	}
};
```

Both features are experimental and subject to change. Tracing can have nontrivial overhead—consider enabling only in development/preview.

## Augmenting Built-in Tracing

Access `root` span and `current` span via `event.tracing`:
```js
import { getRequestEvent } from '$app/server';

async function authenticate() {
	const user = await getAuthenticatedUser();
	const event = getRequestEvent();
	event.tracing.root.setAttribute('userId', user.id);
}
```

The root span is associated with the root `handle` function. The current span depends on context (handle, load, form action, or remote function).

## Development Quickstart with Jaeger

1. Enable experimental flags in `svelte.config.js`
2. Install dependencies:
   ```sh
   npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto import-in-the-middle
   ```
3. Create `src/instrumentation.server.js`:
   ```js
   import { NodeSDK } from '@opentelemetry/sdk-node';
   import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
   import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
   import { createAddHookMessageChannel } from 'import-in-the-middle';
   import { register } from 'node:module';

   const { registerOptions } = createAddHookMessageChannel();
   register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

   const sdk = new NodeSDK({
   	serviceName: 'test-sveltekit-tracing',
   	traceExporter: new OTLPTraceExporter(),
   	instrumentations: [getNodeAutoInstrumentations()]
   });

   sdk.start();
   ```

4. Run Jaeger locally and view traces at localhost:16686

## @opentelemetry/api

SvelteKit uses `@opentelemetry/api` as an optional peer dependency. If you install trace collection libraries like `@opentelemetry/sdk-node` or `@vercel/otel`, they'll satisfy this dependency. If you see a missing dependency error after setting up trace collection, install `@opentelemetry/api` manually.