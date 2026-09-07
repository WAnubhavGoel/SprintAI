"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesContent({
  documentId,
  initialStatus,
  initialNotesContent,
}: {
  documentId: string;
  initialStatus: string;
  initialTitle: string;
  initialNotesContent: string | null;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [notesContent, setNotesContent] = useState(initialNotesContent);

  // Poll every 3 seconds while the document is still being processed
  useEffect(() => {
    if (status !== "PROCESSING") return;

    const interval = setInterval(async () => {
      const response = await fetch(`/api/notes/${documentId}`);
      if (!response.ok) return;

      const data = await response.json();
      setStatus(data.status);
      setNotesContent(data.notesContent);
    }, 3000);

    return () => clearInterval(interval);
  }, [status, documentId]);

  // --- PROCESSING — skeleton that mirrors the notes layout ---
  if (status === "PROCESSING") {
    return (
      <div className="max-w-4xl mx-auto px-8 py-14 flex flex-col gap-4">
        {/* Title */}
        <Skeleton className="mx-auto h-10 w-3/5 rounded-xl" />

        {/* Intro paragraph */}
        <div className="mt-6 flex flex-col gap-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Section header + separator */}
        <Skeleton className="mt-6 h-7 w-2/5" />
        <Separator />

        {/* Bullet points */}
        <div className="flex flex-col gap-3 pl-4">
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>

        {/* Code block */}
        <Skeleton className="mt-2 h-32 w-full rounded-xl" />

        {/* More bullet points */}
        <div className="flex flex-col gap-3 pl-4">
          <Skeleton className="h-4 w-10/12" />
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Generating your notes… this takes about 30–60 seconds
        </p>
      </div>
    );
  }

  // --- FAILED ---
  if (status === "FAILED") {
    return (
      <div className="max-w-4xl mx-auto px-8 py-14">
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>Notes generation failed</AlertTitle>
          <AlertDescription>
            Something went wrong while processing your document. Please try
            uploading it again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // --- READY ---
  return (
    <div className="min-h-full bg-background">
        <div className="max-w-4xl mx-auto px-8 py-14">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // H1 — large centered title from the AI ("# 📚 Topic")
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold text-foreground text-center leading-tight mb-8">
                  {children}
                </h1>
              ),

              // H2 — section headers with a Separator below
              h2: ({ children }) => (
                <div className="mt-14 mb-5">
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    {children}
                  </h2>
                  <Separator />
                </div>
              ),

              // H3 — sub-headers
              h3: ({ children }) => (
                <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">
                  {children}
                </h3>
              ),

              // Paragraphs
              p: ({ children }) => (
                <p className="text-foreground leading-relaxed mb-4">
                  {children}
                </p>
              ),

              // Bold — rendered in primary (brand navy) to match the screenshot's
              // colored-label style on bullet points like "**Core use-cases:**"
              strong: ({ children }) => (
                <strong className="text-primary font-semibold">
                  {children}
                </strong>
              ),

              em: ({ children }) => (
                <em className="text-muted-foreground italic">{children}</em>
              ),

              // Lists
              ul: ({ children }) => (
                <ul className="list-disc list-outside pl-6 mb-4 flex flex-col gap-2 text-foreground">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside pl-6 mb-4 flex flex-col gap-2 text-foreground">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),

              // Horizontal rule — use Separator, not <hr>
              hr: () => <Separator className="my-10" />,

              // Blockquote
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary/30 pl-4 my-5 text-muted-foreground italic bg-muted/40 py-2 rounded-r-lg">
                  {children}
                </blockquote>
              ),

              // Tables
              table: ({ children }) => (
                <div className="overflow-x-auto my-6 rounded-xl border border-border">
                  <table className="w-full border-collapse text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border-b border-border px-4 py-3 text-left font-semibold text-foreground">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border-b border-border px-4 py-3 text-muted-foreground">
                  {children}
                </td>
              ),

              // Code blocks:
              //   - Fenced blocks (```lang ... ```) have className="language-xxx"
              //   - Inline code has no className
              // We remove the default <pre> wrapper and add our own styled container.
              pre: ({ children }) => <>{children}</>,

              code: ({ className, children }) => {
                const language =
                  /language-(\w+)/.exec(className || "")?.[1] ?? "";

                if (className?.includes("language-")) {
                  // Block code — dark container with language badge
                  return (
                    <div className="relative my-6 rounded-xl overflow-hidden">
                      {/* Language badge */}
                      <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md font-mono bg-code-badge text-code-text/70">
                        {language}
                      </span>
                      <pre className="bg-code-bg text-code-text p-5 pt-10 overflow-x-auto font-mono text-sm leading-relaxed m-0 rounded-xl">
                        {String(children).replace(/\n$/, "")}
                      </pre>
                    </div>
                  );
                }

                // Inline code
                return (
                  <code className="bg-muted text-primary px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-border">
                    {children}
                  </code>
                );
              },
            }}
          >
            {notesContent || ""}
          </ReactMarkdown>
        </div>
      </div>
  );
}
