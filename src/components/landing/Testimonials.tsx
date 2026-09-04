'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    quote: 'SprintAI completely changed how I revise. I upload my lecture notes and within minutes I have a structured summary and a quiz. My exam prep used to take days — now it takes hours.',
    name: 'Priya M.', role: 'Computer Science Student',
  },
  {
    quote: "I struggled to make sense of dense textbook chapters. SprintAI breaks them into clear, organized notes that actually make sense. It's like having a personal tutor available 24/7.",
    name: 'James L.', role: 'Engineering Student',
  },
  {
    quote: 'The quiz feature is incredible. After uploading a PDF, I get 10 targeted questions that test real understanding — not just surface recall. It genuinely helps me retain the material.',
    name: 'Aisha K.', role: 'Medical Student',
  },
  {
    quote: 'I used to feel overwhelmed by the volume of reading each week. SprintAI gives me the key points I need to focus on. My grades have improved noticeably since I started using it.',
    name: 'Tom R.', role: 'Business Student',
  },
  {
    quote: "Being able to ask questions directly about my uploaded notes is a game changer. I don't have to search through endless pages — SprintAI finds the answer in seconds.",
    name: 'Sofia D.', role: 'Law Student',
  },
];

const VISIBLE = 3;

export default function Testimonials() {
  const [start, setStart] = useState(0);
  const canPrev = start > 0;
  const canNext = start + VISIBLE < testimonials.length;

  return (
    <section aria-label="User testimonials" className="py-16 md:py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-14">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2.5"
            style={{ color: 'var(--sprint-navy)' }}
          >
            See what our users say
          </h2>
          <p className="text-muted-foreground text-base">Built to make studying easier.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {testimonials.slice(start, start + VISIBLE).map((t, i) => (
            <Card key={`${start}-${i}`} className="hover:-translate-y-1 transition-all shadow-xs">
              <CardContent className="flex flex-col gap-4 h-full pt-2">
                <p className="text-muted-foreground leading-relaxed text-sm italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--sprint-navy)' }}>— {t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </CardContent>
            </Card>
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
                  className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: active ? '24px' : '8px',
                    background: active ? 'var(--sprint-navy)' : 'var(--border)',
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled={!canPrev}
              onClick={() => setStart((s) => s - 1)} aria-label="Previous testimonials">
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon" disabled={!canNext}
              onClick={() => setStart((s) => s + 1)} aria-label="Next testimonials">
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
