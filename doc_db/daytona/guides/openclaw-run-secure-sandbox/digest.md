## Setup and Run OpenClaw in Daytona Sandbox

Running OpenClaw in a Daytona sandbox provides isolation, security, and 24/7 uptime without consuming local machine resources.

### Prerequisites
- Daytona account and API key from Daytona Dashboard
- Local terminal (macOS, Linux, or Windows)

### Install CLI and Authenticate

Install Daytona CLI:
```bash
# Mac/Linux
brew install daytonaio/cli/daytona

# Windows
powershell -Command "irm https://get.daytona.io/windows | iex"
```

Verify version is 0.135.0 or higher:
```bash
daytona --version
```

Authenticate:
```bash
daytona login --api-key=YOUR_API_KEY
```

### Create and Connect to Sandbox

Create sandbox with OpenClaw preinstalled:
```bash
daytona sandbox create --name openclaw --snapshot daytona-medium --auto-stop 0
```

The `daytona-medium` snapshot is required (minimum 2GB memory for OpenClaw gateway). The `--auto-stop 0` flag keeps the sandbox running indefinitely.

SSH into sandbox:
```bash
daytona ssh openclaw
```

### Onboard OpenClaw

Start onboarding:
```bash
openclaw onboard
```

Follow prompts:
1. Accept security acknowledgment
2. Select **Quickstart** mode
3. Select **Anthropic** as model provider
4. Select **Anthropic API key** auth method
5. Paste your Anthropic API key
6. Keep default model (`anthropic/claude-opus-4-5`)
7. Skip channel configuration (configure later)
8. Skip skills configuration
9. Skip hooks configuration
10. Skip gateway service installation (already installed)

The onboarding output displays a dashboard link with a gateway token in the URL (after `?token=`). Save this token for dashboard authentication.

### Start Gateway and Access Dashboard

Start gateway in background:
```bash
nohup openclaw gateway run > /tmp/gateway.log 2>&1 &
```

Generate preview URL from local terminal (not SSH session):
```bash
daytona preview-url openclaw --port 18789
```

This creates a signed preview URL that expires after 1 hour (customizable with `--expires` flag). Open the URL in browser, go to **Overview**, paste your gateway token in the **Gateway Token** field, and click **Connect**.

### Device Pairing

OpenClaw requires device approval for security. List pending requests:
```bash
openclaw devices list
```

Approve your device:
```bash
openclaw devices approve REQUEST_ID
```

Click **Connect** again in dashboard. Green status indicator confirms OpenClaw is ready.

### Security Layers
1. **Preview URL:** Time-limited access to dashboard port
2. **Gateway token:** Required for dashboard authentication
3. **Device approval:** Only approved devices can control assistant

Keep gateway token and preview URL secret.

## Configure Telegram

Create bot via @BotFather in Telegram:
1. Send `/start`, then `/newbot`
2. Enter bot name and username
3. Copy the bot token

Configure OpenClaw:
```bash
openclaw config set channels.telegram.enabled true
openclaw config set channels.telegram.botToken YOUR_BOT_TOKEN
openclaw config get channels.telegram
```

Restart gateway:
```bash
openclaw gateway stop
nohup openclaw gateway run > /tmp/gateway.log 2>&1 &
```

Complete verification in Telegram:
1. Open bot chat and click **Start**
2. Copy pairing code and approve:
```bash
openclaw pairing approve telegram PAIRING_CODE
```

## Configure WhatsApp

Run configuration:
```bash
openclaw config --section channels
```

When prompted:
1. Select **Local (this machine)** for gateway location
2. Choose **Configure/link**
3. Select **WhatsApp (QR link)**
4. Select **Yes** for "Link WhatsApp now (QR)?"

Scan QR code in WhatsApp: **Settings → Linked Devices → Link a Device**

Select **This is my personal phone number** and enter phone number when prompted.

When prompted for another channel, choose **Finished**.

Start chatting: Send message to yourself in WhatsApp and OpenClaw responds. To allow other users, add their phone numbers to **Allow From** list in **Channels → WhatsApp** in dashboard.