## Configuration Methods (in precedence order)

1. **Code** - `DaytonaConfig` class with `api_key`, `api_url`, `target`
2. **Environment variables** - `DAYTONA_API_KEY`, `DAYTONA_API_URL`, `DAYTONA_TARGET`
3. **.env file** - Set variables in `.env`
4. **Defaults** - API URL: `https://app.daytona.io/api`, Target: organization default

Supports Python, TypeScript, Ruby, Go SDKs with language-specific syntax.