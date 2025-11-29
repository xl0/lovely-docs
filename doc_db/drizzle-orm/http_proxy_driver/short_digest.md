## HTTP Proxy Driver

Implement custom driver communication by providing an async callback that receives `(sql, params, method)` and returns `{rows: string[][] | string[]}`.

**PostgreSQL:**
```typescript
import { drizzle } from 'drizzle-orm/pg-proxy';
const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
  return { rows: rows.data };
});
```

**MySQL:**
```typescript
import { drizzle } from 'drizzle-orm/mysql-proxy';
const db = drizzle(async (sql, params, method) => {
  const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
  return { rows: rows.data };
});
```

**SQLite with batch support:**
```typescript
import { drizzle } from 'drizzle-orm/sqlite-proxy';
const db = drizzle(
  async (sql, params, method) => {
    const rows = await axios.post('http://localhost:3000/query', { sql, params, method });
    return { rows: rows.data };
  },
  async (queries) => {
    const result = await axios.post('http://localhost:3000/batch', { queries });
    return result;
  }
);
```

Server receives `{sql, params, method}`, executes query, returns raw rows. For `method === 'get'` return `{rows: string[]}`, otherwise `{rows: string[][]}`. Batch response must be array of raw values in same order.