import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

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

// ─── Zod schema ───────────────────────────────────────────────────────────────

// Validates the JSON the AI returns so we know every question has the right shape
// before we save it to the database.
const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answerIndex: z.number().min(0).max(3),
  explanation: z.string(),
});

// ─── Gemini client ────────────────────────────────────────────────────────────

// new GoogleGenAI() is the standard library API — used exactly as the library intends.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ─── Exported functions ───────────────────────────────────────────────────────

// Converts a piece of text into a 768-dimensional vector using text-embedding-004.
// The vector captures the semantic meaning of the text and is stored in PostgreSQL
// so we can find the most relevant chunks when the user asks a question (RAG).
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
// exhaustive study notes in the exact structured format defined by NOTES_SYSTEM_PROMPT.
// maxOutputTokens: 8192 gives the model enough room to produce 2000+ words without
// being forced to cut the output short.
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

// Generates 10 multiple-choice quiz questions from the document chunks.
// The AI is instructed to return pure JSON. We strip any markdown fences the
// model might wrap around it, then validate the shape with Zod before saving.
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

  // The model sometimes wraps the JSON in a ```json``` code block — strip it out.
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Gemini did not return valid JSON for quiz');

  const parsed = JSON.parse(jsonMatch[0]);
  return z.array(QuizQuestionSchema).parse(parsed);
}
