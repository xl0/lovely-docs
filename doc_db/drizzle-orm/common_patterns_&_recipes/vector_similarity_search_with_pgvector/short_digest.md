## Vector Similarity Search with pgvector

Create pgvector extension manually, define table with vector column and HNSW index, generate embeddings with OpenAI, then query similar records using `cosineDistance`:

```ts
// Schema with vector column
export const guides = pgTable('guides', {
  id: serial('id').primaryKey(),
  embedding: vector('embedding', { dimensions: 1536 }),
}, (table) => [
  index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
]);

// Generate embeddings
const generateEmbedding = async (value: string) => {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: value.replaceAll('\n', ' '),
  });
  return data[0].embedding;
};

// Search similar records
const findSimilarGuides = async (description: string) => {
  const embedding = await generateEmbedding(description);
  const similarity = sql<number>`1 - (${cosineDistance(guides.embedding, embedding)})`;
  return db.select({ name: guides.title, similarity })
    .from(guides)
    .where(gt(similarity, 0.5))
    .orderBy(desc(similarity))
    .limit(4);
};
```