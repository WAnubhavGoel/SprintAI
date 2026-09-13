import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// ─── Prompts ──────────────────────────────────────────────────────────────────

const NOTES_SYSTEM_PROMPT = `You are SprintAI, an elite academic and technical educator.
Your mission is to transform the provided document into comprehensive, masterclass-level study notes formatted in GitHub-flavored Markdown.

Ground all notes strictly in the provided document content. Never give superficial or high-level summaries. Always provide deep, structured, textbook-quality explanations tailored to the actual subject matter.

Organize the notes into a clear, logical structure that naturally fits the topic (e.g., Computer Science, Machine Learning, Mathematics, Science, Engineering, etc.):

# 📚 [Topic Title]
[2-3 sentence executive introduction setting context, core themes, and foundational scope based on the document]

## 1. Overview & Core Intuition 💡
- **Core Concept**: [Fundamental definition and conceptual intuition of what the topic is]
- **Key Objectives & Motivations**: [Why this topic/approach exists and what problem it solves]
- **Foundational Assumptions**: [Core assumptions, prerequisites, or context outlined in the document]

## 2. Fundamental Definitions & Principles 🔑
- Detailed breakdown of core principles, theories, and key mechanisms described in the text.
- Formulations, equations, or formal definitions if present in the document.

## 3. Types, Classifications & Methodologies 🧩
- In-depth coverage of each category, model type, variant, or algorithm discussed in the document (e.g., specific algorithms, taxonomy, classifications).
- For each type/methodology:
  - **Definition & Purpose**: What it is and how it works.
  - **Core Mechanism / Step-by-Step Flow**: How it operates step-by-step.
  - **Strengths & Characteristics**: Distinguishing features.

## 4. How It Works: Step-by-Step Mechanisms ⚙️
- Detailed procedural breakdown of execution flows, algorithmic steps, or lifecycle operations explained in the text.
- Include mathematical formulas, algorithmic steps, pseudocode, or data workflows where applicable.

## 5. Use Cases & Practical Applications 🎯
- Real-world applications, concrete problem domains, and scenarios where these methods/concepts are applied based on the document.

## 6. Trade-offs, Comparisons & Limitations ⚖️
- Comparative analysis between different approaches or alternatives covered in the document.
- Strengths, bottlenecks, failure modes, complexity (time/space if relevant), and practical limitations.

## 7. Key Terms & Vocabulary 📖
| Term | Authoritative Definition |
| :--- | :--- |
| **[Term]** | [Clear, precise definition based on the document] |

Rules:
- Adapt sections and terminology dynamically to the document's actual subject matter.
- Do NOT invent or force irrelevant software engineering artifacts (such as REST APIs, HTTP endpoints, load balancers, SQL schemas, caching strategies, or rate limiting) unless the document is explicitly about software systems architecture.
- If the document is about machine learning or algorithms (e.g., unsupervised learning), focus deeply on algorithmic mechanics, mathematical foundations, data processing steps, model types, metrics, and use cases.
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
const EXPLAIN_SYSTEM_PROMPT = `You are SprintAI, an elite academic and technical tutor.
You are given specific excerpts from a document and a user's question.
Answer the user's question in a clear, deep, and structured manner using ONLY the provided document excerpts.

Guidelines:
- Directly answer the specific question asked. Adapt the structure of your response to what best explains the topic (e.g., definitions, core mechanisms, classifications/types, use cases, trade-offs).
- Ground your answer strictly in the provided document content. Do not invent or hallucinate facts or topics not present in the excerpts.
- Do NOT force irrelevant templates, headings, or software architecture elements (such as REST APIs, SQL tables, load balancers, or back-of-the-envelope calculations) unless the question and document are explicitly about them.
- Format your response using clean GitHub-flavored Markdown:
  - Clear section headers with emoji
  - Bullet points and numbered lists for steps
  - Code blocks or mathematical notation only when relevant to the question and present in the content
  - A "Key Takeaways 🎯" section at the end summarizing the 3-5 most important points
- Do NOT include conversational preambles like "Based on the provided excerpts..." or "Here is the answer:". Start directly with the answer.`;

const FLASHCARDS_SYSTEM_PROMPT = `You are an expert technical educator and study guide creator.
Generate between 10 and 15 high-yield study flashcards from the provided document content.

Output ONLY a valid JSON array — no prose, no markdown fences, no explanation.

Each element must have exactly these fields:
{
  "term": "string",
  "definition": "string"
}

