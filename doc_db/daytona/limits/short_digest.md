## Resources

Tier-based resource limits (vCPU/RAM/Storage): Tier 1 (10/10GiB/30GiB, email verified) → Tier 4 (500/1000GiB/5000GiB, $2000/30 days). Sandbox states: Running counts all resources; Stopped frees CPU/memory; Archived/Deleted free all.

## Rate limits

Per-tier API request limits: General requests (10k-50k/min), Sandbox creation (300-600/min), Lifecycle ops (10k-50k/min). Exceed limit → 429 with `Retry-After` header. SDKs raise `DaytonaRateLimitError` with accessible headers.

## Best practices

Implement exponential backoff retry logic using `Retry-After` header. Monitor `X-RateLimit-Remaining-*` headers for proactive throttling. Cache static responses, batch operations, reuse sandboxes, use webhooks instead of polling.