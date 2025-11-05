**adapter-auto** automatically detects and uses the correct adapter for your deployment environment. Supported platforms include Cloudflare Pages, Netlify, Vercel, Azure Static Web Apps, AWS via SST, and Google Cloud Run.

For environment-specific configuration options (like `{ edge: true }` in adapter-vercel or adapter-netlify), you must install the underlying adapter directly since adapter-auto accepts no options.

It's recommended to install the specific adapter to your devDependencies once you've chosen a target environment, which adds it to your lockfile and improves CI install times.

Community adapters can be added to zero-config support by editing adapters.js in the adapter-auto package and submitting a pull request.