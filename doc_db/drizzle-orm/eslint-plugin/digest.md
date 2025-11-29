## ESLint Plugin for Drizzle

An ESLint plugin that provides rules for catching common mistakes during development that are difficult to enforce through TypeScript's type system.

### Installation

Install the plugin along with TypeScript ESLint dependencies:
```
eslint-plugin-drizzle
@typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### Configuration

Add to `.eslintrc.yml`:
```yml
root: true
parser: '@typescript-eslint/parser'
parserOptions:
  project: './tsconfig.json'
plugins:
  - drizzle
rules:
  'drizzle/enforce-delete-with-where': "error"
  'drizzle/enforce-update-with-where': "error"
```

Use the `recommended` or `all` config (currently equivalent):
```yml
extends:
  - "plugin:drizzle/recommended"
```

### Rules

**enforce-delete-with-where**

Requires `.where()` clause on `.delete()` statements to prevent accidental deletion of all table rows.

Optional `drizzleObjectName` config accepts `string` or `string[]` to specify which objects trigger the rule. Without this, any `.delete()` call triggers it. With it, only delete calls on specified objects (like `db`) trigger the rule:

```yml
rules:
  'drizzle/enforce-delete-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public delete() { return {} }
}

const myClassObj = new MyClass();
myClassObj.delete()  // OK - not triggered

const db = drizzle(...)
db.delete()  // ERROR - triggered
db.delete().where(...)  // OK
```

**enforce-update-with-where**

Requires `.where()` clause on `.update()` statements to prevent accidental updates to all table rows.

Same optional `drizzleObjectName` configuration as `enforce-delete-with-where`:

```yml
rules:
  'drizzle/enforce-update-with-where':
    - "error"
    - drizzleObjectName: ["db"]
```

```ts
class MyClass {
  public update() { return {} }
}

const myClassObj = new MyClass();
myClassObj.update()  // OK - not triggered

const db = drizzle(...)
db.update()  // ERROR - triggered
db.update().set({...}).where(...)  // OK
```