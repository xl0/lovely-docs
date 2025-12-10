## Image Optimization

Three approaches: Vite's built-in asset handling, `@sveltejs/enhanced-img` plugin, or CDN for dynamic images.

### Vite Built-in
```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>
<img alt="Logo" src={logo} />
```

### @sveltejs/enhanced-img
Install and add to `vite.config.js`:
```js
import { enhancedImages } from '@sveltejs/enhanced-img';
export default defineConfig({
	plugins: [enhancedImages(), sveltekit()]
});
```

Use `<enhanced:img>` instead of `<img>`. Automatically generates multiple formats/sizes, sets width/height, strips EXIF. Provide 2x resolution source.

```svelte
<enhanced:img src="./image.jpg" alt="text" />
<enhanced:img src="./image.jpg" sizes="min(1280px, 100vw)" />
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, ..." />
<enhanced:img src="./image.jpg?blur=15" alt="text" />
```

Dynamic selection with `?enhanced` query:
```svelte
<script>
	import MyImage from './image.jpg?enhanced';
	const images = import.meta.glob('*.{jpg,png}', { eager: true, query: { enhanced: true } });
</script>
<enhanced:img src={MyImage} alt="text" />
```

### CDN
For images from CMS/backend/database. Use `@unpic/svelte`, Cloudinary, Contentful, Storyblok, or Contentstack.

### Best Practices
- Mix approaches in one project
- Serve via CDN for global latency reduction
- Provide 2x resolution source for HiDPI
- Specify `sizes` for large images (>400px)
- Set `fetchpriority="high"` for LCP images
- Use `width`/`height` to prevent layout shift
- Always provide `alt` text
- Don't use `em`/`rem` in `sizes` if changing default font-size