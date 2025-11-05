## Setup
```js
import adapter from '@sveltejs/adapter-vercel';
const config = { kit: { adapter: adapter() } };
```

## Route Configuration
```js
export const config = {
	split: true,  // individual function
	runtime: 'edge',  // or 'nodejs20.x'
	regions: ['iad1'],
	memory: 1024,  // serverless only
	isr: { expiration: 60, bypassToken: TOKEN, allowQuery: ['search'] }
};
```

## Image Optimization
```js
adapter({ images: { sizes: [640, 1920], formats: ['image/webp'] } })
```

## Key Points
- Use `$env/static/private` for Vercel environment variables
- Enable Skew Protection in project settings to route to original deployment
- Use `read()` from `$app/server` instead of `fs` in edge functions
- Implement API routes in SvelteKit, not in `/api` directory