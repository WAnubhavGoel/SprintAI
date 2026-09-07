import { redirect } from 'next/navigation';

export default async function NotesRootPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/notes/${id}/notes`);
}
