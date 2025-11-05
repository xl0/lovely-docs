**Sessions vs Tokens**: Session IDs require DB queries but can be revoked immediately; JWTs offer better latency but cannot be revoked.

**SvelteKit Integration**: Check auth cookies in server hooks, store user info in `locals`.

**Lucia**: Recommended session-based auth library with SvelteKit examples. Add via `npx sv add lucia`.