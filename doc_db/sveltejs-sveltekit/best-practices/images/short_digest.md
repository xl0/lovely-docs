## Image Optimization

**Vite built-in**: Auto-processes imported assets with hashing and inlining.

**@sveltejs/enhanced-img**: Build-time plugin generating avif/webp formats, multiple sizes, intrinsic dimensions.
```svelte
<enhanced:img src="./image.jpg" alt="text" />
<enhanced:img src="./image.jpg?w=1280;640;400" sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"/>
```

**CDN-based**: For dynamic/non-build-time images using `@unpic/svelte` or provider-specific libraries.

**Best practices**: Mix approaches per use case, serve via CDN, provide 2x resolution images, use `sizes` for large images, set `fetchpriority="high"` for LCP images, add width/height to prevent layout shift, always provide alt text, avoid em/rem in sizes.