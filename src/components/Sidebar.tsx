"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft, Plus, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type PastDoc = { id: string; title: string; createdAt: string };

function groupByDate(docs: PastDoc[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; docs: PastDoc[] }[] = [
    { label: "Today", docs: [] },
    { label: "Yesterday", docs: [] },
    { label: "Previous 7 Days", docs: [] },
    { label: "Older", docs: [] },
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

  // Local copy so we can remove items instantly on delete without a page refresh
  const [docs, setDocs] = useState<PastDoc[]>(pastDocs);

  const groups = groupByDate(docs);

  async function handleDelete(docId: string) {
    // Optimistic update — remove from list immediately
    setDocs((current) => current.filter((d) => d.id !== docId));
    await fetch(`/api/notes/${docId}`, { method: "DELETE" });
  }

  return (
    <aside
      className={cn(
        "h-screen flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 shrink-0 overflow-hidden",
        open ? "w-64" : "w-0",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
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

      {/* Document history */}
      <nav
        className="flex-1 overflow-y-auto px-2 pb-2"
        aria-label="Past documents"
      >
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            {/* Date group label */}
            <p className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              {group.label}
            </p>

            {group.docs.map((doc) => {
              const href = `/notes/${doc.id}/notes`;
              const active = pathname === href;

              return (
                <div key={doc.id} className="group relative flex items-center">
                  <Link
                    href={href}
                    className={cn(
                      "flex-1 min-w-0 px-3 py-2 pr-8 rounded-lg text-sm truncate transition-colors duration-150",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    {doc.title}
                  </Link>

                  {/* Delete button — shown on hover via group-hover */}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(doc.id);
                    }}
                    className="absolute right-1 inset-y-0 my-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    aria-label={`Delete ${doc.title}`}
                  >
                    <X />
                  </Button>
                </div>
              );
            })}
          </div>
        ))}

        {docs.length === 0 && (
          <p className="px-3 py-8 text-sm text-muted-foreground text-center">
            No documents yet.
          </p>
        )}
      </nav>

      {/* Footer — logout */}
      <Separator />
      <div className="p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() =>
            signOut({
              fetchOptions: {
                onSuccess: () => {
                  window.location.href = "/signin";
                },
              },
            })
          }
        >
          <LogOut data-icon="inline-start" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
