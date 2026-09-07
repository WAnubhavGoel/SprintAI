import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import FlashcardsContent from '@/components/FlashcardsContent';

export default async function FlashcardsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Verify user authentication
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/signin');

  const { id } = await params;

  // 2. Fetch document directly by id or through its linked conversation
  let document = await prisma.document.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true, title: true, status: true },
  });

  if (!document) {
    const conversation = await prisma.conversation.findUnique({
      where: { id, userId: session.user.id },
      include: {
        document: {
          select: { id: true, title: true, status: true },
        },
      },
    });

    document = conversation?.document ?? null;
  }

  // 3. Redirect back to notes if the document doesn't exist or isn't READY
  if (!document || document.status !== 'READY') {
    redirect(`/notes/${id}/notes`);
  }

  // 4. Render the client flashcards view
  return (
    <FlashcardsContent
      documentId={document.id}
      documentTitle={document.title}
    />
  );
}
