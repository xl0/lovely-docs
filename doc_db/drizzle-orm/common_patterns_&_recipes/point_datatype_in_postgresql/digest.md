PostgreSQL's `point` datatype stores geometric data as (x, y) coordinates in 2D space, with longitude first, then latitude.

**Creating a table with point column:**
```ts
import { pgTable, point, serial, text } from 'drizzle-orm/pg-core';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  location: point('location', { mode: 'xy' }).notNull(),
});
```

**Inserting point data:**
Three modes are supported:
- `mode: 'xy'`: `location: { x: -90.9, y: 18.7 }`
- `mode: 'tuple'`: `location: [-90.9, 18.7]`
- Raw SQL: `location: sql\`point(-90.9, 18.7)\``

**Distance queries using `<->` operator:**
Find nearest location by computing distance:
```ts
import { getTableColumns, sql } from 'drizzle-orm';
import { stores } from './schema';

const point = { x: -73.935_242, y: 40.730_61 };
const sqlDistance = sql\`location <-> point(${point.x}, ${point.y})\`;

await db
  .select({
    ...getTableColumns(stores),
    distance: sql\`round((${sqlDistance})::numeric, 2)\`,
  })
  .from(stores)
  .orderBy(sqlDistance)
  .limit(1);
```

**Boundary filtering using `<@` operator:**
Filter points within a rectangular box defined by two diagonal corners:
```ts
const point = { x1: -88, x2: -73, y1: 40, y2: 43 };

await db
  .select()
  .from(stores)
  .where(
    sql\`${stores.location} <@ box(point(${point.x1}, ${point.y1}), point(${point.x2}, ${point.y2}))\`
  );
```