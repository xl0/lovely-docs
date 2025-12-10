# NeverThrow API

**Result<T, E>** - Synchronous error handling
- Construction: `ok(value)`, `err(error)`
- Inspection: `isOk()`, `isErr()`
- Transform: `map()`, `mapErr()`, `andThen()`, `orElse()`, `unwrapOr()`, `match()`
- Async: `asyncMap()`, `asyncAndThen()`
- Side effects: `andTee()`, `orTee()`, `andThrough()`, `asyncAndThrough()`
- Static: `fromThrowable()`, `combine()`, `combineWithAllErrors()`
- Testing: `_unsafeUnwrap()`, `_unsafeUnwrapErr()`

**ResultAsync<T, E>** - Asynchronous error handling
- Construction: `okAsync(value)`, `errAsync(error)`
- Promise conversion: `fromThrowable()`, `fromPromise()`, `fromSafePromise()`
- Transform: `map()`, `mapErr()`, `andThen()`, `orElse()`, `unwrapOr()`, `match()`
- Side effects: `andTee()`, `orTee()`, `andThrough()`
- Static: `combine()`, `combineWithAllErrors()`

**Utilities**
- `safeTry()` - Generator-based implicit error propagation
- `fromThrowable`, `fromAsyncThrowable`, `fromPromise`, `fromSafePromise` - Top-level exports

**ESLint Plugin** - `eslint-plugin-neverthrow` enforces Result consumption