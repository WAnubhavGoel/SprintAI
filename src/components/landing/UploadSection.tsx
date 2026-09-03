import { FileText, StickyNote, UploadCloud } from 'lucide-react';

const fileTypes = [
  {
    icon: FileText,
    label: 'PDF Documents',
    desc: 'Textbooks, lecture slides, study guides',
  },
  {
    icon: StickyNote,
    label: 'Your Notes',
    desc: 'Handwritten or typed notes in any format',
  },
];

function UploadCard() {
  return (
    <div className="bg-white rounded-3xl border border-border shadow-md p-6 sm:p-8 max-w-[420px] md:ml-auto transition-all hover:shadow-xl">
      {/* Dashed drop zone */}
      <div
        role="presentation"
        aria-label="File upload area"
        className="border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-5 text-center bg-gradient-to-br from-[#F7F9FC] to-[#EAF2FB] cursor-pointer hover:border-[#3B82F6] transition-all"
      >
        <div className="flex justify-center text-[#3B82F6] mb-3">
          <UploadCloud className="size-9" />
        </div>
        <h4 className="font-bold text-slate-900 text-sm mb-1">
          Upload your study material
        </h4>
        <p className="text-xs text-slate-500">
          Drag & drop or click to browse
        </p>
      </div>

      {/* File type rows */}
      <div className="flex flex-col gap-3">
        {fileTypes.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3.5 p-3.5 rounded-xl border border-border bg-[#FAFCFF] hover:border-[#3B82F6] transition-all"
            >
              <div
                aria-hidden="true"
                className="size-10 rounded-lg bg-[#EAF2FB] text-[#123B6D] flex items-center justify-center shrink-0"
              >
                <Icon className="size-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm leading-tight mb-0.5">
                  {item.label}
                </h5>
                <p className="text-xs text-slate-500">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function UploadSection() {
  return (
    <section aria-label="Upload your study material" className="py-16 md:py-24 border-t border-border/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071A2F] tracking-tight mb-12 md:mb-16">
          SprintAI makes learning{' '}
          <span className="text-[#3B82F6]">simple.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
          {/* Left: feature list */}
          <div className="flex flex-col gap-8">
            <div className="border-l-[3px] border-[#3B82F6] pl-4">
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Upload your study material
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Add your PDFs, lecture slides, or notes — anything you study
                from. SprintAI reads and understands your actual material.
              </p>
            </div>

            <div className="border-l-[3px] border-[#3B82F6] pl-4">
              <h3 className="font-bold text-slate-900 text-lg mb-2">
                Learn the smart way
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Get exhaustive study notes, a targeted quiz, and an AI that
                answers your specific questions — all grounded in your own material.
              </p>
            </div>
          </div>

          {/* Right: visual upload card */}
          <UploadCard />
        </div>
      </div>
    </section>
  );
}
