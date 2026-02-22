## ComputerUse

Manages VNC desktop processes and provides interfaces for mouse, keyboard, screenshot, display, and recording operations.

### Key Methods

- `start()` / `stop()` - Control all VNC processes
- `status()` / `get_process_status(name)` - Check process status
- `restart_process(name)` - Restart specific process
- `get_process_logs(name)` / `get_process_errors(name)` - Retrieve logs

### Interaction Interfaces

- `mouse()`, `keyboard()`, `screenshot()`, `display()`, `recording()`

```ruby
sandbox.computer_use.start
sandbox.computer_use.get_process_status("xvfb")
sandbox.computer_use.restart_process("xfce4")
logs = sandbox.computer_use.get_process_logs("novnc")
```