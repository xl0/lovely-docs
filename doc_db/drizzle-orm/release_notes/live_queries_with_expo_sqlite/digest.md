## Live Queries for Expo SQLite

Drizzle ORM v0.31.1 introduces native support for Expo SQLite Live Queries through a `useLiveQuery` React Hook that automatically observes database changes and re-runs queries when data changes.

### Setup

Enable change listeners when opening the database:
```tsx
import { useLiveQuery, drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

const expo = openDatabaseSync('db.db', { enableChangeListener: true });
const db = drizzle(expo);
```

### Usage

The hook works with both SQL-like and Drizzle query syntax:
```tsx
import { Text } from 'react-native';
import { users } from './schema';

const App = () => {
  // Automatically re-renders when data changes
  const { data } = useLiveQuery(db.select().from(users));
  
  // Also works with Drizzle query API
  // const { data, error, updatedAt } = useLiveQuery(db.query.users.findFirst());
  // const { data, error, updatedAt } = useLiveQuery(db.query.users.findMany());

  return <Text>{JSON.stringify(data)}</Text>;
};
```

### API Design

The hook returns an object with `data`, `error`, and `updatedAt` fields for explicit error handling, following patterns from React Query and Electric SQL. The API intentionally uses `useLiveQuery(databaseQuery)` rather than method chaining to maintain conventional React Hook patterns.