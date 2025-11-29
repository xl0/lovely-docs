## Bug Fixes
- Improved planescale relational tests
- Fixed string escaping for empty PgArrays
- Fixed incorrect syntax for SQLite exists function
- Fixed date handling in AWS Data API
- Fixed Hermes mixins constructor issue

## ESLint Plugin v0.2.3
- Added support for Drizzle objects retrieved from functions
- Improved error message context in suggestions

## New Expo SQLite Driver
Install with: `npm install drizzle-orm expo-sqlite@next`

Basic usage:
```ts
import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

const expoDb = openDatabaseSync("db.db");
const db = drizzle(expoDb);

await db.select().from(...);
// or db.select().from(...).then(...);
// or db.select().from(...).all();
```

For migrations support, install `babel-plugin-inline-import` and update configuration files:

**babel.config.js:**
```ts
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [["inline-import", { "extensions": [".sql"] }]]
  };
};
```

**metro.config.js:**
```ts
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');
module.exports = config;
```

**drizzle.config.ts:**
```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
```

Generate migrations with: `npx drizzle-kit generate`

In **App.tsx**, use the migration hook:
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