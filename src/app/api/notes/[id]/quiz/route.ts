import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/notes/[id]/quiz — fetch the quiz questions for a document
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { id: documentId } = await params;

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { quiz: true },
  });

  if (!document || document.userId !== session.user.id) {
    return Response.json({ error: 'Document not found.' }, { status: 404 });
  }

  if (document.status !== 'READY') {
    return Response.json({ error: 'Document is still processing.' }, { status: 409 });
  }

  if (!document.quiz) {
    return Response.json({ error: 'Quiz not found for this document.' }, { status: 404 });
  }

  return Response.json({ questions: document.quiz.questions, score: document.quiz.score });
}

// POST /api/notes/[id]/quiz — submit answers, calculate and save the score
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ error: 'You must be logged in.' }, { status: 401 });
  }

  const { id: documentId } = await params;
  const { answers } = await request.json() as { answers: number[] };

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { quiz: true },
  });

  if (!document || document.userId !== session.user.id) {
    return Response.json({ error: 'Document not found.' }, { status: 404 });
  }

  if (!document.quiz) {
    return Response.json({ error: 'Quiz not found.' }, { status: 404 });
  }

  // Compare each submitted answer against the correct answerIndex from the stored quiz
  const questions = document.quiz.questions as Array<{ answerIndex: number }>;
  let score = 0;
  for (let i = 0; i < questions.length; i++) {
    if (answers[i] === questions[i].answerIndex) {
      score++;
    }
  }

  // Persist the score to the database
  await prisma.quiz.update({
    where: { id: document.quiz.id },
    data: { score },
  });

  return Response.json({ score, total: questions.length });
}
