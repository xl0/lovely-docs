Access server-side runtime environment variables via `$env/dynamic/private`. Cannot be used in client code. Respects `config.kit.env.privatePrefix` configuration.

```ts
import { env } from '$env/dynamic/private';
console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
```