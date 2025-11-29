## ESLint Plugin

Install `eslint-plugin-drizzle` with `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser`.

Configure in `.eslintrc.yml`:
```yml
extends:
  - "plugin:drizzle/recommended"
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
```

**Rules:**

- `enforce-delete-with-where`: Requires `.where()` on `.delete()` calls
- `enforce-update-with-where`: Requires `.where()` on `.update()` calls

Both support optional `drizzleObjectName` config to specify which objects trigger the rule:
```yml
rules:
  'drizzle/enforce-delete-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

This prevents false positives from non-Drizzle delete/update methods.