## CSS

Use Iconify for CSS-based icons. Iconify supports many popular icon sets via CSS inclusion. Works with CSS frameworks using Iconify's Tailwind CSS or UnoCSS plugins. No need to import icons into `.svelte` files.

## Svelte

When choosing icon libraries for Svelte, avoid libraries that provide one `.svelte` file per icon. These can have thousands of files, severely slowing Vite's dependency optimization. This problem is especially pronounced when icons are imported both via umbrella imports and subpath imports, as noted in the vite-plugin-svelte FAQ.