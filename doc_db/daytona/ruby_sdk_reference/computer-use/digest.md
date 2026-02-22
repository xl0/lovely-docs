## ComputerUse

Class for controlling VNC desktop processes and computer interaction in a sandbox.

### Constructor

```ruby
ComputerUse.new(sandbox_id:, toolbox_api:, otel_state:)
```

### Properties

- `sandbox_id()` - Returns the sandbox ID
- `toolbox_api()` - Returns the API client for sandbox operations

### Desktop Control

- `start()` - Starts all VNC processes (Xvfb, xfce4, x11vnc, novnc)
- `stop()` - Stops all VNC processes
- `status()` - Gets status of all VNC processes
- `restart_process(process_name:)` - Restarts a specific process (e.g., "xvfb", "xfce4", "x11vnc", "novnc")
- `get_process_status(process_name:)` - Gets status of a specific process
- `get_process_logs(process_name:)` - Gets logs for a specific process
- `get_process_errors(process_name:)` - Gets error logs for a specific process

### Interaction Interfaces

- `mouse()` - Returns Mouse operations interface
- `keyboard()` - Returns Keyboard operations interface
- `screenshot()` - Returns Screenshot operations interface
- `display()` - Returns Display operations interface
- `recording()` - Returns Screen recording operations interface

### Examples

```ruby
# Start/stop desktop
result = sandbox.computer_use.start
puts "Computer use processes started: #{result.message}"

result = sandbox.computer_use.stop
puts "Computer use processes stopped: #{result.message}"

# Check status
response = sandbox.computer_use.status
puts "Computer use status: #{response.status}"

# Manage specific processes
xvfb_status = sandbox.computer_use.get_process_status("xvfb")
novnc_status = sandbox.computer_use.get_process_status("novnc")

result = sandbox.computer_use.restart_process("xfce4")
puts "XFCE4 process restarted: #{result.message}"

# Get process logs
logs = sandbox.computer_use.get_process_logs("novnc")
errors = sandbox.computer_use.get_process_errors("x11vnc")
```

All methods raise `Daytona:Sdk:Error` on failure.