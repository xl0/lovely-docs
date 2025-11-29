## drizzle-graphql

Generate a GraphQL server from a Drizzle schema with `buildSchema()` in one line, then optionally customize it.

### Requirements
- drizzle-orm version 0.30.9 or later

### Quick Start

**Apollo Server setup:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import * as dbSchema from './schema';

const db = drizzle({ client, schema: dbSchema });
const { schema } = buildSchema(db);
const server = new ApolloServer({ schema });
const { url } = await startStandaloneServer(server);
console.log(`🚀 Server ready at ${url}`);
```

**GraphQL Yoga setup:**
```ts
import { buildSchema } from 'drizzle-graphql';
import { drizzle } from 'drizzle-orm/...';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import * as dbSchema from './schema';

const db = drizzle({ schema: dbSchema });
const { schema } = buildSchema(db);
const yoga = createYoga({ schema });
const server = createServer(yoga);
server.listen(4000, () => console.info('Server is running on http://localhost:4000/graphql'));
```

Both examples use the same Drizzle schema with users and posts tables with relations.

### Customization

`buildSchema()` returns both `schema` (ready-to-use GraphQL schema) and `entities` (for custom building).

Use `entities` to build a custom GraphQL schema with selective queries/mutations:
```ts
import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema } from 'graphql';

const { entities } = buildSchema(db);

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: entities.queries.users,
      customer: entities.queries.customersSingle,
      customUsers: {
        type: new GraphQLList(new GraphQLNonNull(entities.types.UsersItem)),
        args: {
          where: { type: entities.inputs.UsersFilters }
        },
        resolve: async (source, args, context, info) => {
          // Custom logic here
          return await db.select(schema.users).where()...
        },
      },
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: entities.mutations,
  }),
  types: [...Object.values(entities.types), ...Object.values(entities.inputs)],
});
```

The `entities` object contains:
- `entities.queries` - auto-generated query fields
- `entities.mutations` - auto-generated mutation fields
- `entities.types` - GraphQL object types for tables
- `entities.inputs` - GraphQL input types for filters

`buildSchema()` uses standard GraphQL SDK, so output is compatible with any GraphQL library.