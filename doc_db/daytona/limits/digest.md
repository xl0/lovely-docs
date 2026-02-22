## Resources

Resources are shared across all running sandboxes. Organizations are placed into tiers based on verification status with access to a compute pool of CPU cores, RAM, and disk space. Limits apply to the organization's default region.

| Tier | vCPU / RAM / Storage | Requirements |
|------|----------------------|--------------|
| Tier 1 | 10 / 10GiB / 30GiB | Email verified |
| Tier 2 | 100 / 200GiB / 300GiB | Credit card + $25 top-up + GitHub connected |
| Tier 3 | 250 / 500GiB / 2000GiB | Business email + $500 top-up |
| Tier 4 | 500 / 1000GiB / 5000GiB | $2000 top-up every 30 days |
| Custom | Custom | Contact support@daytona.io |

Upgrade tiers in the Daytona Dashboard.

### Resource usage by sandbox state

| State | vCPU | Memory | Storage | Notes |
|-------|------|--------|---------|-------|
| Running | ✅ | ✅ | ✅ | Counts against all limits |
| Stopped | ❌ | ❌ | ✅ | Frees CPU & memory, storage still used |
| Archived | ❌ | ❌ | ❌ | Data in cold storage, no quota impact |
| Deleted | ❌ | ❌ | ❌ | All resources freed |

## Rate limits

Rate limits control API requests per time window, applied per tier and authentication status. Tracked per organization for authenticated requests.

| Tier | General Requests/min | Sandbox Creation/min | Sandbox Lifecycle/min |
|------|---------------------|----------------------|----------------------|
| Tier 1 | 10,000 | 300 | 10,000 |
| Tier 2 | 20,000 | 400 | 20,000 |
| Tier 3 | 40,000 | 500 | 40,000 |
| Tier 4 | 50,000 | 600 | 50,000 |
| Custom | Custom | Custom | Custom |

**General requests** include: listing sandboxes, getting sandbox details, retrieving regions, listing snapshots, managing volumes, viewing audit logs, and other read/management operations.

**Sandbox creation** applies to all creation methods: from snapshots, declarative builds, `daytona.create()` SDK calls, and POST `/api/sandbox` requests.

**Sandbox lifecycle operations** apply to: starting, stopping, deleting, archiving sandboxes, and corresponding SDK methods.

### Rate limit responses

Exceeding limits returns:
- HTTP Status: `429 Too Many Requests`
- JSON body with rate limit details
- `Retry-After` header with seconds to wait

### Rate limit headers

All responses include rate limit headers with suffix based on throttler type (`-anonymous`, `-authenticated`, `-sandbox-create`, `-sandbox-lifecycle`):

| Header | Description |
|--------|-------------|
| `X-RateLimit-Limit-{throttler}` | Max requests in time window |
| `X-RateLimit-Remaining-{throttler}` | Requests remaining in current window |
| `X-RateLimit-Reset-{throttler}` | Seconds until window resets |
| `Retry-After-{throttler}` | Seconds to wait before retry (when exceeded) |

### Error handling

Python and TypeScript SDKs raise `DaytonaRateLimitError` with `headers` and `statusCode` properties. Headers support case-insensitive access.

```typescript
try {
  await daytona.create({ snapshot: 'my-snapshot' })
} catch (error) {
  if (error instanceof DaytonaRateLimitError) {
    console.log(error.headers?.get('x-ratelimit-remaining-sandbox-create'))
    console.log(error.headers?.get('X-RateLimit-Remaining-Sandbox-Create')) // case-insensitive
  }
}
```

```python
try:
  daytona.create(snapshot="my-snapshot")
except DaytonaRateLimitError as e:
  print(e.headers['x-ratelimit-remaining-sandbox-create'])
  print(e.headers['X-RateLimit-Remaining-Sandbox-Create'])  # case-insensitive
```

Error response format:
```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "error": "Too Many Requests"
}
```

## Best practices

**Handle 429 errors gracefully** with exponential backoff retry logic:

```typescript
async function createSandboxWithRetry() {
  let retries = 0
  const maxRetries = 5

  while (retries < maxRetries) {
    try {
      return await daytona.create({ snapshot: 'my-snapshot' })
    } catch (error) {
      if (error instanceof DaytonaRateLimitError && retries < maxRetries - 1) {
        const retryAfter = error.headers?.get('retry-after-sandbox-create')
        const delay = retryAfter
          ? parseInt(retryAfter) * 1000
          : Math.pow(2, retries) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        retries++
      } else {
        throw error
      }
    }
  }
}
```

**Monitor rate limit headers** to track consumption and implement proactive throttling before hitting limits.

**Cache API responses** that don't frequently change: sandbox lists, available regions, snapshot information.

**Batch and optimize operations** by creating multiple sandboxes in parallel (within limits) rather than sequentially. Reuse existing sandboxes when possible.

**Manage sandbox lifecycle efficiently**: archive instead of delete/recreate, stop when not in use, use auto-stop intervals for automatic management.

**Implement request queuing** to prevent bursts exceeding limits. Use webhooks instead of polling for state changes. Monitor and alert on 429 errors.