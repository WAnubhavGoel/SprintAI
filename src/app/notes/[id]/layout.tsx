export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-zinc-900 p-4">
        <nav className="flex flex-col gap-2">
          <a href="notes" className="text-zinc-300">Notes</a>
          <a href="quiz" className="text-zinc-300">Quiz</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
