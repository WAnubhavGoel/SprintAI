import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// ─── Prompts ──────────────────────────────────────────────────────────────────

const NOTES_SYSTEM_PROMPT = `You are Turbo AI, an elite academic and system architecture tutor.
Your mission is to transform the provided document into exhaustive, masterclass-level study notes formatted in GitHub-flavored Markdown.

Never give high-level summaries. Always provide deep, exhaustive, textbook-quality technical breakdowns.

You MUST strictly follow this exact structural format:

# 📚 [Topic Title]
[2-3 sentence executive intro setting context, core challenges, and architectural scope]

## Understanding the problem and estimating scale 📊
- **Core use-cases**:
  1️⃣ [Primary use case with clear input → output]
  2️⃣ [Secondary use case with clear input → output]
- **Assumptions & Constraints**: [Clear list of boundary conditions]
- **Back-of-the-envelope numbers**:
  - [Specific calculations: writes/sec, reads/sec, read-to-write ratios]
  - [Storage requirements: per second, 5-year/10-year totals, total TB/GB]

## High-level design: APIs and workflows 🚀
- **API Surface (REST)**:
\`\`\`http
POST /api/v1/...  → request / response shape
GET  /...         → status codes and behaviour
\`\`\`
- **Flow 1**: [Step-by-step: Client → LB → Web → DB/Cache → Response]
- **Flow 2**: [Step-by-step resolution flow]
- **Key Architectural Decisions**: [Why A over B with trade-offs]

## Data model 📁
\`\`\`sql
CREATE TABLE ... (
    ...
);
\`\`\`
- **Schema Justification**: [Primary keys, index strategy, row-size estimate, sharding logic]

## Deep Dive & Algorithmic Design 🔐
- **Formulas & Proofs**: [e.g. Base-62 capacity: 62^n ≥ target, collision probabilities]
- **Approach 1 vs Approach 2**: [Pros, cons, data structures like Bloom Filters, Snowflake IDs]

## Detailed Execution Flows ✂️
- [Step-by-step lifecycle of each main operation]
- **Caching Strategy**: [Read-through / Write-around, TTL, Redis/Memcached invalidation]

## Wrap-up & Scalability Talking Points 📈
- **Rate Limiting**: [Token Bucket / Leaky Bucket algorithms]
- **DB Partitioning & Replication**: [Sharding keys, read replicas, failover]
- **CAP Theorem trade-offs**: [Consistency vs Availability choices and why]

## Key Terms 🔑
| Term | Definition |
| :--- | :--- |
| **[Term]** | [Authoritative technical definition] |

Rules:
- Do NOT summarise or omit calculations.
- Do NOT write "etc." or leave placeholders unfilled.
- Always include real SQL schemas, explicit numbers, and explain the Why behind every trade-off.
- Output only the Markdown. No preamble, no "Here are your notes:".`;

const QUIZ_SYSTEM_PROMPT = `You are a rigorous exam question writer.
Generate exactly 10 multiple-choice questions from the provided document content.

Output ONLY a valid JSON array — no prose, no markdown fences, no explanation.

Each element must have exactly these fields:
{
  "question": "string",
  "options": ["A text", "B text", "C text", "D text"],
  "answerIndex": 0,
  "explanation": "string"
}

Rules:
- answerIndex is 0-based (0 = A, 1 = B, 2 = C, 3 = D).
- Questions must test deep understanding, not surface recall.
- Each explanation must state WHY the correct answer is right and WHY the others are wrong.
- Do not repeat questions.`;

// Used for RAG Q&A: instructs Gemini to give a deep answer from the retrieved chunks only
const EXPLAIN_SYSTEM_PROMPT = `You are SprintAI, an elite technical tutor.
You are given specific excerpts from a document and a user's question.
Answer the question in exhaustive, masterclass-level detail using ONLY the provided document content.

Format your answer in GitHub-flavored Markdown with:
- Clear section headers with emoji
- Numbered step-by-step breakdowns where applicable
- Code blocks for any technical implementations or SQL schemas
- Back-of-the-envelope calculations with every step shown explicitly
- Trade-off comparisons (Approach A vs Approach B) where relevant
- A "Key Takeaways 🎯" section at the end summarising the 3-5 most important points

Rules:
- Answer ONLY from the provided document content. Do not invent or add outside facts.
- Never give a vague or surface-level answer. Always go deep and thorough.
- Do NOT start with "Based on the provided context..." or any preamble. Start directly with the answer.
- If the answer involves calculations, show ALL intermediate steps explicitly with units.`;

// ─── Zod schema ───────────────────────────────────────────────────────────────

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answerIndex: z.number().min(0).max(3),
  explanation: z.string(),
});

// ─── Gemini client ────────────────────────────────────────────────────────────

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ─── Exported functions ───────────────────────────────────────────────────────

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  if (!result.embeddings || !result.embeddings[0]?.values) {
    throw new Error('Gemini embedding API returned no values');
  }
  return result.embeddings[0].values;
}

// Takes all the text chunks from a document and asks Gemini 2.0 Flash to produce
// exhaustive study notes. maxOutputTokens: 8192 ensures the model never truncates.
export async function generateStudyNotes(chunks: string[]): Promise<string> {
  const documentContext = chunks.join('\n\n---\n\n');

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Here is the document content:\n\n${documentContext}`,
    config: {
      systemInstruction: NOTES_SYSTEM_PROMPT,
      maxOutputTokens: 8192,
      temperature: 0.2,
    },
  });

  return result.text ?? '';
}

// Generates 10 multiple-choice quiz questions, validated with Zod before saving to DB.
export async function generateQuiz(chunks: string[]): Promise<z.infer<typeof QuizQuestionSchema>[]> {
  const documentContext = chunks.join('\n\n---\n\n');

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Here is the document content:\n\n${documentContext}\n\nGenerate 10 multiple choice questions.`,
    config: {
      systemInstruction: QUIZ_SYSTEM_PROMPT,
      maxOutputTokens: 4096,
      temperature: 0.3,
    },
  });

  const text = result.text ?? '';
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON for quiz');

  const parsed = JSON.parse(jsonMatch[0]);
  return z.array(QuizQuestionSchema).parse(parsed);
}

// Queries PostgreSQL with pgvector cosine distance (<=>).
// Returns the top 15 text chunks from this document that are semantically closest
// to the user's question. These are passed to answerQuestion as the AI's context window.
export async function findRelevantChunks(documentId: string, query: string, limit = 15): Promise<string[]> {
  const queryEmbedding = await generateEmbedding(query);
  const vectorString = `[${queryEmbedding.join(',')}]`;

  const results = await prisma.$queryRawUnsafe<Array<{ content: string }>>(
    `SELECT content
     FROM document_chunk
     WHERE "documentId" = $2
       AND embedding IS NOT NULL
     ORDER BY embedding <=> $1::vector ASC
     LIMIT $3`,
    vectorString,
    documentId,
    limit
  );

  return results.map(r => r.content);
}

// Passes the top 15 relevant chunks + the user's question into Gemini 2.0 Flash.
// The EXPLAIN_SYSTEM_PROMPT forces a deep, structured, hallucination-free answer.
export async function answerQuestion(chunks: string[], question: string): Promise<string> {
  const context = chunks.join('\n\n---\n\n');

  const result = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `Document excerpts:\n\n${context}\n\nUser question: ${question}`,
    config: {
      systemInstruction: EXPLAIN_SYSTEM_PROMPT,
      maxOutputTokens: 8192,
      temperature: 0.2,
    },
  });

  return result.text ?? '';
}
