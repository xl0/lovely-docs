Reactive, type-safe URL search parameter management with schema validation, compression, debouncing, and history control. Supports Zod, Valibot, Arktype, or built-in schemas. Syncs across tabs/sessions.

**Basic usage:**
```ts
const schema = z.object({ page: z.coerce.number().default(1), filter: z.string().default("") });
const params = useSearchParams(schema);
params.page = 2; // Updates URL
params.update({ page: 3, filter: 'active' });
params.reset();
```

**Options:** `showDefaults`, `debounce`, `pushHistory`, `compress`, `compressedParamName`, `updateURL`, `noScroll`, `dateFormats`

**createSearchParamsSchema:** Lightweight alternative without external dependencies
```ts
const schema = createSearchParamsSchema({
  page: { type: "number", default: 1 },
  birthDate: { type: "date", default: new Date(), dateFormat: "date" }
});
```

**validateSearchParams:** Server-side validation in load functions
```ts
const { searchParams, data } = validateSearchParams(url, schema);
```

**Date formatting:** Control serialization with `dateFormat: "date"` (YYYY-MM-DD) or `"datetime"` (ISO8601)

**Zod codecs:** Custom serialization for Unix timestamps, compact IDs, or legacy formats
```ts
const unixTimestamp = z.codec(z.coerce.number(), z.date(), {
  decode: (ts) => new Date(ts * 1000),
  encode: (date) => Math.floor(date.getTime() / 1000)
});
```

**Reactivity:** Top-level only - `params.page = 2` works, `params.config.theme = 'dark'` doesn't