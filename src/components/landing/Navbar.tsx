'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

function SprintAILogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="var(--sprint-navy)" />
      <path d="M20 5H12.5L9 16.5H14.5L11 27L23 13.5H16.5L20 5Z" fill="var(--sprint-blue)" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#f7f9fc]/90 backdrop-blur-md border-b border-border shadow-xs'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between py-3.5">
        <Link href="/" aria-label="SprintAI home" className="flex items-center gap-2">
          <SprintAILogoMark />
          <span className="font-extrabold text-lg tracking-tight" style={{ color: 'var(--sprint-navy)' }}>
            SprintAI
          </span>
        </Link>

        <Link href="/dashboard">
          <Button className="rounded-full font-bold px-5 hover:-translate-y-0.5 transition-all">
            Dashboard
          </Button>
        </Link>
      </div>
    </nav>
  );
}
