import "dotenv/config";
import { Worker } from "bullmq";
import { PDFParse } from "pdf-parse";
import { redis } from "../lib/redis";
import { prisma } from "../lib/prisma";
import { chunkText } from "../services/chunker.service";
import {
  generateEmbedding,
  generateStudyNotes,
  generateQuiz,
} from "../services/gemini.service";

// new Worker() is the standard BullMQ API — used exactly as the library intends.
const worker = new Worker(
  "document-queue",
  async (job) => {
    const { documentId, fileUrl } = job.data as {
      documentId: string;
      fileUrl: string;
    };

    try {
      // ── Step 1: Download the PDF buffer from Cloudinary ──────────────────────
      console.log(`[${documentId}] Step 1: Downloading PDF...`);
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(
        `[${documentId}] Step 1 done: Downloaded ${buffer.length} bytes`,
      );

      // ── Step 2: Extract plain text from the PDF ───────────────────────────────
      // pdf-parse v2 uses a class-based API: construct with the buffer, then call .getText()
      console.log(`[${documentId}] Step 2: Parsing PDF text...`);
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = result.text;
      await parser.destroy();
      console.log(
        `[${documentId}] Step 2 done: Extracted ${text.length} characters`,
      );

      // ── Step 3: Split the text into overlapping 600-word chunks ───────────────
      const chunks = chunkText(text);
      console.log(
        `[${documentId}] Step 3 done: Created ${chunks.length} chunks`,
      );

      // ── Step 4: For each chunk — generate a vector embedding and save to DB ───
      console.log(
        `[${documentId}] Step 4: Generating embeddings for ${chunks.length} chunks...`,
      );
      for (let i = 0; i < chunks.length; i++) {
        console.log(
          `[${documentId}] Step 4: Embedding chunk ${i + 1}/${chunks.length}...`,
        );
        const embedding = await generateEmbedding(chunks[i]);

        // Save the chunk text first (Prisma cannot write the vector type directly)
        const chunk = await prisma.documentChunk.create({
          data: {
            documentId,
            chunkIndex: i,
            content: chunks[i],
          },
        });

        // Then write the vector using raw SQL because Prisma marks it as Unsupported("vector(768)")
        const vectorString = `[${embedding.join(",")}]`;
        await prisma.$executeRawUnsafe(
          `UPDATE document_chunk SET embedding = $1::vector WHERE id = $2`,
          vectorString,
          chunk.id,
        );
      }
      console.log(`[${documentId}] Step 4 done: All embeddings saved`);

      // ── Step 5: Generate exhaustive study notes from all chunks ───────────────
      console.log(`[${documentId}] Step 5: Generating study notes...`);
      const notesContent = await generateStudyNotes(chunks);
      console.log(
        `[${documentId}] Step 5 done: Notes generated (${notesContent.length} chars)`,
      );

      // ── Step 6: Generate the quiz from all chunks ─────────────────────────────
      console.log(`[${documentId}] Step 6: Generating quiz...`);
      const questions = await generateQuiz(chunks);
      console.log(
        `[${documentId}] Step 6 done: Quiz generated (${questions.length} questions)`,
      );

      // Save the quiz (one quiz per document — 1-to-1 relation)
      await prisma.quiz.create({
        data: {
          documentId,
          questions,
        },
      });

      // ── Step 7: Save the notes and mark the document as READY ─────────────────
      await prisma.document.update({
        where: { id: documentId },
        data: {
          notesContent,
          status: "READY",
        },
      });
    } catch (error) {
      // If anything fails, mark the document as FAILED so the UI can show an error state
      console.error(`[${documentId}] FAILED with error:`, error);
      await prisma.document.update({
        where: { id: documentId },
        data: { status: "FAILED" },
      });

      throw error;
    }
  },
  { connection: redis },
);

worker.on("completed", (job) => {
  console.log(`Document ${job.data.documentId} processed successfully`);
});

worker.on("failed", (job, error) => {
  console.error(`Document ${job?.data.documentId} failed:`, error);
});

console.log("Document worker started — listening for jobs on document-queue");
