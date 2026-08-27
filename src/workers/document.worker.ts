import 'dotenv/config';
import { Worker } from 'bullmq';
import { PDFParse } from 'pdf-parse';
import { redis } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { chunkText } from '../services/chunker.service';
import { generateEmbedding, generateStudyNotes, generateQuiz } from '../services/gemini.service';

// new Worker() is the standard BullMQ API — used exactly as the library intends.
const worker = new Worker(
  'document-queue',
  async (job) => {
    const { documentId, fileUrl } = job.data as { documentId: string; fileUrl: string };

    try {
      // ── Step 1: Download the PDF buffer from Cloudinary ──────────────────────
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // ── Step 2: Extract plain text from the PDF ───────────────────────────────
      // pdf-parse v2 uses a class-based API: construct with the buffer, then call .getText()
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = result.text;
      await parser.destroy();

      // ── Step 3: Split the text into overlapping 600-word chunks ───────────────
      const chunks = chunkText(text);

      // ── Step 4: For each chunk — generate a vector embedding and save to DB ───
      for (let i = 0; i < chunks.length; i++) {
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
        const vectorString = `[${embedding.join(',')}]`;
        await prisma.$executeRawUnsafe(
          `UPDATE document_chunk SET embedding = $1::vector WHERE id = $2`,
          vectorString,
          chunk.id
        );
      }

      // ── Step 5: Generate exhaustive study notes from all chunks ───────────────
      const notesContent = await generateStudyNotes(chunks);

      // ── Step 6: Generate the quiz from all chunks ─────────────────────────────
      const questions = await generateQuiz(chunks);

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
          status: 'READY',
        },
      });

    } catch (error) {
      // If anything fails, mark the document as FAILED so the UI can show an error state
      await prisma.document.update({
        where: { id: documentId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  },
  { connection: redis }
);

worker.on('completed', (job) => {
  console.log(`Document ${job.data.documentId} processed successfully`);
});

worker.on('failed', (job, error) => {
  console.error(`Document ${job?.data.documentId} failed:`, error.message);
});

console.log('Document worker started — listening for jobs on document-queue');
