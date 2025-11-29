## Setup

Install dependencies:
```
npm install drizzle-orm @op-engineering/op-sqlite -D drizzle-kit
```

Initialize database and Drizzle:
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';

const opsqlite = open({ name: 'myDB' });
const db = drizzle(opsqlite);

await db.select().from(users);
```

## Migrations Setup

OP SQLite requires SQL migrations to be bundled into the app. Follow these steps:

1. Install babel plugin for inlining SQL files:
```
npm install babel-plugin-inline-import
```

2. Update `babel.config.js`:
```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['inline-import', { extensions: ['.sql'] }],
  ],
};
```

3. Update `metro.config.js`:
```js
const { getDefaultConfig } = require('@react-native/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

4. Configure `drizzle.config.ts` with `dialect: 'sqlite'` and `driver: 'expo'`:
```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
});
```

5. Generate migrations:
```bash
npx drizzle-kit generate
```

6. Run migrations in your Expo/React Native app using the `useMigrations` hook:
```ts
import { drizzle } from "drizzle-orm/op-sqlite";
import { open } from '@op-engineering/op-sqlite';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator';
import migrations from './drizzle/migrations';

const opsqliteDb = open({ name: 'myDB' });
const db = drizzle(opsqliteDb);

export default function App() {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return <View><Text>Migration error: {error.message}</Text></View>;
  }

  if (!success) {
    return <View><Text>Migration is in progress...</Text></View>;
  }

  return ...your application component;
}
```