## Vector Similarity Search with pgvector

Implement semantic search in PostgreSQL using the pgvector extension with Drizzle ORM to find similar content based on vector embeddings.

### Setup

1. Create the pgvector extension manually via a custom migration:
```bash
npx drizzle-kit generate --custom
```
```sql
CREATE EXTENSION vector;
```

2. Define a table with a vector column and HNSW or IVFFlat index:
```ts
import { index, pgTable, serial, text, vector } from 'drizzle-orm/pg-core';

export const guides = pgTable(
  'guides',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    url: text('url').notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
  },
  (table) => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
  ]
);
```

The embedding column stores vector representations of text data, enabling mathematical operations to measure similarity between items.

### Generating Embeddings

Use OpenAI's embedding model to convert text to vectors:
```ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\n', ' ');
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input,
  });
  return data[0].embedding;
};
```

### Similarity Search Query

Use `cosineDistance` function with `gt` and `sql` operators to find similar records:
```ts
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { generateEmbedding } from './embedding';
import { guides } from './schema';

const db = drizzle(...);

const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;

  const similarGuides = await db
    .select({ name: guides.title, url: guides.url, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  return similarGuides;
};

const description = 'Guides on using Drizzle ORM with different platforms';
const similarGuides = await findSimilarGuides(description);
// Returns: [{ name: 'Drizzle with Turso', url: '...', similarity: 0.864 }, ...]
```

### Requirements
- PostgreSQL with pgvector extension
- OpenAI package for generating embeddings
- drizzle-orm@0.31.0+ and drizzle-kit@0.22.0+