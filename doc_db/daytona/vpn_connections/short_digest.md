## VPN Connections

Connect sandboxes to private networks via Tailscale or OpenVPN (requires Tier 3+).

**Tailscale:**
- Browser login: Install, start daemon, run `tailscale up`, visit URL, poll status
- Auth key: Install, run `sudo tailscale up --auth-key=tskey-auth-<KEY>`
- Web terminal: Install, run daemon in tmux, `sudo tailscale up`, visit URL

**OpenVPN:**
- Programmatic: Install, upload `client.ovpn` config, run `sudo openvpn client.ovpn` in background, verify with `ip addr show tun0` and `curl ifconfig.me`
- Web terminal: Install, create config with nano, run in tmux, verify IP

Python/TypeScript SDKs provided for both methods.
