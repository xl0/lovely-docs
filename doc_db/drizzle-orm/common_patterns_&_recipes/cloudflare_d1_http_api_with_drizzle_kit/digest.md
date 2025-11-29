## Configuration

To use Drizzle Kit with Cloudflare D1 HTTP API, configure `drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
```

## Obtaining Credentials

- **accountId**: Go to Cloudflare dashboard → Workers & Pages → Overview → copy Account ID from right sidebar
- **databaseId**: Open your D1 database in Cloudflare dashboard and copy Database ID
- **token**: Go to My profile → API Tokens → create token with D1 edit permissions

## Requirements

- Drizzle Kit version 0.21.3 or higher
- Cloudflare account with deployed D1 database
- API token with D1 edit permissions

## Supported Commands

After configuration, Drizzle Kit supports: `migrate`, `push`, `introspect`, and `studio` commands with Cloudflare D1 HTTP API.

## Browser Integration

Use the Drizzle Chrome Extension to browse Cloudflare D1 databases directly in the Cloudflare admin panel.