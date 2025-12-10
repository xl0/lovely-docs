## Image Optimization Techniques

Images impact app performance. Optimize by generating optimal formats (`.avif`, `.webp`), creating different sizes for different screens, and ensuring effective caching.

## Vite's Built-in Handling

Vite automatically processes imported assets with hashing for caching and inlining for small assets.

```svelte
<script>
	import logo from '$lib/assets/logo.png';
</script>

<img alt="The project logo" src={logo} />
```

## @sveltejs/enhanced-img

Plugin providing plug-and-play image processing: serves smaller formats (avif/webp), sets intrinsic width/height to prevent layout shift, creates multiple sizes for various devices, strips EXIF data.

**Note:** Only optimizes files on your machine during build. For images from CDN/CMS/backend, use dynamic loading approach.

### Setup

```sh
npm i -D @sveltejs/enhanced-img
```

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		enhancedImages(), // must come before SvelteKit plugin
		sveltekit()
	]
});
```

First build is slower due to image transformation, but subsequent builds use cache at `./node_modules/.cache/imagetools`.

### Basic Usage

```svelte
<enhanced:img src="./path/to/your/image.jpg" alt="An alt text" />
```

At build time, replaced with `<img>` wrapped by `<picture>` providing multiple image types and sizes. Provide highest resolution needed; smaller versions generated automatically. Provide 2x resolution for HiDPI displays.

**CSS selector note:** Use `enhanced\:img` to escape the colon in style blocks.

### Dynamic Image Selection

```svelte
<script>
	import MyImage from './path/to/your/image.jpg?enhanced';
</script>

<enhanced:img src={MyImage} alt="some alt text" />
```

With `import.meta.glob`:

```svelte
<script>
	const imageModules = import.meta.glob(
		'/path/to/assets/*.{avif,gif,heif,jpeg,jpg,png,tiff,webp}',
		{
			eager: true,
			query: { enhanced: true }
		}
	)
</script>

{#each Object.entries(imageModules) as [_path, module]}
	<enhanced:img src={module.default} alt="some alt text" />
{/each}
```

**Note:** SVG images only supported statically.

### Intrinsic Dimensions

`width` and `height` are optional and automatically inferred/added, preventing layout shift. To use different dimensions or auto-calculate one:

```svelte
<style>
	.hero-image img {
		width: var(--size);
		height: auto;
	}
</style>
```

### srcset and sizes

For large images (hero images, full-width), specify `sizes` for smaller versions on smaller devices:

```svelte
<enhanced:img src="./image.png" sizes="min(1280px, 100vw)"/>
```

With custom widths:

```svelte
<enhanced:img
  src="./image.png?w=1280;640;400"
  sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
/>
```

Without `sizes`, generates HiDPI and standard resolution images. Provide 2x resolution source.

Smallest auto-generated image is 540px; use `?w=` query parameter for custom widths.

### Per-image Transforms

Apply transforms like blur, quality, flatten, rotate via query string:

```svelte
<enhanced:img src="./path/to/your/image.jpg?blur=15" alt="An alt text" />
```

See imagetools repo for full list of directives.

## Loading Images Dynamically from CDN

For images not accessible at build time (CMS, backend, database), use CDN for dynamic optimization.

CDNs provide flexibility with sizes but may have setup overhead and costs. Browser may not use cached copy until 304 response. CDNs serve appropriate format based on User-Agent header, allowing `<img>` tags instead of `<picture>`. Some CDNs generate images lazily, potentially impacting performance on low-traffic sites.

Libraries with Svelte support: `@unpic/svelte` (CDN-agnostic, many providers), Cloudinary, Contentful, Storyblok, Contentstack.

## Best Practices

- Mix and match solutions in one project (Vite for meta tags, enhanced-img for homepage, CDN for user content).
- Serve all images via CDN to reduce latency globally.
- Original images should be high quality/resolution at 2x display width for HiDPI. Image processing sizes down, not up.
- For large images (>400px, hero images), specify `sizes` for smaller device serving.
- For important images (LCP), set `fetchpriority="high"` and avoid `loading="lazy"`.
- Constrain images with container/styling to prevent jumping during load, affecting CLS. Use `width` and `height` to reserve space.
- Always provide good `alt` text (Svelte compiler warns if missing).
- Don't use `em` or `rem` in `sizes` or change their default. In `sizes` and `@media`, `em`/`rem` mean user's default font-size. If CSS changes font-size (e.g., `html { font-size: 62.5%; }`), browser preloader slot size differs from actual CSS layout slot.