## Overview
TypeScript ORM for PostgreSQL (MySQL/SQLite planned) with fully typed schemas and compile-time safety.

## Schema Definition
```ts
export class CountriesTable extends PgTable<CountriesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  nameIndex = this.uniqueIndex(this.name)
  public tableName(): string { return 'countries'; }
}
```

## Queries
```ts
const db = await drizzle.connect("postgres://...");
const users: User[] = await usersTable.select().execute();
await table.select().where(eq(table.id, 42)).execute();
await table.select().where(and([eq(table.id, 42), eq(table.name, "Dan")])).execute();
const result = await table.select({ mapped1: table.id, mapped2: table.name }).execute();
await table.select().limit(10).offset(10).orderBy((t) => t.name, Order.ASC).execute();
```

## CRUD Operations
```ts
await usersTable.insert({ name: "Andrew", createdAt: new Date() }).execute();
await usersTable.insertMany([...]).execute();
await usersTable.update().where(eq(usersTable.name, 'Dan')).set({ name: 'Mr. Dan' }).execute();
await usersTable.delete().where(eq(usersTable.name, 'Dan')).execute();
```

## Joins
```ts
const result = await citiesTable.select()
  .leftJoin(usersTable, (cities, users) => eq(cities.userId, users.id))
  .where((cities, users) => eq(cities.id, 1))
  .execute();
```

## Many-to-Many
```ts
const usersWithUserGroups = await manyToManyTable.select()
  .leftJoin(usersTable, (m, u) => eq(m.userId, u.id))
  .leftJoin(chatGroupsTable, (m, _, g) => eq(m.groupId, g.id))
  .where((m, _, g) => eq(g.id, 1))
  .execute();
```

## Migrations
CLI tool auto-generates SQL migrations from TypeScript schema with table creation, indexes, and foreign keys.