Rules:
- "term" must be a concise, critical technical term, concept, component, or algorithm from the document (e.g. "Kafka", "Hash function", "Consistent Hashing").
- "definition" must be a clear, accurate, and authoritative 1-2 sentence explanation of what it is and its role.
- Focus on the most foundational and important concepts in the document.
- Generate between 10 and 15 flashcards. Do not repeat terms.`;

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  answerIndex: z.number().min(0).max(3),
  explanation: z.string(),
});

const FlashcardSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

// ─── Gemini client ────────────────────────────────────────────────────────────

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ─── Exported functions ───────────────────────────────────────────────────────

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await ai.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });
  if (!result.embeddings || !result.embeddings[0]?.values) {
    throw new Error('Gemini embedding API returned no values');
  }
  return result.embeddings[0].values;
}

// Takes all the text chunks from a document and asks Gemini to produce
// exhaustive study notes. Falls back to gemini-2.5-flash-lite if gemini-2.0-flash is busy.
export async function generateStudyNotes(chunks: string[]): Promise<string> {
  const documentContext = chunks.join('\n\n---\n\n');

  try {
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
  } catch (error) {
    console.warn('gemini-2.0-flash failed, retrying with fallback model...', error);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Here is the document content:\n\n${documentContext}`,
      config: {
        systemInstruction: NOTES_SYSTEM_PROMPT,
        maxOutputTokens: 8192,
        temperature: 0.2,
      },
    });

    return result.text ?? '';
  }
}

// Generates 10 multiple-choice quiz questions, validated with Zod before saving to DB.
export async function generateQuiz(chunks: string[]): Promise<z.infer<typeof QuizQuestionSchema>[]> {
  const documentContext = chunks.join('\n\n---\n\n');

  let text: string;
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Here is the document content:\n\n${documentContext}\n\nGenerate 10 multiple choice questions.`,
      config: {
        systemInstruction: QUIZ_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              options: {
                type: 'ARRAY',
                items: { type: 'STRING' },
              },
              answerIndex: { type: 'INTEGER' },
              explanation: { type: 'STRING' },
            },
            required: ['question', 'options', 'answerIndex', 'explanation'],
          },
        },
        maxOutputTokens: 8192,
        temperature: 0.3,
      },
    });

    text = result.text ?? '[]';
  } catch (error) {
    console.warn('gemini-2.0-flash quiz generation failed, retrying with fallback...', error);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Here is the document content:\n\n${documentContext}\n\nGenerate 10 multiple choice questions.`,
      config: {
        systemInstruction: QUIZ_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              options: {
                type: 'ARRAY',
                items: { type: 'STRING' },
              },
              answerIndex: { type: 'INTEGER' },
              explanation: { type: 'STRING' },
            },
            required: ['question', 'options', 'answerIndex', 'explanation'],
          },
        },
        maxOutputTokens: 8192,
        temperature: 0.3,
      },
    });

    text = result.text ?? '[]';
  }

  const parsed = JSON.parse(text);
  return z.array(QuizQuestionSchema).parse(parsed);
}

// Generates 10-15 flashcards (term + definition), validated with Zod before saving to DB.
export async function generateFlashcards(chunks: string[]): Promise<z.infer<typeof FlashcardSchema>[]> {
  const documentContext = chunks.join('\n\n---\n\n');

  let text: string;
  try {
    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Here is the document content:\n\n${documentContext}\n\nGenerate 10 to 15 flashcards.`,
      config: {
        systemInstruction: FLASHCARDS_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              term: { type: 'STRING' },
              definition: { type: 'STRING' },
            },
            required: ['term', 'definition'],
          },
        },
        maxOutputTokens: 8192,
        temperature: 0.3,
      },
    });

    text = result.text ?? '[]';
  } catch (error) {
    console.warn('gemini-2.0-flash flashcards generation failed, retrying with fallback...', error);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Here is the document content:\n\n${documentContext}\n\nGenerate 10 to 15 flashcards.`,
      config: {
        systemInstruction: FLASHCARDS_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              term: { type: 'STRING' },
              definition: { type: 'STRING' },
            },
            required: ['term', 'definition'],
          },
        },
        maxOutputTokens: 8192,
        temperature: 0.3,
      },
    });

    text = result.text ?? '[]';
  }

  const parsed = JSON.parse(text);
  return z.array(FlashcardSchema).parse(parsed);
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

// Passes the top 15 relevant chunks + the user's question into Gemini.
// The EXPLAIN_SYSTEM_PROMPT forces a deep, structured, hallucination-free answer.
export async function answerQuestion(chunks: string[], question: string): Promise<string> {
  const context = chunks.join('\n\n---\n\n');

  try {
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
  } catch (error) {
    console.warn('gemini-2.0-flash answerQuestion failed, retrying with fallback...', error);
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: `Document excerpts:\n\n${context}\n\nUser question: ${question}`,
      config: {
        systemInstruction: EXPLAIN_SYSTEM_PROMPT,
        maxOutputTokens: 8192,
        temperature: 0.2,
      },
    });

    return result.text ?? '';
  }
}
