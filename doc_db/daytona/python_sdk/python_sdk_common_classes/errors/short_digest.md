## Exception Hierarchy

**DaytonaError** - Base exception with `message`, `status_code`, and `headers` attributes

Specialized exceptions:
- **DaytonaNotFoundError** - Resource not found
- **DaytonaRateLimitError** - Rate limit exceeded
- **DaytonaTimeoutError** - Operation timeout