import { redirect } from 'next/navigation';

export default function NotesRootPage({ params }: { params: { id: string } }) {
  redirect('/notes/' + params.id + '/notes');
}
