## Observability with OpenTelemetry

SvelteKit can emit server-side OpenTelemetry spans for:
- `handle` hooks and functions in `sequence`
- Server and universal `load` functions
- Form actions
- Remote functions

### Setup

Enable experimental features in `svelte.config.js`:
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

Create `src/instrumentation.server.ts` for tracing setup. This file runs before application code is imported.

### Augmenting Spans

Access root and current spans via `event.tracing` to add custom attributes:
```js
import { getRequestEvent } from '$app/server';

const event = getRequestEvent();
event.tracing.root.setAttribute('userId', user.id);
```

### Local Development

Install dependencies:
```sh
npm i @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-trace-otlp-proto import-in-the-middle
```

Create `src/instrumentation.server.js`:
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

View traces in Jaeger at localhost:16686.

### Dependencies

SvelteKit uses `@opentelemetry/api` as an optional peer dependency. It's typically installed automatically when setting up trace collection, but can be installed manually if needed.