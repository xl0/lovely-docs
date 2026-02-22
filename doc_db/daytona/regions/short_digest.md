## Regions

Specify sandbox execution region via `target` parameter: `"us"` or `"eu"` for shared regions, or custom regions using your own runners.

**Configuration:**
```python
# Python
config = DaytonaConfig(target="us")
daytona = Daytona(config)
```

```typescript
// TypeScript
const daytona = new Daytona({ target: "eu" });
```

**Region Types:**
- **Shared:** Managed by Daytona (`us`, `eu`), limits apply
- **Dedicated:** Exclusive to organization, contact sales
- **Custom:** Your own runners, no limits, full control