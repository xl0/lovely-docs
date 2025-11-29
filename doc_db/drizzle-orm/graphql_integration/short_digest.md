## drizzle-graphql

Generate a GraphQL server from Drizzle schema with `buildSchema(db)` and optionally customize it.

**Apollo Server:**
```ts
const { schema } = buildSchema(db);
const server = new ApolloServer({ schema });
await startStandaloneServer(server);
```

**GraphQL Yoga:**
```ts
const { schema } = buildSchema(db);
const yoga = createYoga({ schema });
createServer(yoga).listen(4000);
```

**Custom schema** using `entities`:
```ts
const { entities } = buildSchema(db);
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      users: entities.queries.users,
      customUsers: {
        type: new GraphQLList(entities.types.UsersItem),
        args: { where: { type: entities.inputs.UsersFilters } },
        resolve: async (source, args) => { /* custom logic */ }
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

Requires drizzle-orm 0.30.9+. Output uses standard GraphQL SDK.