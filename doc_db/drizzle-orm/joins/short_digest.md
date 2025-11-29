## Join Types

**Left Join**: All left rows, right nullable
```typescript
db.select().from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// { user: {...}, pets: {...} | null }[]
```

**Left Join Lateral**: Left join with subquery referencing left table
```typescript
const subquery = db.select().from(pets).where(gte(users.age, 16)).as('userPets')
db.select().from(users).leftJoinLateral(subquery, sql`true`)
```

**Right Join**: All right rows, left nullable
```typescript
db.select().from(users).rightJoin(pets, eq(users.id, pets.ownerId))
// { user: {...} | null, pets: {...} }[]
```

**Inner Join**: Only matching rows
```typescript
db.select().from(users).innerJoin(pets, eq(users.id, pets.ownerId))
// { user: {...}, pets: {...} }[]
```

**Inner Join Lateral**: Inner join with subquery referencing left table

**Full Join**: All rows from both tables, both nullable
```typescript
db.select().from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// { user: {...} | null, pets: {...} | null }[]
```

**Cross Join**: Cartesian product
```typescript
db.select().from(users).crossJoin(pets)
```

**Cross Join Lateral**: Cross join with subquery referencing left table

## Partial Select

Select specific fields with automatic type inference:
```typescript
db.select({ userId: users.id, petId: pets.id }).from(users).leftJoin(pets, eq(users.id, pets.ownerId))
// { userId: number, petId: number | null }[]
```

Use `sql<type | null>` for explicit nullable types in sql expressions. Use nested objects to make entire objects nullable instead of individual fields:
```typescript
db.select({
  userId: users.id,
  pet: { id: pets.id, name: pets.name }
}).from(users).fullJoin(pets, eq(users.id, pets.ownerId))
// { userId: number | null, pet: {...} | null }[]
```

## Aliases & Self-joins

Use `alias()` for self-joins:
```typescript
const parent = alias(user, "parent");
db.select().from(user).leftJoin(parent, eq(parent.id, user.parentId))
```

## Aggregating Results

Use `reduce()` to aggregate many-to-one relationships into nested structures.

## Many-to-One & Many-to-Many Examples

Many-to-one: left join cities with users on cityId.
Many-to-many: join through junction table (usersToChatGroups) to connect users and chatGroups.