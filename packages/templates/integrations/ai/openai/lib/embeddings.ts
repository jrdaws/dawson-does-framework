import { openai } from "./openai";

const EMBEDDING_MODEL = "text-embedding-3-small";

/**
 * Generate embeddings for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.data.map((d) => d.embedding);
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Embeddings must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Find the most similar items from a list of embeddings
 */
export function findMostSimilar(
  queryEmbedding: number[],
  embeddings: { id: string; embedding: number[] }[],
  topK = 5
): { id: string; score: number }[] {
  const scores = embeddings.map((item) => ({
    id: item.id,
    score: cosineSimilarity(queryEmbedding, item.embedding),
  }));

  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, topK);
}

