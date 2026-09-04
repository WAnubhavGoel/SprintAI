import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from './DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect('/signin');
  }

  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    select: { id: true, title: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  const pastDocs = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    createdAt: doc.createdAt.toISOString(),
  }));

  return (
    <DashboardShell
      userName={session.user.name || 'there'}
      pastDocs={pastDocs}
    >
      {children}
    </DashboardShell>
  );
}
