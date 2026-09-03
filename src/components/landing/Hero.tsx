import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function DemoPreview() {
  const rows = [
    { name: 'Lecture Notes.pdf' },
    { name: 'System Design.docx' },
    { name: 'Database Chapter 3.pdf' },
  ];
  return (
    <div className="px-5 pt-5 pb-5 sm:px-7 sm:pt-6">
      <div className="flex flex-col gap-2.5">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-white rounded-xl border border-border"
          >
            <div className="size-8 rounded-lg bg-[#EAF2FB] flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 16 20" fill="none" aria-hidden="true">
                <path d="M9 0H2C1 0 0 1 0 2v16c0 1 1 2 2 2h12c1 0 2-1 2-2V5L9 0z" fill="#1E5AA8" opacity="0.25" />
                <path d="M9 0v5h5" stroke="#1E5AA8" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">
              {row.name}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-[#071A2F] to-[#123B6D] text-center">
        <span className="text-white text-sm font-semibold">
          ✦ Generating study notes...
        </span>
      </div>
    </div>
  );
}

function VideoPlaceholderCard() {
  return (
    <div className="relative w-full max-w-[420px] md:ml-auto">
      <div
        aria-label="SprintAI product demo"
        className="relative z-10 bg-slate-50 rounded-2xl border border-border shadow-xl overflow-hidden hover:-translate-y-1 transition-all duration-300"
      >
        {/* Browser chrome bar */}
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-slate-100/70">
          <div className="size-2.5 rounded-full bg-[#FF5F57]" />
          <div className="size-2.5 rounded-full bg-[#FEBC2E]" />
          <div className="size-2.5 rounded-full bg-[#28C840]" />
          <div className="ml-2 px-3 py-1 bg-white/80 rounded-md flex-1 max-w-[180px] text-center">
            <span className="text-xs text-muted-foreground">
              sprintai.app/notes/...
            </span>
          </div>
        </div>
        <DemoPreview />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section aria-label="Hero" className="min-h-[80vh] flex items-center py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 md:gap-12 items-center">
          {/* Left Column */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#071A2F] leading-[1.08] mb-5">
              Learn smarter.
              <br />
              <span className="text-[#3B82F6]">Study faster.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-md">
              Upload your documents and notes, and let SprintAI turn them into
              focused, interactive study material — so you understand more in less time.
            </p>

            <div className="flex flex-col items-start gap-4">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="rounded-full bg-[#071A2F] text-white hover:bg-[#123B6D] px-7 py-3 text-base font-bold shadow-md hover:-translate-y-0.5 transition-all"
                >
                  Get started
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>

              <span className="text-xs sm:text-sm text-slate-400">
                Turn your notes into learning. No credit card required.
              </span>
            </div>
          </div>

          {/* Right Column */}
          <VideoPlaceholderCard />
        </div>
      </div>
    </section>
  );
}
