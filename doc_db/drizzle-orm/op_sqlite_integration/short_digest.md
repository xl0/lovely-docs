## Setup

```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';

const db = drizzle(open({ name: 'myDB' }));
await db.select().from(users);
```

## Migrations

Install `babel-plugin-inline-import` and configure `babel.config.js`, `metro.config.js`, and `drizzle.config.ts` with `dialect: 'sqlite'` and `driver: 'expo'`. Generate migrations with `npx drizzle-kit generate`, then run them in your app using the `useMigrations` hook:

```ts
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const { success, error } = useMigrations(db, migrations);
```