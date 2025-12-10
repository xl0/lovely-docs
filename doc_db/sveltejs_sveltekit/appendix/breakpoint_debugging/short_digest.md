## VSCode

Debug Terminal: `CMD/Ctrl+Shift+P` → "Debug: JavaScript Debug Terminal" → `npm run dev` → set breakpoints

Or use `.vscode/launch.json` with `"type": "node-terminal"` and start via "Run and Debug" pane with `F5`

## Browser DevTools

`NODE_OPTIONS="--inspect" npm run dev` → open `localhost:5173` → click Node.js logo in dev tools → set breakpoints

Navigate to `chrome://inspect` or `edge://inspect` as alternative