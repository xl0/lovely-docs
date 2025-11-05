The `{@debug ...}` tag logs variable values whenever they change and pauses execution if devtools are open, serving as an alternative to `console.log()`.

**Usage:**
- Accept comma-separated variable names (not expressions):
  ```svelte
  {@debug user}
  {@debug user1, user2, user3}
  ```
- Invalid: `{@debug user.firstname}`, `{@debug myArray[0]}`, `{@debug !isReady}`, `{@debug typeof user === 'object'}`
- Without arguments, `{@debug}` inserts a `debugger` statement triggered on any state change