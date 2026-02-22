## DaytonaError

Base exception class for SDK errors.

```python
class DaytonaError(Exception):
    def __init__(message: str,
                 status_code: int | None = None,
                 headers: Mapping[str, Any] | None = None)
```

**Attributes**:
- `message` - Error message string
- `status_code` - HTTP status code if available
- `headers` - Response headers dictionary

## DaytonaNotFoundError

Raised when a resource is not found.

```python
class DaytonaNotFoundError(DaytonaError)
```

## DaytonaRateLimitError

Raised when rate limit is exceeded.

```python
class DaytonaRateLimitError(DaytonaError)
```

## DaytonaTimeoutError

Raised when a timeout occurs.

```python
class DaytonaTimeoutError(DaytonaError)
```