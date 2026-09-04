'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

type PastDoc = { id: string; title: string; createdAt: string };

function groupByDate(docs: PastDoc[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; docs: PastDoc[] }[] = [
    { label: 'Today', docs: [] },
    { label: 'Yesterday', docs: [] },
    { label: 'Previous 7 Days', docs: [] },
    { label: 'Older', docs: [] },
  ];

  for (const doc of docs) {
    const d = new Date(doc.createdAt);
    if (d >= today) groups[0].docs.push(doc);
    else if (d >= yesterday) groups[1].docs.push(doc);
    else if (d >= weekAgo) groups[2].docs.push(doc);
    else groups[3].docs.push(doc);
  }

  return groups.filter((g) => g.docs.length > 0);
}

export default function Sidebar({
  open,
  onToggle,
  pastDocs,
}: {
  open: boolean;
  onToggle: () => void;
  pastDocs: PastDoc[];
}) {
  const pathname = usePathname();
  const groups = groupByDate(pastDocs);

  return (
    <aside
      className={cn(
        'h-screen flex flex-col bg-white border-r border-slate-200 transition-all duration-300 shrink-0 overflow-hidden',
        open ? 'w-[260px]' : 'w-0'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          aria-label="Close sidebar"
        >
          <PanelLeft />
        </Button>

        <Link href="/dashboard">
          <Button variant="ghost" size="icon" aria-label="New session">
            <Plus />
          </Button>
        </Link>
      </div>

      {/* Past documents list */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2" aria-label="Past documents">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="px-2 py-1 text-xs font-medium text-slate-400">
              {group.label}
            </p>
            {group.docs.map((doc) => {
              const href = `/notes/${doc.id}/notes`;
              const active = pathname === href;
              return (
                <Link
                  key={doc.id}
                  href={href}
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm truncate transition-colors',
                    active
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  {doc.title}
                </Link>
              );
            })}
          </div>
        ))}

        {pastDocs.length === 0 && (
          <p className="px-3 py-6 text-sm text-slate-400 text-center">
            No documents yet.
          </p>
        )}
      </nav>

      {/* Footer */}
      <Separator />
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-sm text-slate-600 hover:text-slate-900"
          onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/signin'; } } })}
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
