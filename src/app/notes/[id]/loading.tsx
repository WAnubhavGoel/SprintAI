// Shown by Next.js while the notes page is being server-rendered after navigation.
// Without this file, the old dashboard page stays visible during the render — confusing.
export default function NotesLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="size-10 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
    </div>
  );
}
