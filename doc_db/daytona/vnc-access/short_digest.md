## VNC Access

Browser-based graphical desktop for Daytona Sandbox, integrates with Computer Use for manual and automated interactions.

### Dashboard Access
Navigate to Daytona Sandboxes, click options menu (⋮), select VNC, click Connect.

### Programmatic Control
```python
# Start/stop/check VNC
sandbox.computer_use.start()
sandbox.computer_use.stop()
response = sandbox.computer_use.get_status()
```
```typescript
await sandbox.computerUse.start();
await sandbox.computerUse.stop();
const status = await sandbox.computerUse.getStatus();
```
```bash
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/start' --request POST
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/stop' --request POST
curl 'https://proxy.app.daytona.io/toolbox/{sandboxId}/computeruse/status'
```

### Automation
Once VNC running, automate mouse (click, move, drag, scroll), keyboard (type, press, hotkeys), screenshots (full/region/compressed), display info.

```python
sandbox.computer_use.start()
sandbox.computer_use.mouse.click(50, 50)
sandbox.computer_use.keyboard.type("https://www.daytona.io/docs/")
sandbox.computer_use.keyboard.press("Return")
screenshot = sandbox.computer_use.screenshot.take_full_screen()
```

### Custom Image Requirements
VNC packages: `xvfb`, `xfce4`, `xfce4-terminal`, `x11vnc`, `novnc`, `dbus-x11`
X11 libraries: `libx11-6`, `libxrandr2`, `libxext6`, `libxrender1`, `libxfixes3`, `libxss1`, `libxtst6`, `libxi6`