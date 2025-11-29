## Custom Migrations

Drizzle Kit allows you to generate empty migration files for writing custom SQL migrations. This is useful for DDL alterations not yet supported by Drizzle Kit or for data seeding operations.

### Generating Custom Migrations

Use the `drizzle-kit generate` command with the `--custom` flag:

```shell
drizzle-kit generate --custom --name=seed-users
```

This creates a new migration file in your drizzle directory with a sequential number prefix. For example, running the above command creates `0001_seed-users.sql` in the `drizzle/` folder.

### Example: Data Seeding

```sql
-- ./drizzle/0001_seed-users.sql

INSERT INTO "users" ("name") VALUES('Dan');
INSERT INTO "users" ("name") VALUES('Andrew');
INSERT INTO "users" ("name") VALUES('Dandrew');
```

Custom migration files are executed using the `drizzle-kit migrate` command, which runs all pending migrations in sequence.

### JavaScript and TypeScript Migrations

Support for running custom JavaScript and TypeScript migration/seeding scripts is planned for an upcoming release. Track the feature request on the GitHub discussions page.