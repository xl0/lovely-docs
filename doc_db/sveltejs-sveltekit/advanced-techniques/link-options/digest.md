SvelteKit uses `<a>` elements for navigation. Customize link behavior with `data-sveltekit-*` attributes applied to the link or parent element.

**data-sveltekit-preload-data**: Controls when page data is preloaded
- `"hover"` (default): preload on mouse hover or touchstart
- `"tap"`: preload only on click/tap
- Respects `navigator.connection.saveData` for reduced data usage

**data-sveltekit-preload-code**: Controls when page code is preloaded
- `"eager"`: preload immediately
- `"viewport"`: preload when link enters viewport
- `"hover"`: preload code on hover
- `"tap"`: preload code on tap
- Only affects links present in DOM after navigation; later-added links use hover/tap
- Ignored if user has reduced data usage enabled

**data-sveltekit-reload**: Forces full-page browser navigation instead of SvelteKit handling. Links with `rel="external"` behave the same way.

**data-sveltekit-replacestate**: Replaces current history entry instead of creating new one with `pushState`.

**data-sveltekit-keepfocus**: Retains focus on currently focused element after navigation. Avoid on links; only use on elements that persist after navigation.

**data-sveltekit-noscroll**: Prevents automatic scroll to top (or hash target) after navigation.

**Disabling options**: Use `"false"` value to disable inherited attributes in nested elements:
```html
<div data-sveltekit-preload-data>
  <a href="/a">preloaded</a>
  <div data-sveltekit-preload-data="false">
    <a href="/b">not preloaded</a>
  </div>
</div>
```

These attributes also apply to `<form method="GET">` elements.