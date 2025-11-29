## Seed Generators

Generator functions for creating test data:

**Basic**: `default`, `valuesFromArray`, `intPrimaryKey`

**Numeric**: `number` (float), `int` (with min/max/unique options)

**Temporal**: `date`, `time`, `timestamp`, `datetime`, `year`, `interval`

**Data**: `json`, `string`, `uuid`

**Person**: `firstName`, `lastName`, `fullName`, `email`, `phoneNumber`

**Location**: `country`, `city`, `streetAddress`, `state`, `postcode`

**Business**: `jobTitle`, `companyName`, `loremIpsum`

**Geometric**: `point` (2D), `line` (2D equation)

Most support `isUnique` and `arraySize` parameters. When both are used, unique values are generated then packed into arrays.