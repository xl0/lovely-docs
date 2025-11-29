## Overview
DrizzleORM is an open-source TypeScript ORM supporting PostgreSQL with MySQL and SQLite support planned. It provides fully typed SQL schemas in-code for type safety and developer experience benefits.

## Schema Definition
Define tables as classes extending `PgTable` with typed columns. Supports enums, indexes, and foreign keys:
```ts
export const popularityEnum = createEnum({ alias: 'popularity', values: ['unknown', 'known', 'popular'] });

export class CountriesTable extends PgTable<CountriesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  nameIndex = this.uniqueIndex(this.name)
  public tableName(): string { return 'countries'; }
}

export class CitiesTable extends PgTable<CitiesTable> {
  id = this.serial("id").primaryKey();
  name = this.varchar("name", { size: 256 })
  countryId = this.int("country_id").foreignKey(CountriesTable, (country) => country.id)
  popularity = this.type(popularityEnum, "popularity")
  public tableName(): string { return 'cities'; }
}
```

## Connection and Basic Queries
Connect to database and execute typed queries:
```ts
const db = await drizzle.connect("postgres://user:password@host:port/db");
const usersTable = new UsersTable(db);
const users: User[] = await usersTable.select().execute();
```

## Filtering and Query Modifiers
Use `where` with `eq()`, `and()`, `or()` filters; support partial select, limit/offset, and ordering:
```ts
await table.select().where(eq(table.id, 42)).execute();
await table.select().where(and([eq(table.id, 42), eq(table.name, "Dan")])).execute();
await table.select().where(or([eq(table.id, 42), eq(table.id, 1)])).execute();

const result = await table.select({ mapped1: table.id, mapped2: table.name }).execute();
const { mapped1, mapped2 } = result[0];

await table.select().limit(10).offset(10).execute()
await table.select().orderBy((table) => table.name, Order.ASC).execute()
```

## Insert, Update, Delete
```ts
await usersTable.insert({ name: "Andrew", createdAt: new Date() }).execute();
await usersTable.insertMany([{ name: "Andrew", createdAt: new Date() }, { name: "Dan", createdAt: new Date() }]).execute();
await usersTable.update().where(eq(usersTable.name, 'Dan')).set({ name: 'Mr. Dan' }).execute();
await usersTable.delete().where(eq(usersTable.name, 'Dan')).execute();
```

## Joins
Fully typed joins prevent mistakes at compile time:
```ts
const result = await citiesTable.select()
  .leftJoin(usersTable, (cities, users) => eq(cities.userId, users.id))
  .where((cities, users) => eq(cities.id, 1))
  .execute();
const citiesWithUsers: { city: City, user: User }[] = result.map((city, user) => ({ city, user }));
```

## Many-to-Many Relationships
```ts
export class ManyToManyTable extends PgTable<ManyToManyTable> {
  userId = this.int('user_id').foreignKey(UsersTable, (table) => table.id, { onDelete: 'CASCADE' });
  groupId = this.int('group_id').foreignKey(ChatGroupsTable, (table) => table.id, { onDelete: 'CASCADE' });
}

const usersWithUserGroups = await manyToManyTable.select()
  .leftJoin(usersTable, (manyToMany, users) => eq(manyToManyTable.userId, users.id))
  .leftJoin(chatGroupsTable, (manyToMany, _users, chatGroups) => eq(manyToManyTable.groupId, chatGroups.id))
  .where((manyToMany, _users, userGroups) => eq(userGroups.id, 1))
  .execute();
```

## Migrations
CLI tool generates automatic migrations from TypeScript schema, handling renames and deletes with prompts. Generates SQL with table creation, indexes, and foreign key constraints.