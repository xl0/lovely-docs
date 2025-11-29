## Serverless Performance Benefits

Serverless functions like AWS Lambda and Vercel Server Functions (AWS Lambda-based) can live up to 15 minutes and reuse both database connections and prepared statements, providing significant performance benefits.

Edge functions, by contrast, clean up immediately after invocation, offering little to no performance benefits.

## Connection and Statement Reuse

To reuse database connections and prepared statements, declare them outside the handler scope:

```ts
const databaseConnection = ...;
const db = drizzle({ client: databaseConnection });
const prepared = db.select().from(...).prepare();

export const handler = async (event: APIGatewayProxyEvent) => {
  return prepared.execute();
}
```

This pattern allows the connection and prepared statement to persist across multiple function invocations within the 15-minute lifetime, eliminating the overhead of creating new connections and re-preparing statements for each request.