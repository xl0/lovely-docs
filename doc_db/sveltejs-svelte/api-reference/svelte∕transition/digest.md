## Transition Functions

Seven built-in transition functions for animating element entry/exit:

- **blur**: Animates blur filter and opacity. Parameters: `delay`, `duration`, `easing`, `amount`, `opacity`
- **fade**: Animates opacity from 0 to current (in) or current to 0 (out). Parameters: `delay`, `duration`, `easing`
- **fly**: Animates x, y position and opacity. Parameters: `delay`, `duration`, `easing`, `x`, `y`, `opacity`
- **scale**: Animates opacity and scale. Parameters: `delay`, `duration`, `easing`, `start`, `opacity`
- **slide**: Slides element in/out along an axis. Parameters: `delay`, `duration`, `easing`, `axis` ('x' or 'y')
- **draw**: Animates SVG stroke like drawing. Works only on elements with `getTotalLength()` method. Parameters: `delay`, `speed`, `duration`, `easing`
- **crossfade**: Creates paired `send` and `receive` transitions that morph elements between positions. Accepts `fallback` transition for unmatched elements. Parameters: `delay`, `duration`, `easing`

All transitions return a `TransitionConfig` object with optional `delay`, `duration`, `easing`, `css`, and `tick` properties.

Common parameters across transitions: `delay` (number), `duration` (number or function), `easing` (EasingFunction - a function taking t: number returning number).