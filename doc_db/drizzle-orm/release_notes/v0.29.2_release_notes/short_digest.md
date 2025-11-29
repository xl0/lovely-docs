## Fixes
- PgArray string escaping, SQLite exists syntax, AWS Data API dates, Hermes mixins constructor
- ESLint plugin v0.2.3: function support, better error messages

## Expo SQLite Driver
Install: `npm install drizzle-orm expo-sqlite@next`

Usage:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const db = drizzle(openDatabaseSync("db.db"));
await db.select().from(...);
```

For migrations, install `babel-plugin-inline-import` and configure babel.config.js and metro.config.js to handle .sql files. Create drizzle.config.ts with `dialect: 'sqlite'` and `driver: 'expo'`, then run `npx drizzle-kit generate`. Use `useMigrations` hook in App.tsx to apply migrations.