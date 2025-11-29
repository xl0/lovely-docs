## Setup Drizzle ORM with Expo SQLite

### Prerequisites
- Expo SQLite library for database access via SQLite API

### Project Setup
1. Create new Expo project with TypeScript template:
   ```bash
   npx create-expo-app --template blank-typescript
   ```

2. Install Expo SQLite:
   ```bash
   npx expo install expo-sqlite
   ```

3. Install Drizzle packages:
   ```bash
   npm install drizzle-orm
   npm install -D drizzle-kit
   ```

### Database Connection
Create connection in `App.tsx`:
```ts
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);
```

### Schema Definition
Create `db/schema.ts`:
```typescript
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  age: int().notNull(),
  email: text().notNull().unique(),
});
```

### Configuration Files

**drizzle.config.ts** (root):
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  driver: 'expo',
  schema: './db/schema.ts',
  out: './drizzle',
});
```

**metro.config.js** (root):
```js
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

**babel.config.js** (root):
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

### Migrations
Generate migrations:
```bash
npx drizzle-kit generate
```

### Database Operations
In `App.tsx`, use `useMigrations` hook to apply migrations, then perform CRUD operations:
```ts
import { Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { usersTable } from './db/schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expo = SQLite.openDatabaseSync('db.db');
const db = drizzle(expo);

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [items, setItems] = useState<typeof usersTable.$inferSelect[] | null>(null);

  useEffect(() => {
    if (!success) return;

    (async () => {
      await db.delete(usersTable);
      await db.insert(usersTable).values([
        { name: 'John', age: 30, email: 'john@example.com' }
      ]);
      const users = await db.select().from(usersTable);
      setItems(users);
    })();
  }, [success]);

  if (error) return <View><Text>Migration error: {error.message}</Text></View>;
  if (!success) return <View><Text>Migration in progress...</Text></View>;
  if (!items?.length) return <View><Text>Empty</Text></View>;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {items.map((item) => <Text key={item.id}>{item.email}</Text>)}
    </View>
  );
}
```

### Run Application
```bash
npx expo run:ios
# or: yarn expo run:ios, pnpm expo run:ios, bun expo run:ios
```

### Project Structure
```
📦 project root
 ├ 📂 drizzle (migrations)
 ├ 📂 db
 │  └ 📜 schema.ts
 ├ 📜 drizzle.config.ts
 ├ 📜 metro.config.js
 ├ 📜 babel.config.js
 ├ 📜 App.tsx
 └ 📜 package.json
```