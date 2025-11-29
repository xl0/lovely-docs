## Drizzle ORM for Expo SQLite

Drizzle provides native ORM support for Expo SQLite with the following features:
- Native ORM driver for Expo SQLite
- Drizzle Kit support for migration generation and bundling
- Drizzle Studio dev tools plugin for on-device database browsing
- Live Queries support

### Installation
```
npm install drizzle-orm expo-sqlite@next
npm install -D drizzle-kit
```

### Basic Usage
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expo = openDatabaseSync("db.db");
const db = drizzle(expo);

await db.select().from(users);
```

### Live Queries
Use the `useLiveQuery` hook to make queries reactive and automatically re-render when data changes. Requires enabling change listeners when opening the database:

```ts
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import { Text } from 'react-native';
import * as schema from './schema';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);

const App = () => {
  const { data } = useLiveQuery(db.select().from(schema.users));
  return <Text>{JSON.stringify(data)}</Text>;
};
```

### Migrations with Drizzle Kit

Expo requires SQL migrations to be bundled into the app as strings. Setup involves:

1. Install babel plugin for inlining SQL files:
```
npm install babel-plugin-inline-import
```

2. Update `babel.config.js` to include the inline-import plugin for `.sql` files:
```js
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

3. Update `metro.config.js` to recognize `.sql` files:
```js
const { getDefaultConfig } = require('expo/metro-config');
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

6. Run migrations on app startup using the `useMigrations` hook:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './drizzle/migrations';

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

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