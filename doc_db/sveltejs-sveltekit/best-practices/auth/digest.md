## Sessions vs Tokens

**Session IDs**: Stored in database, can be immediately revoked, but require a database query per request.

**JWT**: Not checked against datastore, cannot be immediately revoked, but offer improved latency and reduced datastore load.

## Implementation in SvelteKit

Auth cookies are checked in server hooks. When a user matches provided credentials, store user information in `locals`.

## Recommended Approach

Use Lucia for session-based auth. It provides example code and projects for SvelteKit. Add it with `npx sv create` (new project) or `npx sv add lucia` (existing project).

Auth systems are tightly coupled to web frameworks since most code involves validating input, handling errors, and routing users. Use SvelteKit-specific guides like Lucia rather than generic JS libraries to avoid multiple frameworks in your project.