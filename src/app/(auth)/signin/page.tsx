'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Google "G" logo SVG — no third-party icon dependency needed
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"/>
    </svg>
  );
}

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn.email({ email, password });

    if (result.error) {
      setError(result.error.message || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
  }

  async function handleGoogleSignIn() {
    await signIn.social({ provider: 'google', callbackURL: '/dashboard' });
  }

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardContent className="pt-8 pb-8">
        {/* Logo + heading */}
        <div className="text-center mb-7">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="var(--sprint-navy)" />
              <path d="M20 5H12.5L9 16.5H14.5L11 27L23 13.5H16.5L20 5Z" fill="var(--sprint-blue)" />
            </svg>
            <span className="font-extrabold text-xl tracking-tight" style={{ color: 'var(--sprint-navy)' }}>
              SprintAI
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--sprint-navy)' }}>
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to continue learning.{' '}
            <span style={{ color: 'var(--sprint-blue)' }}>Free forever.</span>
          </p>
        </div>

        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full gap-3 mb-3 font-medium"
          onClick={handleGoogleSignIn}
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        {/* OR divider */}
        <div className="flex items-center gap-3 my-5">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground font-medium">OR</span>
          <Separator className="flex-1" />
        </div>

        {/* Email + password form */}
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs hover:underline"
                style={{ color: 'var(--sprint-blue)' }}
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full font-bold mt-1"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* Switch to sign up */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold hover:underline"
            style={{ color: 'var(--sprint-blue)' }}
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
