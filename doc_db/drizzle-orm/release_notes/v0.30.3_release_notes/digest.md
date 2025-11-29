## New Features

- Added raw query support (`db.execute(...)`) to batch API in Neon HTTP driver, enabling batch execution of raw SQL queries alongside prepared statements

## Fixes

- Fixed `@neondatabase/serverless` HTTP driver types issue (GitHub issues #1945 and neondatabase/serverless#66)
- Fixed sqlite-proxy driver `.run()` result to return correct response format