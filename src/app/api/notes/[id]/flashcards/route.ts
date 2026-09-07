import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateFlashcards } from '@/services/gemini.service';

// Helper function to resolve the Document by either documentId or conversationId
async function getDocument(id: string, userId: string) {
  // 1. Try finding directly by documentId
  let document = await prisma.document.findUnique({
    where: { id },
    include: {
      chunks: { orderBy: { chunkIndex: 'asc' } },
      flashcards: { orderBy: { createdAt: 'asc' } },
    },
  });

  // 2. If not found by documentId, try finding by conversationId
  if (!document) {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: {
        document: {
          include: {
            chunks: { orderBy: { chunkIndex: 'asc' } },
            flashcards: { orderBy: { createdAt: 'asc' } },
          },
        },
      },
    });

    document = conversation?.document ?? null;
  }

  // 3. Ensure the document belongs to the authenticated user
  if (!document || document.userId !== userId) {
    return null;
  }

  return document;
}

// GET /api/notes/[id]/flashcards — Fetch existing flashcards or generate 10-15 on demand
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { id } = await params;

  // 2. Look up the document (supports either documentId or conversationId)
  const document = await getDocument(id, session.user.id);
  if (!document) {
    return Response.json({ error: 'Document not found.' }, { status: 404 });
  }

  if (document.status !== 'READY') {
    return Response.json({ error: 'Document is still processing.' }, { status: 409 });
  }

  // 3. If flashcards already exist in the database, return them immediately
  if (document.flashcards.length > 0) {
    return Response.json({
      flashcards: document.flashcards,
      count: document.flashcards.length,
    });
  }

  // 4. If no flashcards exist yet, generate them from the document chunks
  const chunkTexts = document.chunks.map((chunk) => chunk.content);
  if (chunkTexts.length === 0) {
    return Response.json({ error: 'No content chunks found for this document.' }, { status: 400 });
  }

  const generated = await generateFlashcards(chunkTexts);

  // 5. Save the generated flashcards to PostgreSQL
  await prisma.flashcard.createMany({
    data: generated.map((card) => ({
      documentId: document.id,
      term: card.term,
      definition: card.definition,
    })),
  });

  // 6. Fetch and return the newly saved flashcards
  const savedFlashcards = await prisma.flashcard.findMany({
    where: { documentId: document.id },
    orderBy: { createdAt: 'asc' },
  });

  return Response.json({
    flashcards: savedFlashcards,
    count: savedFlashcards.length,
  });
}

// DELETE /api/notes/[id]/flashcards — Delete a specific flashcard by cardId
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify user is authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { cardId } = (await request.json()) as { cardId?: string };
  if (!cardId) {
    return Response.json({ error: 'cardId is required.' }, { status: 400 });
  }

  // 2. Find the flashcard and verify ownership
  const flashcard = await prisma.flashcard.findUnique({
    where: { id: cardId },
    include: { document: true },
  });

  if (!flashcard || flashcard.document.userId !== session.user.id) {
    return Response.json({ error: 'Flashcard not found.' }, { status: 404 });
  }

  // 3. Delete the flashcard from PostgreSQL
  await prisma.flashcard.delete({
    where: { id: cardId },
  });

  return Response.json({ success: true });
}
