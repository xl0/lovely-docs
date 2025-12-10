## Sessions vs Tokens

**Sessions**: Database-stored, immediately revocable, requires per-request DB query.

**JWT**: Not checked against datastore, cannot be revoked, better latency/performance.

## SvelteKit Implementation

Check auth cookies in server hooks, store user info in `locals`. Use Lucia for session-based auth (`npx sv add lucia`).