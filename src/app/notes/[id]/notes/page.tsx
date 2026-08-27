export default function NotesPage({ params }: { params: { id: string } }) {
  return <div><p>Notes for lesson: {params.id}</p></div>;
}
