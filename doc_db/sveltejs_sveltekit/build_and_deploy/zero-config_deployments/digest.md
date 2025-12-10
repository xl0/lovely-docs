## Overview

`adapter-auto` is the default adapter installed with new SvelteKit projects. It automatically detects the deployment environment and uses the appropriate adapter without requiring manual configuration.

## Supported Environments

- **Cloudflare Pages**: `@sveltejs/adapter-cloudflare`
- **Netlify**: `@sveltejs/adapter-netlify`
- **Vercel**: `@sveltejs/adapter-vercel`
- **Azure Static Web Apps**: `svelte-adapter-azure-swa`
- **AWS via SST**: `svelte-kit-sst`
- **Google Cloud Run**: `@sveltejs/adapter-node`

## Installation

While `adapter-auto` is installed by default, it's recommended to install the specific adapter for your target environment as a `devDependency` once chosen. This adds the adapter to your lockfile and improves CI install times.

## Configuration

`adapter-auto` does not accept configuration options. To use environment-specific options (e.g., `{ edge: true }` for Vercel or Netlify), you must install and configure the underlying adapter directly instead of relying on `adapter-auto`.

## Community Adapters

Additional adapters can be added to `adapter-auto`'s zero-config support by editing the `adapters.js` file in the adapter-auto package and submitting a pull request to the SvelteKit repository.