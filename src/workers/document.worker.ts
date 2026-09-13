import 'dotenv/config';
import http from 'node:http';
import { Worker } from 'bullmq';
import { redis } from '../lib/redis';
import { prisma } from '../lib/prisma';
import { chunkText } from '../services/chunker.service';
import {
  generateEmbedding,
  generateStudyNotes,
  generateQuiz,
} from '../services/gemini.service';

// Health check HTTP server so Render can run this worker as a Web Service on the free tier
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

server.listen(port, () => {
  console.log(`Health check server listening on port ${port}`);
});

const worker = new Worker(
  'document-queue',
  async (job) => {
    const { documentId, fileUrl } = job.data as {
      documentId: string;
      fileUrl: string;
    };

    try {
      // 1. Download the PDF from Cloudinary
      console.log(`[${documentId}] Step 1: Downloading PDF from Cloudinary...`);
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Extract plain text from the PDF
      console.log(`[${documentId}] Step 2: Extracting text from PDF...`);
      if (typeof globalThis.DOMMatrix === 'undefined') {
        globalThis.DOMMatrix = class DOMMatrix {} as unknown as typeof DOMMatrix;
      }
      await import('pdf-parse/worker').catch(() => null);
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      const text = result.text;
      await parser.destroy();

      // 3. Split text into overlapping chunks
      console.log(`[${documentId}] Step 3: Splitting text into chunks...`);
      const chunks = chunkText(text);

      // 4. Generate vector embeddings and save each chunk to the database
      console.log(`[${documentId}] Step 4: Generating embeddings for ${chunks.length} chunks...`);
      for (let i = 0; i < chunks.length; i++) {
        const embedding = await generateEmbedding(chunks[i]);

        const chunk = await prisma.documentChunk.create({
          data: {
            documentId,
            chunkIndex: i,
            content: chunks[i],
          },
        });

        const vectorString = `[${embedding.join(',')}]`;
        await prisma.$executeRawUnsafe(
          `UPDATE document_chunk SET embedding = $1::vector WHERE id = $2`,
          vectorString,
          chunk.id
        );
      }

      // 5. Generate comprehensive study notes and quiz in parallel
      console.log(`[${documentId}] Step 5: Generating notes and quiz in parallel...`);
      const [notesContent, questions] = await Promise.all([
        generateStudyNotes(chunks),
        generateQuiz(chunks),
      ]);

      // 6. Save quiz to database
      console.log(`[${documentId}] Step 6: Saving quiz...`);
      await prisma.quiz.create({
        data: {
          documentId,
          questions,
        },
      });

      // 7. Save study notes and mark document as READY
      console.log(`[${documentId}] Step 7: Saving notes and marking document READY...`);
      await prisma.document.update({
        where: { id: documentId },
        data: {
          notesContent,
          status: 'READY',
        },
      });

      console.log(`[${documentId}] Finished processing successfully.`);
    } catch (error) {
      console.error(`[${documentId}] Document processing failed:`, error);
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
  console.log(`Job ${job.id} completed for document ${job.data.documentId}`);
});

worker.on('failed', (job, error) => {
  console.error(`Job ${job?.id} failed for document ${job?.data.documentId}:`, error);
});

console.log('Worker is running and listening for jobs on document-queue...');
