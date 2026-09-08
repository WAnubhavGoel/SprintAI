import { after } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { chunkText } from '@/services/chunker.service';
import {
  generateEmbedding,
  generateStudyNotes,
  generateQuiz,
} from '@/services/gemini.service';

// Allow up to 60 seconds execution time on Vercel for background AI generation
export const maxDuration = 60;

// Processes the document in the background: text extraction, embeddings, notes & quiz
async function processDocument(documentId: string, buffer: Buffer) {
  try {
    // 1. Extract plain text from the PDF buffer
    if (typeof globalThis.DOMMatrix === 'undefined') {
      globalThis.DOMMatrix = class DOMMatrix {} as unknown as typeof DOMMatrix;
    }
    await import('pdf-parse/worker').catch(() => null);
    const { PDFParse } = await import('pdf-parse');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text;
    await parser.destroy();

    // 2. Split text into overlapping 600-word chunks
    const chunks = chunkText(text);

    // 3. Generate embeddings and save each chunk with pgvector
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

    // 4. Generate comprehensive study notes
    const notesContent = await generateStudyNotes(chunks);

    // 5. Generate 10 multiple-choice quiz questions
    const questions = await generateQuiz(chunks);
    await prisma.quiz.create({
      data: {
        documentId,
        questions,
      },
    });

    // 6. Save study notes and mark document as READY
    await prisma.document.update({
      where: { id: documentId },
      data: {
        notesContent,
        status: 'READY',
      },
    });
  } catch (error) {
    console.error(`[${documentId}] Background processing failed:`, error);
    await prisma.document.update({
      where: { id: documentId },
      data: { status: 'FAILED' },
    });
  }
}

export async function POST(request: Request) {
  // 1. Verify user session
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'You must be logged in to upload.' }, { status: 401 });
  }

  // 2. Parse multipart form data
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const question = formData.get('question') as string | null;

  if (!file || file.size === 0) {
    return Response.json({ error: 'A PDF file is required.' }, { status: 400 });
  }
  if (!question || question.trim() === '') {
    return Response.json({ error: 'A question is required.' }, { status: 400 });
  }

  // 3. Convert file to buffer and upload to Cloudinary for permanent storage
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const fileUrl = await uploadToCloudinary(buffer, file.name);

  // 4. Create Document record in PROCESSING state
  const document = await prisma.document.create({
    data: {
      title: file.name.replace('.pdf', ''),
      fileUrl,
      status: 'PROCESSING',
      userId: session.user.id,
    },
  });

  // 5. Create Conversation tied to this document
  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      documentId: document.id,
    },
  });

  // 6. Save the user's question as the first message
  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      isUser: true,
      content: question.trim(),
    },
  });

  // 7. Run background processing using Next.js 16 after()
  // This executes after the HTTP response is sent, running completely inside Vercel without external workers.
  after(async () => {
    await processDocument(document.id, buffer);
  });

  // 8. Return immediately with documentId so the client redirects to the notes page
  return Response.json({ documentId: document.id }, { status: 201 });
}
