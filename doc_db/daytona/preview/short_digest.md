## Preview Links

Two approaches for preview URLs:

**Standard Preview URL** (`https://{port}-{sandboxId}.{daytonaProxyDomain}`): Token sent via `x-daytona-preview-token` header. Resets on sandbox restart. For programmatic access.

```python
preview_info = sandbox.get_preview_link(3000)
requests.get(preview_info.url, headers={"x-daytona-preview-token": preview_info.token})
```

**Signed Preview URL** (`https://{port}-{token}.{daytonaProxyDomain}`): Token embedded in URL, no headers needed. Custom expiry (default 60s), persists across restarts, manually revocable. For sharing/embedding.

```python
signed_url = sandbox.create_signed_preview_url(3000, expires_in_seconds=3600)
requests.get(signed_url.url)
sandbox.expire_signed_preview_url(3000, signed_url.token)
```

Public sandboxes don't require authentication. Browser warning page can be skipped with header, Tier 3 upgrade, or custom proxy.