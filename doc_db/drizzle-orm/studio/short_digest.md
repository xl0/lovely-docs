## Overview
`drizzle-kit studio` starts a local Drizzle Studio server on `127.0.0.1:4983` for database browsing. Requires database credentials in `drizzle.config.ts`.

## Configuration
```ts
// drizzle.config.ts
export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

## CLI Options
```shell
npx drizzle-kit studio --port=3000 --host=0.0.0.0 --verbose
```

## Safari/Brave Support
Install mkcert, run `mkcert -install`, restart studio.

## Embeddable & Extensions
- Drizzle Studio component: framework-agnostic web component for embedding (B2B offering)
- Chrome extension: browse PlanetScale, Cloudflare D1, Vercel Postgres databases in vendor panels

## Limitations
Local version only; VPS deployment via alpha Drizzle Studio Gateway (contact team). Not open source.