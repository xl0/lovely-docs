## Seed Generators Reference

Complete reference for all generator functions available in drizzle-seed for generating test data.

### Core Generators

**`default`** - Generates the same value repeatedly. Supports `defaultValue` (any) and `arraySize` (number).

**`valuesFromArray`** - Picks values from a provided array. Parameters: `values` (array or weighted array), `isUnique` (boolean, defaults to column uniqueness), `arraySize` (number). Supports weighted values via `{ weight: number; values: any[] }[]` format.

**`intPrimaryKey`** - Generates sequential integers starting from 1. No parameters.

### Numeric Generators

**`number`** - Generates floating-point numbers. Parameters: `minValue`, `maxValue` (defaults: `precision * 1000` if not unique, `precision * count` if unique), `precision` (default: 100), `isUnique`, `arraySize`.

**`int`** - Generates integers. Parameters: `minValue`, `maxValue` (defaults: 1000 if not unique, `count * 10` if unique), `isUnique`, `arraySize`. Supports `number | bigint` types.

### Boolean & Temporal Generators

**`boolean`** - Generates true/false values. Only parameter: `arraySize`.

**`date`** - Generates dates within range. Parameters: `minDate` (default: 2020-05-08), `maxDate` (default: 2028-05-08), `arraySize`. If only one date is provided, the other is calculated by adding/subtracting 8 years.

**`time`** - Generates 24-hour format times. Only parameter: `arraySize`.

**`timestamp`** - Generates timestamps. Only parameter: `arraySize`.

**`datetime`** - Generates datetime objects. Only parameter: `arraySize`.

**`year`** - Generates years in YYYY format. Only parameter: `arraySize`.

**`interval`** - Generates time intervals (e.g., "1 year 12 days 5 minutes"). Parameters: `isUnique`, `arraySize`.

### Data Type Generators

**`json`** - Generates JSON objects with fixed structures. Randomly picks between structures like `{ email, name, isGraduated, hasJob, salary, startedWorking, visitedCountries }` or `{ email, name, isGraduated, hasJob, visitedCountries }`. Only parameter: `arraySize`.

**`string`** - Generates random strings. Parameters: `isUnique`, `arraySize`.

**`uuid`** - Generates v4 UUID strings. Only parameter: `arraySize`.

### Person & Location Generators

**`firstName`** - Generates first names. Parameters: `isUnique`, `arraySize`.

**`lastName`** - Generates last names. Parameters: `isUnique`, `arraySize`.

**`fullName`** - Generates full names. Parameters: `isUnique`, `arraySize`.

**`email`** - Generates unique email addresses. Only parameter: `arraySize`.

**`phoneNumber`** - Generates unique phone numbers. Three modes:
- Template mode: `template` parameter with '#' replaced by digits (e.g., "+(380) ###-####")
- Prefix mode: `prefixes` array and `generatedDigitsNumbers` (number or array matching prefix count)
- Default uses built-in dataset for prefixes with 7 generated digits
Parameter: `arraySize`.

**`country`** - Generates country names. Parameters: `isUnique`, `arraySize`.

**`city`** - Generates city names. Parameters: `isUnique`, `arraySize`.

**`streetAddress`** - Generates street addresses. Parameters: `isUnique`, `arraySize`.

**`state`** - Generates US state names. Only parameter: `arraySize`.

**`postcode`** - Generates postal codes. Parameters: `isUnique`, `arraySize`.

### Business & Content Generators

**`jobTitle`** - Generates job titles. Only parameter: `arraySize`.

**`companyName`** - Generates company names. Parameters: `isUnique`, `arraySize`.

**`loremIpsum`** - Generates lorem ipsum text. Parameters: `sentencesCount` (default: 1), `arraySize`.

### Geometric Generators

**`point`** - Generates 2D points. Parameters: `isUnique`, `minXValue`, `maxXValue` (defaults: `10 * 1000` if not unique, `10 * count` if unique), `minYValue`, `maxYValue` (same defaults as X), `arraySize`.

**`line`** - Generates 2D lines using equation `a*x + b*y + c = 0`. Parameters: `isUnique`, `minAValue`, `maxAValue`, `minBValue`, `maxBValue`, `minCValue`, `maxCValue` (all with same defaults as point), `arraySize`.

### Important Notes

- When `arraySize` is specified, arrays are generated with that many elements
- When both `arraySize` and `isUnique` are specified together, unique values are generated and then packed into arrays (not unique arrays)
- Most generators support `isUnique` parameter which defaults to the database column's uniqueness constraint
- All generators can be used within the `refine()` callback of `seed()` function