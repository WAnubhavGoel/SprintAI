import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import NotesContent from '@/components/NotesContent';

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect('/signin');

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: { id, userId: session.user.id },
    select: { id: true, status: true, title: true, notesContent: true },
  });

  if (!document) redirect('/dashboard');

  return (
    <NotesContent
      documentId={document.id}
      initialStatus={document.status}
      initialTitle={document.title}
      initialNotesContent={document.notesContent}
    />
  );
}
