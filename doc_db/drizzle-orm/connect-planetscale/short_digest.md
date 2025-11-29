## PlanetScale Integration

PlanetScale is a serverless MySQL platform. Access via HTTP using `drizzle-orm/planetscale-serverless` package.

### Installation
```
npm install drizzle-orm @planetscale/database
npm install -D drizzle-kit
```

### Setup
```typescript
import { drizzle } from "drizzle-orm/planetscale-serverless";

const db = drizzle({ connection: {
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
}});
```

Or pass an existing `@planetscale/database` Client instance to `drizzle({ client })`.