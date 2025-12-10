# NeverThrow API Reference

## Overview
NeverThrow provides `Result<T, E>` and `ResultAsync<T, E>` types to encode failure into programs, replacing throw/catch patterns with explicit error handling.

## Synchronous API (Result)

### Construction
- `ok<T, E>(value: T): Ok<T, E>` - Create success variant
- `err<T, E>(error: E): Err<T, E>` - Create error variant

### Inspection
- `isOk(): boolean` - Check if Ok variant
- `isErr(): boolean` - Check if Err variant

### Transformation
- `map<U>(callback: (value: T) => U): Result<U, E>` - Transform Ok value, pass through Err
  ```typescript
  ok(2).map(x => x * 2) // Ok(4)
  err('fail').map(x => x * 2) // Err('fail')
  ```

- `mapErr<F>(callback: (error: E) => F): Result<T, F>` - Transform Err value, pass through Ok
  ```typescript
  err('fail').mapErr(e => `Error: ${e}`) // Err('Error: fail')
  ok(5).mapErr(e => `Error: ${e}`) // Ok(5)
  ```

- `andThen<U, F>(callback: (value: T) => Result<U, F>): Result<U, E | F>` - Chain Results, flatten nested Results
  ```typescript
  const sq = (n: number): Result<number, number> => ok(n ** 2)
  ok(2).andThen(sq).andThen(sq) // Ok(16)
  ok(2).andThen(sq).andThen(err) // Err(4)
  ok(ok(1234)).andThen(r => r) // Ok(1234)
  ```

- `asyncAndThen<U, F>(callback: (value: T) => ResultAsync<U, F>): ResultAsync<U, E | F>` - Chain with async Results

- `orElse<U, A>(callback: (error: E) => Result<U, A>): Result<U | T, A>` - Error recovery
  ```typescript
  err(DatabaseError.NotFound).orElse(e => 
    e === DatabaseError.NotFound ? ok('User does not exist') : err(500)
  )
  ```

- `unwrapOr<T>(value: T): T` - Extract Ok or return default
  ```typescript
  err('fail').map(x => x * 2).unwrapOr(10) // 10
  ```

- `match<A, B = A>(okCallback: (value: T) => A, errorCallback: (error: E) => B): A | B` - Pattern match both variants
  ```typescript
  result.match(
    (str) => str.toUpperCase(),
    (err) => `Error: ${err}`
  )
  ```

- `asyncMap<U>(callback: (value: T) => Promise<U>): ResultAsync<U, E>` - Map with async function
  ```typescript
  parseHeaders(raw).map(h => h.Authorization).asyncMap(findUserInDatabase)
  ```

### Side Effects
- `andTee(callback: (value: T) => unknown): Result<T, E>` - Execute side effect on Ok, pass through unchanged
  ```typescript
  parseUserInput(input).andTee(logUser).asyncAndThen(insertUser)
  // LogError doesn't appear in result type
  ```

- `orTee(callback: (error: E) => unknown): Result<T, E>` - Execute side effect on Err, pass through unchanged
  ```typescript
  parseUserInput(input).orTee(logParseError).asyncAndThen(insertUser)
  ```

- `andThrough<F>(callback: (value: T) => Result<unknown, F>): Result<T, E | F>` - Like andTee but propagate errors
  ```typescript
  parseUserInput(input).andThrough(validateUser).asyncAndThen(insertUser)
  // ValidateError appears in result type
  ```

- `asyncAndThrough<F>(callback: (value: T) => ResultAsync<unknown, F>): ResultAsync<T, E | F>` - Async version

### Static Methods
- `Result.fromThrowable(fn: () => T, errorFn?: () => E): () => Result<T, E>` - Wrap throwable function
  ```typescript
  const safeJsonParse = Result.fromThrowable(JSON.parse, () => ({ message: "Parse Error" }))
  safeJsonParse("{") // Err({ message: "Parse Error" })
  ```

- `Result.combine<T, E>(resultList: Result<T, E>[]): Result<T[], E>` - Combine list of Results (short-circuits on first Err)
  ```typescript
  Result.combine([ok(1), ok(2)]) // Ok([1, 2])
  Result.combine([ok(1), err('fail'), ok(2)]) // Err('fail')
  ```

- `Result.combineWithAllErrors<T, E>(resultList: Result<T, E>[]): Result<T[], E[]>` - Combine all Results, collect all errors
  ```typescript
  Result.combineWithAllErrors([ok(123), err('boom'), ok(456), err('ahh')])
  // Err(['boom', 'ahh'])
  ```

### Testing
- `_unsafeUnwrap(): T` - Extract Ok value or throw (test only)
  ```typescript
  expect(myResult._unsafeUnwrap()).toBe(someExpectation)
  ```

- `_unsafeUnwrapErr(): E` - Extract Err value or throw (test only)
  ```typescript
  expect(myResult._unsafeUnwrapErr()).toBe(someError)
  _unsafeUnwrapErr({ withStackTrace: true }) // Include stack trace
  ```

## Asynchronous API (ResultAsync)

### Construction
- `okAsync<T, E>(value: T): ResultAsync<T, E>` - Create async success
- `errAsync<T, E>(error: E): ResultAsync<T, E>` - Create async error

