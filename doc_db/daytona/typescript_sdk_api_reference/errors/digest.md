## Error Hierarchy

Base error class for Daytona SDK with HTTP context support.

### DaytonaError

Base error class for all Daytona SDK errors.

**Properties:**
- `statusCode?: number` - HTTP status code if available
- `headers?: AxiosHeaders` - Response headers if available

**Constructor:**
```ts
new DaytonaError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

### DaytonaNotFoundError

Extends `DaytonaError`. Thrown for not found (404) scenarios.

**Constructor:**
```ts
new DaytonaNotFoundError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

### DaytonaRateLimitError

Extends `DaytonaError`. Thrown when rate limit is exceeded.

**Constructor:**
```ts
new DaytonaRateLimitError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

### DaytonaTimeoutError

Extends `DaytonaError`. Thrown when a timeout occurs.

**Constructor:**
```ts
new DaytonaTimeoutError(message: string, statusCode?: number, headers?: AxiosHeaders)
```

All error classes inherit `statusCode` and `headers` properties from the base `DaytonaError` class.