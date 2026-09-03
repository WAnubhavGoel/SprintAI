'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote:
      'SprintAI completely changed how I revise. I upload my lecture notes and within minutes I have a structured summary and a quiz. My exam prep used to take days — now it takes hours.',
    name: 'Priya M.',
    role: 'Computer Science Student',
  },
  {
    quote:
      "I struggled to make sense of dense textbook chapters. SprintAI breaks them into clear, organized notes that actually make sense. It's like having a personal tutor available 24/7.",
    name: 'James L.',
    role: 'Engineering Student',
  },
  {
    quote:
      'The quiz feature is incredible. After uploading a PDF, I get 10 targeted questions that test real understanding — not just surface recall. It genuinely helps me retain the material.',
    name: 'Aisha K.',
    role: 'Medical Student',
  },
  {
    quote:
      'I used to feel overwhelmed by the volume of reading each week. SprintAI gives me the key points I need to focus on. My grades have improved noticeably since I started using it.',
    name: 'Tom R.',
    role: 'Business Student',
  },
  {
    quote:
      "Being able to ask questions directly about my uploaded notes is a game changer. I don't have to search through endless pages — SprintAI finds the answer in seconds.",
    name: 'Sofia D.',
    role: 'Law Student',
  },
];

const VISIBLE = 3;

export default function Testimonials() {
  const [start, setStart] = useState(0);
  const canPrev = start > 0;
  const canNext = start + VISIBLE < testimonials.length;

  return (
    <section aria-label="User testimonials" className="py-16 md:py-24 border-t border-border/70">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071A2F] tracking-tight mb-2.5">
            See what our users say
          </h2>
          <p className="text-slate-500 text-base">
            Built to make studying easier.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {testimonials.slice(start, start + VISIBLE).map((t, i) => (
            <div
              key={`${start}-${i}`}
              className="bg-white rounded-2xl border border-border shadow-xs p-6 flex flex-col justify-between gap-4 hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <p className="text-slate-700 leading-relaxed text-sm italic flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">
                  — {t.name}
                </h4>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-between mt-8 gap-4">
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Testimonial pages">
            {testimonials.map((_, i) => {
              const active = i >= start && i < start + VISIBLE;
              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStart(Math.min(i, testimonials.length - VISIBLE))}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300 cursor-pointer',
                    active ? 'w-6 bg-[#071A2F]' : 'w-2 bg-slate-300'
                  )}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={!canPrev}
              onClick={() => setStart((s) => s - 1)}
              aria-label="Previous testimonials"
              className="rounded-lg"
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={!canNext}
              onClick={() => setStart((s) => s + 1)}
              aria-label="Next testimonials"
              className="rounded-lg"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
