import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CTASection() {
  return (
    <section aria-label="Get started" className="py-16 md:py-20 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Card className="shadow-lg">
          <CardContent className="text-center py-10 sm:py-14">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4"
              style={{ color: 'var(--sprint-navy)' }}
            >
              Ready to{' '}
              <span style={{ color: 'var(--sprint-blue)' }}>study smarter?</span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Turn your study material into a focused learning experience with SprintAI.
            </p>

            <Link href="/signup">
              <Button size="lg" className="rounded-full font-bold px-8 shadow-md hover:-translate-y-0.5 transition-all">
                Get started
                <ArrowRight data-icon="inline-end" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
