## VPN Connections

Connect Daytona Sandboxes to private networks via VPN, enabling access to private IP resources and allowing other devices on the VPN to access the sandbox. Requires Tier 3+ account and VPN provider credentials.

### Tailscale

Three connection methods:

**Browser Login (Interactive)**
- Install Tailscale, start daemon, run `tailscale up` to get login URL
- Visit URL in browser to authenticate
- Poll `tailscale status` until connected, verify with `tailscale ip -4`

Python example:
```python
from daytona import Daytona, DaytonaConfig
import time, re

config = DaytonaConfig(api_key="YOUR_API_KEY")
daytona = Daytona(config)
sandbox = daytona.create()

# Install and start
sandbox.process.exec("curl -fsSL https://tailscale.com/install.sh | sh", timeout=300)
sandbox.process.exec("nohup sudo tailscaled > /dev/null 2>&1 &", timeout=10)
time.sleep(3)

# Get login URL
sandbox.process.exec("sudo tailscale up > /tmp/tailscale-login.txt 2>&1 &", timeout=10)
time.sleep(3)
response = sandbox.process.exec("cat /tmp/tailscale-login.txt", timeout=10)
url_match = re.search(r'https://login\.tailscale\.com/a/[^\s]+', response.result)
if url_match:
    print(f"Visit: {url_match.group(0)}")
    
    # Poll for connection
    for _ in range(60):  # 5 min max
        time.sleep(5)
        status = sandbox.process.exec("tailscale status 2>&1", timeout=30)
        if status.exit_code == 0 and "logged out" not in status.result.lower():
            ip = sandbox.process.exec("tailscale ip -4 2>&1", timeout=10)
            if ip.exit_code == 0 and ip.result.strip():
                print(f"Connected! IP: {ip.result.strip()}")
                break
```

TypeScript equivalent uses `sandbox.process.executeCommand()` with same logic.

**Auth Key (Non-Interactive)**
- Generate auth key from Tailscale admin console (Add device → Linux server → Generate install script)
- Extract `tskey-auth-<AUTH_KEY>` from script
- Install and connect: `curl -fsSL https://tailscale.com/install.sh | sh && sudo tailscale up --auth-key=tskey-auth-<AUTH_KEY>`

Python:
```python
TAILSCALE_AUTH_KEY = "YOUR_AUTH_KEY"
sandbox = daytona.create()
sandbox.process.exec("curl -fsSL https://tailscale.com/install.sh | sh", timeout=300)
sandbox.process.exec("nohup sudo tailscaled > /dev/null 2>&1 &", timeout=10)
time.sleep(3)
sandbox.process.exec(f"sudo tailscale up --auth-key={TAILSCALE_AUTH_KEY}", timeout=60)
sandbox.process.exec("tailscale status", timeout=30)
```

**Web Terminal**
- Use Daytona Dashboard terminal or SSH access
- Install: `curl -fsSL https://tailscale.com/install.sh | sh`
- Run daemon in tmux: `tmux new -d -s tailscale 'sudo tailscaled'`
- Authenticate: `sudo tailscale up` → visit URL → confirm "Your device <id> is logged in to the <address> tailnet"

### OpenVPN

Two connection methods:

**Client Configuration File**
Required file format (`client.ovpn`):
```
client
proto udp
explicit-exit-notify
remote <YOUR_OPENVPN_SERVER_IP> <YOUR_OPENVPN_SERVER_PORT>
dev tun
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
verify-x509-name <YOUR_OPENVPN_SERVER_NAME> name
auth SHA256
auth-nocache
cipher AES-128-GCM
ignore-unknown-option data-ciphers
data-ciphers AES-128-GCM
ncp-ciphers AES-128-GCM
tls-client
tls-version-min 1.2
tls-cipher TLS-ECDHE-ECDSA-WITH-AES-128-GCM-SHA256
tls-ciphersuites TLS_AES_256_GCM_SHA384:TLS_AES_128_GCM_SHA256:TLS_CHACHA20_POLY1305_SHA256
ignore-unknown-option block-outside-dns
setenv opt block-outside-dns
verb 3
<ca>
-----BEGIN CERTIFICATE-----
<YOUR_OPENVPN_SERVER_CERTIFICATE>
-----END CERTIFICATE-----
</ca>
<cert>
-----BEGIN CERTIFICATE-----
<YOUR_OPENVPN_CLIENT_CERTIFICATE>
-----END CERTIFICATE-----
</cert>
<key>
-----BEGIN PRIVATE KEY-----
<YOUR_OPENVPN_CLIENT_PRIVATE_KEY>
-----END PRIVATE KEY-----
</key>
<tls-crypt-v2>
-----BEGIN OpenVPN tls-crypt-v2 client key-----
<YOUR_OPENVPN_TLS_CRYPT_V2_CLIENT_KEY>
-----END OpenVPN tls-crypt-v2 client key-----
</tls-crypt-v2>
```

**Programmatic Connection**

Python:
```python
from daytona import Daytona, DaytonaConfig
import time

OPENVPN_CONFIG = """<your config content>"""
config = DaytonaConfig(api_key="YOUR_API_KEY")
daytona = Daytona(config)
sandbox = daytona.create()

# Install
sandbox.process.exec("sudo apt update && sudo apt install -y openvpn", timeout=120)

# Write config
sandbox.fs.upload_file(OPENVPN_CONFIG.encode(), "/home/daytona/client.ovpn")

# Start tunnel
sandbox.process.exec("nohup sudo openvpn /home/daytona/client.ovpn > /tmp/openvpn.log 2>&1 &", timeout=10)
time.sleep(10)

# Verify
sandbox.process.exec("ip addr show tun0", timeout=10)  # Check tunnel interface
sandbox.process.exec("curl -s ifconfig.me", timeout=30)  # Check public IP through VPN
```

TypeScript uses `sandbox.process.executeCommand()` and heredoc for config file:
```typescript
await sandbox.process.executeCommand(
  `cat << 'OVPNEOF' > /home/daytona/client.ovpn\n${ovpnConfig}\nOVPNEOF`,
  undefined, undefined, 30
);
```

**Web Terminal**
- Install: `sudo apt update && sudo apt install -y openvpn tmux`
- Create config: `sudo nano client.ovpn` (paste content, Ctrl+O, Enter, Ctrl+X)
- Run in background: `tmux new -d -s openvpn 'sudo openvpn client.ovpn'`
- Verify: `curl ifconfig.me`
