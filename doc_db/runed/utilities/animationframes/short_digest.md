## AnimationFrames

Wrapper around `requestAnimationFrame` with FPS limiting and frame metrics.

**Create instance:**
```svelte
const animation = new AnimationFrames(
	(args) => { /* args.delta = ms since last frame */ },
	{ fpsLimit: () => fpsLimit }
);
```

**Access metrics:**
- `animation.fps` - current frames per second
- `animation.running` - animation state
- Callback receives `delta` in milliseconds