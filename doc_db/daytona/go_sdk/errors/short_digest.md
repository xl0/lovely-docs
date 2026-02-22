## Error Types

Base `DaytonaError` with message, status code, and headers. Specialized types: `DaytonaNotFoundError` (404), `DaytonaRateLimitError` (429), `DaytonaTimeoutError`.

## Error Conversion

`ConvertAPIError()` and `ConvertToolboxError()` convert external API errors to SDK error types.