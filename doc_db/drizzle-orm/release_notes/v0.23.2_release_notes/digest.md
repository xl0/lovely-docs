## Bug Fixes

**PostgreSQL schemaFilter Bug**: Fixed an issue where the `schemaFilter` object in push and introspect operations was not being respected. The tool was incorrectly detecting enums in schemas that were not included in the schemaFilter configuration.

**drizzle-kit up Command**: Fixed the `drizzle-kit up` command to function correctly starting from the sequences release.