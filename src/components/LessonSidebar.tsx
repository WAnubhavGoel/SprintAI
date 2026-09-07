"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  ListChecks,
  Layers,
  MessageSquare,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Notes", icon: FileText, segment: "notes" },
  { label: "Quiz", icon: ListChecks, segment: "quiz" },
  { label: "Flashcards", icon: Layers, segment: "flashcards" },
  { label: "Chat", icon: MessageSquare, segment: "chat" },
  { label: "Source", icon: FolderOpen, segment: "source" },
];

// Only these tabs are wired up — the rest show as "coming soon"
const enabledTabs = new Set(["notes", "quiz", "flashcards"]);

export default function LessonSidebar({ documentId }: { documentId: string }) {
  const pathname = usePathname();
  const activeSegment = pathname.split("/").pop();

  return (
    <nav className="flex flex-col items-center gap-1 py-4 w-[72px] shrink-0 border-r border-border bg-background">
      {tabs.map((tab) => {
        const isActive = activeSegment === tab.segment;
        const isEnabled = enabledTabs.has(tab.segment);
        const Icon = tab.icon;

        if (!isEnabled) {
          return (
            <div
              key={tab.segment}
              className="flex flex-col items-center gap-1 py-3 px-2 text-muted-foreground/40 cursor-not-allowed"
              title="Coming soon"
            >
              <Icon />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={tab.segment}
            href={`/notes/${documentId}/${tab.segment}`}
            className={cn(
              "flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-colors",
              isActive
                ? "text-foreground bg-muted"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
            )}
          >
            <Icon />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
