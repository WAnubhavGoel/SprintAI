import LessonSidebar from '@/components/LessonSidebar';

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex h-screen bg-white">
      <LessonSidebar documentId={id} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
