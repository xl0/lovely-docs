Serverless functions (AWS Lambda, Vercel) can reuse database connections and prepared statements across invocations by declaring them outside handler scope. Edge functions don't provide this benefit as they clean up immediately.

```ts
const db = drizzle({ client: databaseConnection });
const prepared = db.select().from(...).prepare();

export const handler = async (event) => {
  return prepared.execute();
}
```