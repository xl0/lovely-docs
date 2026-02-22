## Error Types

The SDK provides specialized error types for different failure scenarios:

### DaytonaError
Base error type for all SDK errors. Contains message, HTTP status code, and response headers.

```go
type DaytonaError struct {
    Message    string
    StatusCode int
    Headers    http.Header
}

func NewDaytonaError(message string, statusCode int, headers http.Header) *DaytonaError
func (e *DaytonaError) Error() string
```

### DaytonaNotFoundError
Represents 404 resource not found errors. Embeds DaytonaError.

```go
type DaytonaNotFoundError struct {
    *DaytonaError
}

func NewDaytonaNotFoundError(message string, headers http.Header) *DaytonaNotFoundError
func (e *DaytonaNotFoundError) Error() string
```

### DaytonaRateLimitError
Represents 429 rate limit errors. Embeds DaytonaError.

```go
type DaytonaRateLimitError struct {
    *DaytonaError
}

func NewDaytonaRateLimitError(message string, headers http.Header) *DaytonaRateLimitError
func (e *DaytonaRateLimitError) Error() string
```

### DaytonaTimeoutError
Represents timeout errors. Embeds DaytonaError.

```go
type DaytonaTimeoutError struct {
    *DaytonaError
}

func NewDaytonaTimeoutError(message string) *DaytonaTimeoutError
func (e *DaytonaTimeoutError) Error() string
```

## Error Conversion

Two functions convert external API errors to SDK error types:

- `ConvertAPIError(err error, httpResp *http.Response) error` - Converts api-client-go errors
- `ConvertToolboxError(err error, httpResp *http.Response) error` - Converts toolbox-api-client-go errors