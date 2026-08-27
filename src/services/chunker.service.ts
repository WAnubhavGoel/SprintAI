// Splits a large text into 600-word chunks with 50-word overlap between each chunk.
// Overlap ensures context is not lost at chunk boundaries during embedding + RAG retrieval.
export function chunkText(text: string): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const chunks: string[] = [];
  const CHUNK_SIZE = 600;
  const OVERLAP = 50;

  let i = 0;
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(' ');
    chunks.push(chunk);
    i += CHUNK_SIZE - OVERLAP;
  }

  return chunks;
}
