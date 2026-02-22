## Setup
Install CLI (`brew install daytonaio/cli/daytona` on Mac/Linux, PowerShell script on Windows), authenticate with `daytona login --api-key=YOUR_API_KEY`, create sandbox with `daytona sandbox create --name claude-sandbox` (add `--snapshot daytona-large/medium` for more resources).

## Run Claude Code
SSH into sandbox: `daytona ssh claude-sandbox`, then run `claude`. Authenticate on first run by copying the URL to browser, completing auth flow, and pasting the code back to terminal.