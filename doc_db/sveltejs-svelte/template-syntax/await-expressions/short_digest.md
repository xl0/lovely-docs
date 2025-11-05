## Await in Svelte 5.36+
Enable with `experimental.async: true` in config. Use `await` in `<script>`, `$derived()`, and markup.

**Synchronized updates**: UI waits for async work to complete, preventing inconsistent states.

**Concurrency**: Multiple independent `await` in markup run in parallel; sequential ones in `<script>` behave like normal JS.

**Loading states**: Use `<svelte:boundary pending>` for placeholders, `$effect.pending()` for subsequent updates, `settled()` to wait for completion.

**SSR**: Await `render(App)` for async server-side rendering.

**Forking**: `fork()` API preloads expected async work with `commit()` or `discard()`.

**Errors**: Bubble to nearest error boundary.