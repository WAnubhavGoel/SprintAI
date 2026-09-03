import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section aria-label="Get started" className="py-16 md:py-20 border-t border-border/70">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-border shadow-lg p-8 sm:p-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#071A2F] tracking-tight leading-tight mb-4">
            Ready to <span className="text-[#3B82F6]">study smarter?</span>
          </h2>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            Turn your study material into a focused learning experience with SprintAI.
          </p>

          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-full bg-[#071A2F] text-white hover:bg-[#123B6D] px-8 py-3.5 text-base font-bold shadow-md hover:-translate-y-0.5 transition-all"
            >
              Get started
              <ArrowRight data-icon="inline-end" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
