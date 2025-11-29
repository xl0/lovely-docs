PostGIS extends PostgreSQL with geospatial data support. Drizzle doesn't create extensions automatically, so manually create the PostGIS extension with a custom migration: `CREATE EXTENSION postgis;`

**Table Schema with Spatial Index:**
Define a table with `geometry` datatype using `geometry('location', { type: 'point', mode: 'xy', srid: 4326 })`. Add a spatial index using GIST: `index('spatial_index').using('gist', t.location)`.

**Inserting Geometry Data:**
Three insertion methods:
1. Mode 'xy': `location: { x: -90.9, y: 18.7 }`
2. Mode 'tuple': `location: [-90.9, 18.7]`
3. Raw SQL: `location: sql\`ST_SetSRID(ST_MakePoint(-90.9, 18.7), 4326)\``

**Finding Nearest Location:**
Use the `<->` operator for distance ordering and `ST_Distance()` function to calculate minimum planar distance. Query example: select all store columns plus distance, ordered by `<->` operator, limited to 1 result.

**Filtering by Rectangular Area:**
Use `ST_MakeEnvelope()` to create a rectangular polygon from min/max X and Y coordinates, and `ST_Within()` to check if a geometry is within that envelope. Example: `ST_Within(stores.location, ST_MakeEnvelope(x1, y1, x2, y2, srid))`