## Filter and Conditional Operators

All filter and conditional operators are imported from `drizzle-orm`:
```typescript
import { eq, ne, gt, gte, lt, lte, ... } from "drizzle-orm";
```

### Comparison Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**eq** - Value equal to n
```typescript
db.select().from(table).where(eq(table.column, 5));
// SELECT * FROM table WHERE table.column = 5
db.select().from(table).where(eq(table.column1, table.column2));
// SELECT * FROM table WHERE table.column1 = table.column2
```

**ne** - Value not equal to n
```typescript
db.select().from(table).where(ne(table.column, 5));
// SELECT * FROM table WHERE table.column <> 5
```

**gt** - Value greater than n
```typescript
db.select().from(table).where(gt(table.column, 5));
// SELECT * FROM table WHERE table.column > 5
```

**gte** - Value greater than or equal to n
```typescript
db.select().from(table).where(gte(table.column, 5));
// SELECT * FROM table WHERE table.column >= 5
```

**lt** - Value less than n
```typescript
db.select().from(table).where(lt(table.column, 5));
// SELECT * FROM table WHERE table.column < 5
```

**lte** - Value less than or equal to n
```typescript
db.select().from(table).where(lte(table.column, 5));
// SELECT * FROM table WHERE table.column <= 5
```

### Existence Operators

**exists** - Value exists (PostgreSQL, MySQL, SQLite, SingleStore)
```typescript
const query = db.select().from(table2);
db.select().from(table).where(exists(query));
// SELECT * FROM table WHERE EXISTS (SELECT * from table2)
```

**notExists** - Value does not exist
```typescript
const query = db.select().from(table2);
db.select().from(table).where(notExists(query));
// SELECT * FROM table WHERE NOT EXISTS (SELECT * from table2)
```

### Null Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**isNull** - Value is null
```typescript
db.select().from(table).where(isNull(table.column));
// SELECT * FROM table WHERE table.column IS NULL
```

**isNotNull** - Value is not null
```typescript
db.select().from(table).where(isNotNull(table.column));
// SELECT * FROM table WHERE table.column IS NOT NULL
```

### Array Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**inArray** - Value is in array of values
```typescript
db.select().from(table).where(inArray(table.column, [1, 2, 3, 4]));
// SELECT * FROM table WHERE table.column in (1, 2, 3, 4)
const query = db.select({ data: table2.column }).from(table2);
db.select().from(table).where(inArray(table.column, query));
// SELECT * FROM table WHERE table.column IN (SELECT table2.column FROM table2)
```

**notInArray** - Value is not in array of values
```typescript
db.select().from(table).where(notInArray(table.column, [1, 2, 3, 4]));
// SELECT * FROM table WHERE table.column NOT in (1, 2, 3, 4)
```

### Range Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**between** - Value is between two values
```typescript
db.select().from(table).where(between(table.column, 2, 7));
// SELECT * FROM table WHERE table.column BETWEEN 2 AND 7
```

**notBetween** - Value is not between two values
```typescript
db.select().from(table).where(notBetween(table.column, 2, 7));
// SELECT * FROM table WHERE table.column NOT BETWEEN 2 AND 7
```

### String Pattern Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**like** - Value matches pattern, case sensitive
```typescript
db.select().from(table).where(like(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column LIKE '%llo wor%'
```

**ilike** - Value matches pattern, case insensitive (PostgreSQL only)
```typescript
db.select().from(table).where(ilike(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column ILIKE '%llo wor%'
```

**notIlike** - Value does not match pattern, case insensitive (PostgreSQL, MySQL, SQLite, SingleStore)
```typescript
db.select().from(table).where(notIlike(table.column, "%llo wor%"));
// SELECT * FROM table WHERE table.column NOT ILIKE '%llo wor%'
```

### Logical Operators (PostgreSQL, MySQL, SQLite, SingleStore)

**not** - Condition returns false
```typescript
db.select().from(table).where(not(eq(table.column, 5)));
// SELECT * FROM table WHERE NOT (table.column = 5)
```

**and** - All conditions must return true
```typescript
db.select().from(table).where(and(gt(table.column, 5), lt(table.column, 7)));
// SELECT * FROM table WHERE (table.column > 5 AND table.column < 7)
```

**or** - One or more conditions must return true
```typescript
db.select().from(table).where(or(gt(table.column, 5), lt(table.column, 7)));
// SELECT * FROM table WHERE (table.column > 5 OR table.column < 7)
```

### PostgreSQL Array Operators

**arrayContains** - Column contains all elements of the list (PostgreSQL only)
```typescript
db.select({ id: posts.id }).from(posts).where(arrayContains(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" @> {Typescript,ORM}
```

**arrayContained** - List contains all elements of the column (PostgreSQL only)
```typescript
db.select({ id: posts.id }).from(posts).where(arrayContained(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" <@ {Typescript,ORM}
```

**arrayOverlaps** - Column contains any elements of the list (PostgreSQL only)
```typescript
db.select({ id: posts.id }).from(posts).where(arrayOverlaps(posts.tags, ['Typescript', 'ORM']));
// select "id" from "posts" where "posts"."tags" && {Typescript,ORM}
```