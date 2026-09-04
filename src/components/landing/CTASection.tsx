import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CTASection() {
  return (
    <section aria-label="Get started" className="py-16 md:py-20 border-t border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Card>
          <CardContent className="text-center py-8 sm:py-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight mb-4">
              Ready to{' '}
              <span className="text-accent">study smarter?</span>
            </h2>

            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Turn your study material into a focused learning experience with SprintAI.
            </p>

            <Link href="/signup">
              <Button size="lg" className="rounded-full font-bold px-8">
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
