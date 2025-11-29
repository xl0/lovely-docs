## v0.28.2 Release (2023-08-10)

### Internal Features and Changes
- Added comprehensive test suite for D1 database
- Fixed issues in internal documentation

### Bug Fixes
- Resolved MySQL timestamp milliseconds truncation issue
- Corrected `.get()` method type signature for sqlite-based dialects (issue #565)
- Fixed sqlite-proxy bug causing queries to execute twice

### New Packages
- Added Typebox support via new drizzle-typebox package for schema validation integration