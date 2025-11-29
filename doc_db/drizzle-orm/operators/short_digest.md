## Filter and Conditional Operators

Import from `drizzle-orm`:
```typescript
import { eq, ne, gt, gte, lt, lte, exists, isNull, inArray, between, like, and, or, ... } from "drizzle-orm";
```

**Comparison**: eq, ne, gt, gte, lt, lte - compare values or columns
```typescript
db.select().from(table).where(eq(table.column, 5));
```

**Existence**: exists, notExists - check if subquery returns results
```typescript
db.select().from(table).where(exists(db.select().from(table2)));
```

**Null checks**: isNull, isNotNull
```typescript
db.select().from(table).where(isNull(table.column));
```

**Array membership**: inArray, notInArray - check if value in array or subquery
```typescript
db.select().from(table).where(inArray(table.column, [1, 2, 3]));
```

**Range**: between, notBetween
```typescript
db.select().from(table).where(between(table.column, 2, 7));
```

**String patterns**: like (case-sensitive), ilike (case-insensitive, PostgreSQL only), notIlike
```typescript
db.select().from(table).where(like(table.column, "%pattern%"));
```

**Logical**: not, and, or - combine conditions
```typescript
db.select().from(table).where(and(gt(table.column, 5), lt(table.column, 7)));
```

**PostgreSQL arrays**: arrayContains, arrayContained, arrayOverlaps - test array relationships
```typescript
db.select().from(posts).where(arrayContains(posts.tags, ['Typescript', 'ORM']));
```