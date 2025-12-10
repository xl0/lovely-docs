## Zero-config Deployments

`adapter-auto` automatically detects deployment environment and uses the correct adapter (Cloudflare, Netlify, Vercel, Azure, AWS SST, or Google Cloud Run).

Install the specific adapter as `devDependency` for your target environment to improve CI times. `adapter-auto` accepts no configuration options—use the underlying adapter directly for environment-specific settings like `{ edge: true }`.