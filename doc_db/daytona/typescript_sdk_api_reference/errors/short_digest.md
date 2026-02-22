## Error Classes

**DaytonaError** - Base error with `statusCode?: number` and `headers?: AxiosHeaders` properties.

**Specialized errors extending DaytonaError:**
- `DaytonaNotFoundError` - 404 scenarios
- `DaytonaRateLimitError` - Rate limit exceeded
- `DaytonaTimeoutError` - Timeout occurred

All constructors: `new ErrorClass(message: string, statusCode?: number, headers?: AxiosHeaders)`