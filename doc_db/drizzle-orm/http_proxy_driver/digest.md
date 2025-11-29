## HTTP Proxy Driver

The HTTP Proxy allows implementing custom driver communication with databases. It's used when you need to add custom logic at the query stage or when using an HTTP driver that sends queries to a server, executes them on the database, and returns raw data for Drizzle ORM to map.

### How It Works

1. Drizzle ORM builds a query
2. HTTP Proxy Driver sends the built query to an HTTP server
3. Server executes the query on the database
4. Server sends raw results back
5. Drizzle ORM maps the data and returns results

### Callback Function Signature

The proxy accepts an async callback function with parameters:
- `sql`: query string with placeholders
- `params`: array of parameters
- `method`: one of `run`, `all`, `values`, or `get` depending on the SQL statement

Return value must be `{rows: string[][]}` or `{rows: string[]}`:
- When `method` is `get`, return `{rows: string[]}`
- Otherwise, return `{rows: string[][]}`

### PostgreSQL Example

**Client:**
```typescript
import { drizzle } from 'drizzle-orm/pg-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from pg proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

**Server:**
```typescript
import { Client } from 'pg';
import express from 'express';

const app = express();
app.use(express.json());
const client = new Client('postgres://postgres:postgres@localhost:5432/postgres');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result = await client.query({
      text: sqlBody,
      values: params,
      rowMode: method === 'all' ? 'array': undefined,
    });
    res.send(result.rows);
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### MySQL Example

**Client:**
```typescript
import { drizzle } from 'drizzle-orm/mysql-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from mysql proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

**Server:**
```typescript
import * as mysql from 'mysql2/promise';
import express from 'express';

const app = express();
app.use(express.json());
const connection = await mysql.createConnection('mysql://root:mysql@127.0.0.1:5432/drizzle');

app.post('/query', async (req, res) => {
  const { sql, params, method } = req.body;
  const sqlBody = sql.replace(/;/g, '');

  try {
    const result = await connection.query({
      sql: sqlBody,
      values: params,
      rowsAsArray: method === 'all',
      typeCast: function(field: any, next: any) {
        if (field.type === 'TIMESTAMP' || field.type === 'DATETIME' || field.type === 'DATE') {
          return field.string();
        }
        return next();
      },
    });
    if (method === 'all') {
      res.send(result[0]);
    } else if (method === 'execute') {
      res.send(result);
    }
  } catch (e: any) {
    res.status(500).json({ error: e });
  }
});

app.listen(3000);
```

### SQLite Example

**Client:**
```typescript
import { drizzle } from 'drizzle-orm/sqlite-proxy';

const db = drizzle(async (sql, params, method) => {
  try {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  } catch (e: any) {
    console.error('Error from sqlite proxy server: ', e.response.data)
    return { rows: [] };
  }
});
```

### SQLite Batch Support

SQLite Proxy supports batch requests. Specify a second callback for batch queries:

```typescript
type ResponseType = { rows: any[][] | any[] }[];

const db = drizzle(
  async (sql, params, method) => {
    // single queries logic
  },
  async (queries: { sql: string, params: any[], method: 'all' | 'run' | 'get' | 'values'}[]) => {
    try {
      const result: ResponseType = await axios.post('http://localhost:3000/batch', { queries });
      return result;
    } catch (e: any) {
      console.error('Error from sqlite proxy server:', e);
      throw e;
    }
  }
);
```

The batch response must be an array of raw values in the same order as sent. Use `db.batch([])` to proxy all queries.

### Table Declaration Example

```typescript
import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

const users = sqliteTable('users', {
  id: text('id'),
  textModifiers: text('text_modifiers').notNull().default(sql`CURRENT_TIMESTAMP`),
  intModifiers: integer('int_modifiers', { mode: 'boolean' }).notNull().default(false),
});
```