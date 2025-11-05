## Observability with OpenTelemetry

Enable in `svelte.config.js`:
```js
kit: {
	experimental: {
		tracing: { server: true },
		instrumentation: { server: true }
	}
}
```

Create `src/instrumentation.server.ts` for tracing setup.

Add custom attributes to spans:
```js
event.tracing.root.setAttribute('userId', user.id);
```

For local development with Jaeger, install dependencies and create `src/instrumentation.server.js` with NodeSDK configuration. View traces at localhost:16686.