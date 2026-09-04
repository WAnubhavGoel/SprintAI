import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

function SprintAILogoMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
      <path d="M20 5H12.5L9 16.5H14.5L11 27L23 13.5H16.5L20 5Z" fill="white" />
    </svg>
  );
}

const footerLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms',   href: '/terms'   },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <SprintAILogoMark />
          <span className="font-extrabold text-lg text-foreground tracking-tight">
            SprintAI
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          Study smarter. Move faster.
        </p>

        <Separator className="max-w-xs mx-auto mb-6" />

        <nav aria-label="Footer navigation" className="flex justify-center gap-6 mb-4">
          {footerLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-muted-foreground">
          &copy; 2026 SprintAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
