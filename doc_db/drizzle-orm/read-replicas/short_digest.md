## Read Replicas

The `withReplicas()` function routes SELECT queries to read replicas and write operations to the primary instance.

**Setup:**
```ts
const db = withReplicas(primaryDb, [read1, read2]);
```

**Usage:**
```ts
// Routes to replica
await db.select().from(usersTable);

// Routes to primary
await db.delete(usersTable).where(eq(usersTable.id, 1));

// Force primary for reads
await db.$primary.select().from(usersTable);
```

**Custom replica selection:**
```ts
const db = withReplicas(primaryDb, [read1, read2], (replicas) => {
    const weight = [0.7, 0.3];
    let cumulativeProbability = 0;
    const rand = Math.random();
    for (const [i, replica] of replicas.entries()) {
      cumulativeProbability += weight[i]!;
      if (rand < cumulativeProbability) return replica;
    }
    return replicas[0]!
});
```