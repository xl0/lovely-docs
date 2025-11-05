Debug Svelte and SvelteKit projects using breakpoints in various tools and development environments for both frontend and backend code.

**Visual Studio Code**
- Debug Terminal: Open command palette (CMD/Ctrl + Shift + P), launch "Debug: JavaScript Debug Terminal", start your project with `npm run dev`, set breakpoints, trigger them.
- Launch Configuration: Create `.vscode/launch.json` with a Node.js launch configuration to debug via the Run and Debug pane with F5.

Example `launch.json`:
```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"command": "npm run dev",
			"name": "Run development server",
			"request": "launch",
			"type": "node-terminal"
		}
	]
}
```

**Other Editors**
Community guides available for WebStorm and Neovim.

**Browser DevTools (Chrome/Edge)**
Debug Node.js applications using browser-based debugger (client-side source maps only):
1. Run `NODE_OPTIONS="--inspect" npm run dev`
2. Open site at `localhost:5173`
3. Open browser dev tools and click "Open dedicated DevTools for Node.js" icon
4. Set breakpoints and debug

Alternatively navigate to `chrome://inspect` or `edge://inspect`.