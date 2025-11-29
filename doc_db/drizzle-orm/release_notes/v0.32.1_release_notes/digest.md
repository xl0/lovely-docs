## Bug Fixes and Improvements

**Index Typings and Multi-Column Support**
- Fixed typings for indexes
- Added support for creating indexes on 3 or more columns with mixed columns and expressions

**Limit 0 Support**
- Added support for "limit 0" across all database dialects (resolves issue #2011)

**Array Operations**
- `inArray` and `notInArray` now accept empty lists (resolves issue #1295)

**Documentation Fixes**
- Fixed typo in `lt` typedoc
- Corrected wrong example in README.md