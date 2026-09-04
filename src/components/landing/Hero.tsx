import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const demoFiles = [
  'Lecture Notes.pdf',
  'System Design.docx',
  'Database Chapter 3.pdf',
];

function DemoCard() {
  return (
    <Card className="w-full max-w-[420px] md:ml-auto shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-muted/50">
        <div className="size-2.5 rounded-full bg-[#FF5F57]" />
        <div className="size-2.5 rounded-full bg-[#FEBC2E]" />
        <div className="size-2.5 rounded-full bg-[#28C840]" />
        <div className="ml-2 px-3 py-1 bg-background/80 rounded-md flex-1 max-w-[180px] text-center">
          <span className="text-xs text-muted-foreground">sprintai.app/notes/...</span>
        </div>
      </div>

      {/* File list */}
      <div className="flex flex-col gap-2.5 p-5">
        {demoFiles.map((name) => (
          <div
            key={name}
            className="flex items-center gap-3 p-3 bg-background rounded-xl border border-border"
          >
            <div className="size-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--sprint-blue-soft)' }}>
              <svg width="14" height="14" viewBox="0 0 16 20" fill="none" aria-hidden="true">
                <path d="M9 0H2C1 0 0 1 0 2v16c0 1 1 2 2 2h12c1 0 2-1 2-2V5L9 0z" fill="var(--sprint-navy-mid)" opacity="0.35" />
                <path d="M9 0v5h5" stroke="var(--sprint-navy-mid)" strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">{name}</span>
          </div>
        ))}

        {/* Generating pill */}
        <div className="mt-1 p-3 rounded-xl text-center text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, var(--sprint-navy) 0%, var(--sprint-navy-mid) 100%)' }}>
          ✦ Generating study notes...
        </div>
      </div>
    </Card>
  );
}

export default function Hero() {
  return (
    <section aria-label="Hero" className="min-h-[80vh] flex items-center py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left column */}
          <div>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08] mb-5"
              style={{ color: 'var(--sprint-navy)' }}
            >
              Learn smarter.
              <br />
              <span style={{ color: 'var(--sprint-blue)' }}>Study faster.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Upload your documents and notes, and let SprintAI turn them into
              focused, interactive study material — so you understand more in less time.
            </p>

            <div className="flex flex-col items-start gap-4">
              <Link href="/signup">
                <Button size="lg" className="rounded-full font-bold px-7 shadow-md hover:-translate-y-0.5 transition-all">
                  Get started
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </Link>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Turn your notes into learning. No credit card required.
              </span>
            </div>
          </div>

          {/* Right column */}
          <DemoCard />
        </div>
      </div>
    </section>
  );
}
