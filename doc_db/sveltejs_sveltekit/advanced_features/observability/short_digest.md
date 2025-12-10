## Observability with OpenTelemetry

Enable server-side tracing in `svelte.config.js`:
```js
kit: {
	experimental: {
		tracing: { server: true },
		instrumentation: { server: true }
	}
}
```

Traces are emitted for `handle` hooks, `load` functions, form actions, and remote functions.

Augment spans via `event.tracing.root` and `event.tracing.current`:
```js
const event = getRequestEvent();
event.tracing.root.setAttribute('userId', user.id);
```

Quick setup with Jaeger: install `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/exporter-trace-otlp-proto`, and `import-in-the-middle`, then create `src/instrumentation.server.js` with NodeSDK configuration. View traces at localhost:16686.