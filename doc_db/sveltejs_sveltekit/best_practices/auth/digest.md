## Authentication vs Authorization

Authentication verifies user identity based on credentials. Authorization determines which actions users are allowed to take.

## Sessions vs Tokens

After credential verification, users need to be authenticated on subsequent requests using either:

**Session IDs**: Stored in database, can be immediately revoked, but require a database query per request.

**JWT (JSON Web Tokens)**: Not checked against datastore, cannot be immediately revoked, but offer improved latency and reduced datastore load.

## Implementation in SvelteKit

Auth cookies can be checked inside server hooks. When a user matches provided credentials, store user information in `locals` (available in server hooks).

## Recommended Approach

Use Lucia for session-based auth. It provides example code and projects for SvelteKit integration. Add it with `npx sv create` (new project) or `npx sv add lucia` (existing project).

Auth systems are tightly coupled to web frameworks because most code involves validating user input, handling errors, and directing users appropriately. Generic JS auth libraries often include multiple web frameworks, so SvelteKit-specific guides like Lucia are preferable to avoid framework bloat in your project.