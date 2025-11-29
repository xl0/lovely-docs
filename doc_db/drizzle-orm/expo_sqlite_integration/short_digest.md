## Expo SQLite Integration

**Installation:**
```
npm install drizzle-orm expo-sqlite@next
npm install -D drizzle-kit
```

**Basic usage:**
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const db = drizzle(openDatabaseSync("db.db"));
await db.select().from(users);
```

**Live Queries** (auto-rerender on data changes):
```ts
const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const { data } = useLiveQuery(db.select().from(schema.users));
```

**Migrations setup:**
1. Install `babel-plugin-inline-import`
2. Add inline-import plugin to `babel.config.js` for `.sql` files
3. Add `sql` to `sourceExts` in `metro.config.js`
4. Set `dialect: 'sqlite'` and `driver: 'expo'` in `drizzle.config.ts`
5. Run `npx drizzle-kit generate`
6. Import migrations and use `useMigrations` hook in app startup