### Promise Conversion
- `ResultAsync.fromThrowable(fn: (...args) => Promise<T>, errorFn: () => E): (...args) => ResultAsync<T, E>` - Wrap async throwable function
  ```typescript
  const insertUser = ResultAsync.fromThrowable(insertIntoDb, () => new Error('Database error'))
  ```

- `ResultAsync.fromPromise<T, E>(promise: PromiseLike<T>, errorHandler: (unknown) => E): ResultAsync<T, E>` - Convert Promise to ResultAsync
  ```typescript
  ResultAsync.fromPromise(insertIntoDb(myUser), () => new Error('Database error'))
  ```

- `ResultAsync.fromSafePromise<T, E>(promise: PromiseLike<T>): ResultAsync<T, E>` - Convert Promise that won't reject
  ```typescript
  ResultAsync.fromSafePromise(new Promise(resolve => setTimeout(() => resolve(value), ms)))
  ```

### Transformation
- `map<U>(callback: (value: T) => U | Promise<U>): ResultAsync<U, E>` - Transform Ok value (sync or async)
  ```typescript
  findUsersIn("Canada").map(users => users.map(u => u.name))
  ```

- `mapErr<F>(callback: (error: E) => F | Promise<F>): ResultAsync<T, F>` - Transform Err value (sync or async)
  ```typescript
  findUsersIn("Canada").mapErr(e => 
    e.message === "Unknown country" ? e.message : "System error"
  )
  ```

- `andThen<U, F>(callback: (value: T) => Result<U, F> | ResultAsync<U, F>): ResultAsync<U, E | F>` - Chain Results/ResultAsync
  ```typescript
  validateUser(user).andThen(insertUser).andThen(sendNotification)
  ```

- `orElse<U, A>(callback: (error: E) => Result<U, A> | ResultAsync<U, A>): ResultAsync<U | T, A>` - Error recovery

- `unwrapOr<T>(value: T): Promise<T>` - Extract Ok or return default
  ```typescript
  await errAsync(0).unwrapOr(10) // 10
  ```

- `match<A, B = A>(okCallback: (value: T) => A, errorCallback: (error: E) => B): Promise<A | B>` - Pattern match both variants
  ```typescript
  await validateUser(user).andThen(insertUser).match(
    (user) => `User ${user.name} created`,
    (error) => `User creation failed: ${error.message}`
  )
  ```

### Side Effects
- `andTee(callback: (value: T) => unknown): ResultAsync<T, E>` - Execute side effect on Ok, pass through
  ```typescript
  insertUser(user).andTee(logUser).andThen(sendNotification)
  ```

- `orTee(callback: (error: E) => unknown): ResultAsync<T, E>` - Execute side effect on Err, pass through
  ```typescript
  insertUser(user).orTee(logInsertError).andThen(sendNotification)
  ```

- `andThrough<F>(callback: (value: T) => Result<unknown, F> | ResultAsync<unknown, F>): ResultAsync<T, E | F>` - Like andTee but propagate errors
  ```typescript
  buildUser(userRaw).andThrough(insertUser).andThen(sendNotification)
  ```

### Static Methods
- `ResultAsync.combine<T, E>(resultList: ResultAsync<T, E>[]): ResultAsync<T[], E>` - Combine list of ResultAsync (short-circuits on first Err)
  ```typescript
  ResultAsync.combine([okAsync(1), okAsync(2)])
  ```

- `ResultAsync.combineWithAllErrors<T, E>(resultList: ResultAsync<T, E>[]): ResultAsync<T[], E[]>` - Combine all ResultAsync, collect all errors
  ```typescript
  ResultAsync.combineWithAllErrors([okAsync(123), errAsync('boom'), okAsync(456), errAsync('ahh')])
  // Err(['boom', 'ahh'])
  ```

## Utility Functions

- `fromThrowable` - Top-level export of `Result.fromThrowable`
- `fromAsyncThrowable` - Top-level export of `ResultAsync.fromThrowable`
- `fromPromise` - Top-level export of `ResultAsync.fromPromise`
- `fromSafePromise` - Top-level export of `ResultAsync.fromSafePromise`

- `safeTry<T, E>(generatorFn: () => Generator<Result<any, E>, Result<T, E>>): Result<T, E>` - Implicit error propagation using generators
  ```typescript
  function myFunc(): Result<number, string> {
    return safeTry(function*() {
      return ok(
        (yield* mayFail1().mapErr(e => `error from 1: ${e}`)) +
        (yield* mayFail2().mapErr(e => `error from 2: ${e}`))
      )
    })
  }
  ```
  Also supports async generators for async Results/ResultAsync.

## ESLint Plugin

`eslint-plugin-neverthrow` enforces that Results are consumed via `.match()`, `.unwrapOr()`, or `._unsafeUnwrap()`, preventing unhandled errors (similar to Rust's `must-use` attribute).

## Top-Level Exports
```typescript
import {
  ok, Ok, err, Err, Result,
  okAsync, errAsync, ResultAsync,
  fromAsyncThrowable, fromThrowable, fromPromise, fromSafePromise, safeTry
} from 'neverthrow'
```