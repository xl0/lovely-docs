## Network Limits

Tier-based automatic network restrictions (Tier 1-2: restricted, Tier 3-4: full access). Configure per-sandbox with `networkAllowList` (up to 5 CIDR blocks) or `networkBlockAll` parameters. Essential services (npm, git, docker, PyPI, etc.) whitelisted on all tiers. `networkBlockAll` takes precedence if both parameters specified.