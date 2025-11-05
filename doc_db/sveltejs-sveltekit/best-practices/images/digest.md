## Image Optimization Approaches

**Vite's built-in handling**: Automatically processes imported assets, adds hashes for caching, and inlines small assets.
```svelte
import logo from '$lib/assets/logo.png';
<img alt="The project logo" src={logo} />
```

**@sveltejs/enhanced-img**: Build-time plugin that generates optimal formats (avif, webp), creates multiple sizes, sets intrinsic dimensions to prevent layout shift, and strips EXIF data. Only works with local files at build time.

Setup:
```js
import { enhancedImages } from '@sveltejs/enhanced-img';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()]
});
```

Usage:
```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

For dynamic image selection, import with `?enhanced` query:
```svelte
import MyImage from './path/to/your/image.jpg?enhanced';
<enhanced:img src={MyImage} alt="some alt text" />
```

Specify `sizes` for responsive images:
```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

Custom widths with `w` query parameter:
```svelte
<enhanced:img src="./image.png?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

Per-image transforms via query string:
```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

**CDN-based loading**: For images not available at build time (CMS, database). Use CDN-agnostic libraries like `@unpic/svelte` or provider-specific solutions (Cloudinary, Contentful, Storyblok, Contentstack).

## Best Practices

- Mix approaches in one project based on use case
- Serve all images via CDN to reduce latency
- Provide images at 2x resolution for HiDPI displays
- Use `sizes` for large images (>400px) to serve smaller versions on mobile
- Set `fetchpriority="high"` and avoid `loading="lazy"` for LCP images
- Constrain images with container/styling to prevent layout shift; `@sveltejs/enhanced-img` adds width/height automatically
- Always provide `alt` text
- Don't use `em` or `rem` in `sizes` declarations as they're relative to user's default font-size, not CSS-modified values