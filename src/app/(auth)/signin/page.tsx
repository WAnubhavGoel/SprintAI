'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58Z"
      />
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
    <div className="w-full max-w-[440px] bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8 sm:p-10">
      {/* Heading */}
      <div className="text-center mb-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Login
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Create notes in minutes. Free forever. No credit card required.
        </p>
      </div>

      {/* Google Sign In */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleSignIn}
        className="w-full h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm flex items-center justify-center gap-3 transition-colors"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      {/* OR Divider */}
      <div className="relative my-7 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative bg-white px-3 text-xs font-semibold text-slate-400">
          OR
        </span>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-slate-800">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="sarthak@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="h-12 rounded-xl border-slate-200 bg-white px-3.5 text-sm placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium text-slate-800">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs text-slate-500 hover:text-slate-800 underline underline-offset-2"
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
            className="h-12 rounded-xl border-slate-200 bg-white px-3.5 text-sm focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-400"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl font-semibold text-white bg-[#071A2F] hover:bg-[#123B6D] transition-colors mt-2 text-sm"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-slate-500 mt-7">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-slate-700 font-medium underline underline-offset-2 hover:text-slate-900"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
