## AnimationFrames

A declarative wrapper around the browser's `requestAnimationFrame` API that provides FPS limiting and frame metrics with automatic cleanup.

### Purpose
Simplifies animation loops by handling frame timing, FPS control, and performance metrics without manual cleanup.

### Key Features
- **FPS Limiting**: Control animation frame rate via `fpsLimit` option (0 = unlimited)
- **Frame Metrics**: Access `fps` property for current frames per second and `delta` for milliseconds since last frame
- **Automatic Cleanup**: Handles cleanup automatically
- **Declarative API**: Callback-based approach integrated with reactive state

### Usage
Create an instance with a callback function and options:

```svelte
const animation = new AnimationFrames(
	(args) => {
		frames++;
		delta = args.delta;
	},
	{ fpsLimit: () => fpsLimit }
);
```

The callback receives an object with `delta` (time since last frame in milliseconds). The `fpsLimit` option accepts a function that returns the desired FPS limit (0 for no limit).

### Properties
- `animation.fps`: Current frames per second (number)
- `animation.running`: Whether the animation is currently running (boolean)

### Control
Start/stop the animation by toggling `animation.running` or calling appropriate methods.