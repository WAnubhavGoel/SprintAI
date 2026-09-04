import { FileText, StickyNote, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const fileTypes = [
  { icon: FileText,   label: 'PDF Documents', desc: 'Textbooks, lecture slides, study guides' },
  { icon: StickyNote, label: 'Your Notes',     desc: 'Handwritten or typed notes in any format' },
];

function UploadCard() {
  return (
    <Card className="max-w-[420px] md:ml-auto">
      <CardContent className="flex flex-col gap-4">
        {/* Dashed drop zone */}
        <div
          role="presentation"
          aria-label="File upload area"
          className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-muted/40 cursor-pointer hover:border-accent hover:bg-secondary/60 transition-all"
        >
          <div className="flex justify-center text-accent mb-3">
            <UploadCloud className="size-9" />
          </div>
          <h4 className="font-bold text-foreground text-sm mb-1">
            Upload your study material
          </h4>
          <p className="text-xs text-muted-foreground">
            Drag & drop or click to browse
          </p>
        </div>

        {/* File type rows */}
        <div className="flex flex-col gap-3">
          {fileTypes.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border bg-card hover:border-accent transition-all"
            >
              <div className="size-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h5 className="font-bold text-foreground text-sm leading-tight mb-0.5">
                  {label}
                </h5>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function UploadSection() {
  return (
    <section aria-label="Upload your study material" className="py-16 md:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-12 md:mb-16">
          SprintAI makes learning{' '}
          <span className="text-accent">simple.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left: feature list */}
          <div className="flex flex-col gap-8">
            <div className="border-l-[3px] border-accent pl-4">
              <h3 className="font-bold text-foreground text-lg mb-2">
                Upload your study material
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Add your PDFs, lecture slides, or notes — anything you study from.
                SprintAI reads and understands your actual material.
              </p>
            </div>

            <div className="border-l-[3px] border-accent pl-4">
              <h3 className="font-bold text-foreground text-lg mb-2">
                Learn the smart way
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Get exhaustive study notes, a targeted quiz, and an AI that answers
                your specific questions — all grounded in your own material.
              </p>
            </div>
          </div>

          {/* Right: upload card */}
          <UploadCard />
        </div>
      </div>
    </section>
  );
}
