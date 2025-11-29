## Overview
`drizzle-kit studio` command starts a local server for Drizzle Studio, a database browser hosted at `local.drizzle.studio`. It requires database connection credentials configured in `drizzle.config.ts`.

## Default Configuration
Starts on `127.0.0.1:4983` by default.

Example config:
```ts
// drizzle.config.ts
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://user:password@host:port/dbname"
  },
});
```

## CLI Options
Configure host and port via command-line flags:
```shell
npx drizzle-kit studio --port=3000
npx drizzle-kit studio --host=0.0.0.0
npx drizzle-kit studio --host=0.0.0.0 --port=3000
```

Enable SQL statement logging:
```shell
npx drizzle-kit studio --verbose
```

## Safari and Brave Support
These browsers block localhost access by default. Install mkcert and generate self-signed certificates:
1. Install mkcert following their documentation
2. Run `mkcert -install`
3. Restart `drizzle-kit studio`

## Embeddable Version
Drizzle Studio component is a framework-agnostic web component for embedding into UIs (React, Vue, Svelte, VanillaJS, etc). This is a B2B offering for businesses providing Database-as-a-SaaS or data-centric SaaS solutions. Used by platforms like Turso, Neon, Hydra, Nuxt Hub, and Deco.cx.

## Chrome Extension
Drizzle Studio chrome extension allows browsing PlanetScale, Cloudflare D1, and Vercel Postgres serverless databases directly in vendor admin panels.

## Limitations
- Hosted version is for local development only, not for remote deployment (VPS, etc)
- Alpha version of Drizzle Studio Gateway available for VPS deployment (contact via Twitter or Discord)

## Open Source Status
Drizzle ORM and Drizzle Kit are fully open source. Drizzle Studio is not open source - the hosted local version is free forever to enrich the ecosystem, but keeping it proprietary enables B2B offerings and monetization.