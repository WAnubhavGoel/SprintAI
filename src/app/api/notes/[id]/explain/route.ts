import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { findRelevantChunks, answerQuestion } from '@/services/gemini.service';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify the user is logged in
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { id: documentId } = await params;
  const { question } = await request.json() as { question: string };

  if (!question || question.trim() === '') {
    return Response.json({ error: 'A question is required.' }, { status: 400 });
  }

  // 2. Confirm the document exists and belongs to this user
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { conversation: true },
  });

  if (!document || document.userId !== session.user.id) {
    return Response.json({ error: 'Document not found.' }, { status: 404 });
  }

  if (document.status !== 'READY') {
    return Response.json({ error: 'Document is still processing.' }, { status: 409 });
  }

  if (!document.conversation) {
    return Response.json({ error: 'Conversation not found for this document.' }, { status: 404 });
  }

  // 3. Save the user's question as a new Message in the conversation
  await prisma.message.create({
    data: {
      conversationId: document.conversation.id,
      isUser: true,
      content: question.trim(),
    },
  });

  // 4. Find the top 15 most semantically relevant chunks from the document using pgvector
  const relevantChunks = await findRelevantChunks(documentId, question);

  // 5. Ask Gemini 2.0 Flash to answer the question using only those 15 chunks as context
  const answer = await answerQuestion(relevantChunks, question);

  // 6. Save the AI's answer as a Message so the chat history is fully persisted
  await prisma.message.create({
    data: {
      conversationId: document.conversation.id,
      isUser: false,
      content: answer,
    },
  });

  return Response.json({ answer });
}
