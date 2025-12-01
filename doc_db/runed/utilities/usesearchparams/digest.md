## useSearchParams

Reactive, type-safe, schema-driven management of URL search parameters in Svelte/SvelteKit. Automatically syncs parameters across tabs and sessions, validates against a schema, and provides direct property access with automatic URL updates.

### Core Features

- **Schema Validation**: Define types, defaults, and structure using Standard Schema (Zod, Valibot, Arktype, or built-in createSearchParamsSchema)
- **Type Safety**: All values parsed and validated to schema types
- **Default Values**: Missing params auto-filled with defaults
- **Compression**: Store all params in single compressed `_data` param for cleaner URLs
- **Debounce**: Optionally debounce updates to avoid cluttering browser history
- **History Control**: Choose between push (new history entry) or replace state
- **In-memory Mode**: Keep params in memory without updating URL
- **Invalid Param Handling**: Invalid values replaced with defaults and removed from URL
- **Date Formatting**: Control how Date parameters serialize (YYYY-MM-DD or ISO8601)
- **Custom Serialization**: Use Zod codecs for complete control over type conversions

### Basic Usage

```ts
// Define schema with Zod
const productSearchSchema = z.object({
  page: z.coerce.number().default(1),
  filter: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest")
});

// In component
const params = useSearchParams(productSearchSchema);
const page = $derived(params.page); // number (defaults to 1)
params.page = 2; // Updates URL to ?page=2
params.update({ page: 3, sort: 'oldest' }); // Update multiple at once
params.reset(); // Reset to defaults
params.toURLSearchParams(); // Get URLSearchParams object
```

### Options

- `showDefaults` (boolean): Show parameters with default values in URL (default: false)
- `debounce` (number): Milliseconds to delay URL updates (default: 0)
- `pushHistory` (boolean): Create new history entries on update (default: true)
- `compress` (boolean): Compress all params into single `_data` param (default: false)
- `compressedParamName` (string): Custom name for compressed param (default: '_data')
- `updateURL` (boolean): Update URL when params change (default: true)
- `noScroll` (boolean): Preserve scroll position on URL update (default: false)
- `dateFormats` (object): Map field names to 'date' (YYYY-MM-DD) or 'datetime' (ISO8601) format

```ts
const params = useSearchParams(schema, {
  showDefaults: true,
  debounce: 300,
  pushHistory: false,
  compress: true,
  compressedParamName: '_compressed',
  dateFormats: { birthDate: 'date', createdAt: 'datetime' }
});
```

### createSearchParamsSchema

Lightweight schema creator without external dependencies. Supports basic types with defaults, arrays, objects, and dates.

```ts
const schema = createSearchParamsSchema({
  page: { type: "number", default: 1 },
  filter: { type: "string", default: "" },
  tags: { type: "array", default: ["new"], arrayType: "" },
  config: { type: "object", default: { theme: "light" }, objectType: { theme: "" } },
  birthDate: { type: "date", default: new Date("1990-01-15"), dateFormat: "date" },
  createdAt: { type: "date", default: new Date(), dateFormat: "datetime" }
});
```

Limitations: No nested validation, no custom rules, no granular reactivity for nested properties (must reassign entire value).

### validateSearchParams

Server-side utility to extract and validate URL search parameters without modifying the URL. Works in SvelteKit load functions.

```ts
export const load = ({ url, fetch }) => {
  const { searchParams, data } = validateSearchParams(url, productSearchSchema, {
    compressedParamName: "_compressed",
    dateFormats: { birthDate: "date", createdAt: "datetime" }
  });
  const response = await fetch(`/api/products?${searchParams.toString()}`);
  return { products: await response.json() };
};
```

### Date Formatting

Two approaches to control Date serialization:

**Option 1: Schema property**
```ts
const schema = createSearchParamsSchema({
  birthDate: { type: "date", default: new Date("1990-01-15"), dateFormat: "date" },
  createdAt: { type: "date", default: new Date(), dateFormat: "datetime" }
});
```

**Option 2: useSearchParams option**
```ts
const params = useSearchParams(zodSchema, {
  dateFormats: { birthDate: "date", createdAt: "datetime" }
});
```

- `'date'` format: YYYY-MM-DD (e.g., 2025-10-21), parsed as midnight UTC
- `'datetime'` format (default): Full ISO8601 (e.g., 2025-10-21T18:18:14.196Z)

### Zod Codecs (Advanced)

For complete control over serialization, use Zod codecs (v4.1.0+) to define custom bidirectional transformations:

```ts
// Unix timestamp codec
const unixTimestampCodec = z.codec(
  z.coerce.number(),
  z.date(),
  {
    decode: (timestamp) => new Date(timestamp * 1000),
    encode: (date) => Math.floor(date.getTime() / 1000)
  }
);

// Date-only codec
const dateOnlyCodec = z.codec(
  z.string(),
  z.date(),
  {
    decode: (str) => new Date(str + "T00:00:00.000Z"),
    encode: (date) => date.toISOString().split("T")[0]
  }
);

// Compact ID codec (base36)
const compactIdCodec = z.codec(
  z.string(),
  z.number(),
  {
    decode: (str) => parseInt(str, 36),
    encode: (num) => num.toString(36)
  }
);

const schema = z.object({
  query: z.string().default(""),
  createdAfter: unixTimestampCodec.default(new Date("2024-01-01")),
  birthDate: dateOnlyCodec.default(new Date("1990-01-15")),
  productId: compactIdCodec.optional()
});

const params = useSearchParams(schema);
```

Codecs work automatically with `validateSearchParams` on the server.

### Reactivity Limitations

**Top-level reactivity only** - direct property assignment works, nested mutations don't:

✅ Works:
```ts
params.page = 2;
params.config = { theme: "dark", size: "large" };
params.items = [...params.items, newItem];
```

❌ Doesn't work:
```ts
params.config.theme = "dark"; // Nested property mutation
params.items.push(newItem); // Array method
params.items[0].name = "updated"; // Array item property
delete params.config.oldProp; // Property deletion
```

This design prioritizes simplicity, type safety, and performance over deep reactivity.

### Schema Examples

**Zod:**
```ts
const schema = z.object({
  page: z.number().default(1),
  filter: z.string().default(""),
  sort: z.enum(["newest", "oldest", "price"]).default("newest")
});
```

**Valibot:**
```ts
const schema = v.object({
  page: v.optional(v.fallback(v.number(), 1), 1),
  filter: v.optional(v.fallback(v.string(), ""), ""),
  sort: v.optional(v.fallback(v.picklist(["newest", "oldest", "price"]), "newest"), "newest")
});
```

**Arktype:**
```ts
const schema = type({
  page: "number = 1",
  filter: 'string = ""',
  sort: '"newest" | "oldest" | "price" = "newest"'
});
```

### URL Storage Format

- Arrays: JSON strings `?tags=["sale","featured"]`
- Objects: JSON strings `?config={"theme":"dark","fontSize":14}`
- Dates: ISO8601 `?createdAt=2023-12-01T10:30:00.000Z` or date-only `?birthDate=2023-12-01`
- Primitives: Direct `?page=2&filter=red`

### Type Definitions

`SearchParamsOptions` interface defines all configuration options. `ReturnUseSearchParams<Schema>` provides typed reactive params plus `update()`, `reset()`, and `toURLSearchParams()` methods. `SchemaTypeConfig` defines schema field types for `createSearchParamsSchema`.