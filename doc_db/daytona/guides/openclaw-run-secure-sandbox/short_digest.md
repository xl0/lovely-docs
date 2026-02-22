## OpenClaw in Daytona Sandbox

Install CLI, authenticate with API key, create sandbox with `daytona sandbox create --name openclaw --snapshot daytona-medium --auto-stop 0`, SSH in, run `openclaw onboard` (select Quickstart, Anthropic provider, skip channels/skills/hooks), start gateway with `nohup openclaw gateway run > /tmp/gateway.log 2>&1 &`, generate preview URL with `daytona preview-url openclaw --port 18789`, approve device with `openclaw devices approve REQUEST_ID`.

**Telegram:** Create bot via @BotFather, set token with `openclaw config set channels.telegram.botToken TOKEN`, restart gateway, approve pairing with `openclaw pairing approve telegram CODE`.

**WhatsApp:** Run `openclaw config --section channels`, select Local/Configure/WhatsApp QR, scan QR code in WhatsApp settings, select personal phone number, choose Finished. Add other users' phone numbers to Allow From list in dashboard.