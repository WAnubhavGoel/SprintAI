'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Loader2, RefreshCw, Layers, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Flashcard = {
  id: string;
  term: string;
  definition: string;
  createdAt: string;
};

export default function FlashcardsContent({
  documentId,
  documentTitle,
}: {
  documentId: string;
  documentTitle: string;
}) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch or generate flashcards on component mount
  async function loadFlashcards() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${documentId}/flashcards`);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error || `Failed to load flashcards (Status ${response.status}).`);
        setLoading(false);
        return;
      }

      setFlashcards(data?.flashcards || []);
    } catch (err) {
      console.error('Flashcards fetch error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred while loading flashcards.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlashcards();
  }, [documentId]);

  // 2. Delete a flashcard smoothly without full-page reload
  async function handleDelete(cardId: string) {
    setDeletingId(cardId);

    try {
      const response = await fetch(`/api/notes/${documentId}/flashcards`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cardId }),
      });

      if (response.ok) {
        // Remove the deleted card from state immediately so counter updates
        setFlashcards((prev) => prev.filter((card) => card.id !== cardId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete flashcard.');
      }
    } catch {
      alert('Network error while deleting flashcard.');
    } finally {
      setDeletingId(null);
    }
  }

  // --- Loading screen (shown while Gemini is generating on first load) ---
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="size-10 animate-spin text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Generating Flashcards...
        </h2>
        <p className="text-sm text-muted-foreground max-w-md">
          Analyzing your document chunks and crafting 10–15 high-yield study cards with key concepts and definitions.
        </p>
      </div>
    );
  }

  // --- Error screen ---
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={loadFlashcards}>
          <RefreshCw data-icon="inline-start" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      {/* ── Breadcrumb & Top Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="flex flex-col gap-1.5">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/60" />
            <span className="truncate max-w-[280px] sm:max-w-md font-medium text-foreground">
              {documentTitle}
            </span>
          </nav>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Flashcards
          </h1>
        </div>

        {/* Total count badge */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Layers className="size-3.5" />
            {flashcards.length} {flashcards.length === 1 ? 'Flashcard' : 'Flashcards'}
          </Badge>
        </div>
      </div>

      {/* ── Empty State ─────────────────────────────────────────────────── */}
      {flashcards.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4 text-center">
          <div className="size-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <Layers className="size-7" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No flashcards left</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            You have deleted all flashcards for this document.
          </p>
          <Button onClick={loadFlashcards} variant="outline" className="mt-2">
            <RefreshCw data-icon="inline-start" />
            Regenerate Flashcards
          </Button>
        </div>
      ) : (
        /* ── Flashcards List ─────────────────────────────────────────────── */
        <div className="flex flex-col gap-4 sm:gap-5">
          {flashcards.map((card) => (
            <div
              key={card.id}
              className="relative group rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all"
            >
              {/* Delete trash button — placed at the top-right corner */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={deletingId === card.id}
                  onClick={() => handleDelete(card.id)}
                  className="size-8 text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete flashcard"
                  aria-label={`Delete ${card.term}`}
                >
                  {deletingId === card.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>

              {/* Card content: Dot + Left (Term) + Divider + Right (Definition) */}
              <div className="flex items-start gap-4 sm:gap-6 pr-10">
                {/* Amber indicator dot */}
                <div className="size-2.5 rounded-full bg-amber-500 shrink-0 mt-2 sm:mt-1.5" />

                {/* Two-column layout matching screenshot */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_auto_1.6fr] items-center gap-4 sm:gap-8">
                  {/* Left: Term */}
                  <div className="flex items-center justify-center text-center py-2 px-3">
                    <p className="text-base sm:text-lg font-semibold text-foreground tracking-tight">
                      {card.term}
                    </p>
                  </div>

                  {/* Divider: vertical on desktop, horizontal on mobile */}
                  <Separator
                    orientation="vertical"
                    className="hidden sm:block self-stretch min-h-[64px]"
                  />
                  <Separator className="block sm:hidden my-1" />

                  {/* Right: Definition */}
                  <div className="flex items-center text-left py-2 px-3">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {card.definition}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
