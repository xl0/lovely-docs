## Expo SQLite Setup

1. Create Expo project: `npx create-expo-app --template blank-typescript`
2. Install: `npx expo install expo-sqlite` and `npm install drizzle-orm drizzle-kit`
3. Connect in `App.tsx`:
   ```ts
   import * as SQLite from 'expo-sqlite';
   import { drizzle } from 'drizzle-orm/expo-sqlite';
   const db = drizzle(SQLite.openDatabaseSync('db.db'));
   ```
4. Define schema in `db/schema.ts` with `sqliteTable`
5. Create `drizzle.config.ts` with dialect 'sqlite', driver 'expo', schema and output paths
6. Update `metro.config.js` to support `.sql` files and `babel.config.js` to inline imports
7. Generate migrations: `npx drizzle-kit generate`
8. Apply migrations with `useMigrations` hook and perform queries in `App.tsx`
9. Run: `npx expo run:ios`