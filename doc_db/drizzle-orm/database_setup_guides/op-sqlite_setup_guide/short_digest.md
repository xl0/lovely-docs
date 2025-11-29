## OP-SQLite Setup with Drizzle ORM

1. Create Expo TypeScript project: `npx create-expo-app --template blank-typescript`
2. Install: `npm install drizzle-orm @op-engineering/op-sqlite` and `npm install -D drizzle-kit`
3. Initialize in `App.tsx`: `const db = drizzle(open({ name: 'db' }))`
4. Define schema in `db/schema.ts` with table definitions
5. Create `drizzle.config.ts` with dialect: 'sqlite', driver: 'expo'
6. Configure `metro.config.js` to support `.sql` files
7. Update `babel.config.js` with inline-import plugin for `.sql` files
8. Generate migrations: `npx drizzle-kit generate`
9. Apply migrations using `useMigrations()` hook and perform CRUD operations (insert, select, delete)
10. Run: `npx expo run:ios`