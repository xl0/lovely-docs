## Prerequisites
- Daytona account and API key from Daytona Dashboard
- Local terminal (macOS, Linux, or Windows)

## Install CLI

Mac/Linux:
```bash
brew install daytonaio/cli/daytona
```

Windows:
```powershell
powershell -Command "irm https://get.daytona.io/windows | iex"
```

Verify version is 0.135.0 or higher with `daytona --version`.

## Authenticate

```bash
daytona login --api-key=YOUR_API_KEY
```

## Create Sandbox

```bash
daytona sandbox create --name claude-sandbox
```

Optional flags:
- `--snapshot daytona-large` or `--snapshot daytona-medium` for more resources

## Connect to Sandbox

```bash
daytona ssh claude-sandbox
```

## Run Claude Code

Inside the SSH session:
```bash
claude
```

On first run, Claude Code prompts for authentication:
1. Copy the authentication URL from terminal
2. Open URL in local browser
3. Complete authentication flow
4. Copy the code from browser
5. Paste code back into terminal

Once authenticated, Claude Code runs inside the sandbox controlled from your terminal.