## Dark Mode in Astro

Use Tailwind's `class` strategy by toggling the `dark` class on `html`.

**Inline script** (prevents FUOC, syncs to localStorage):
```astro
<script is:inline>
  const getThemePreference = () => {
    if (localStorage.getItem('theme')) return localStorage.getItem('theme');
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const isDark = getThemePreference() === 'dark';
  document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  const observer = new MutationObserver(() => {
    localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
</script>
```

**Install mode-watcher** for easy theme toggling:
```bash
npm i mode-watcher@0.5.1
```

**Add ModeWatcher component:**
```astro
<ModeWatcher client:load />
```

**Create toggle** (light switch or dropdown with `setMode()`, `toggleMode()`, `resetMode()`):
```svelte
<Button onclick={toggleMode}>
  <SunIcon class="rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
  <MoonIcon class="absolute rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
</Button>
```

Add toggle to page with `client:load` directive.