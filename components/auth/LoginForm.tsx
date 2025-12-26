'use client';

import { login } from '@/lib/actions/auth';
import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

const initialState = {
  success: false,
  error: undefined,
  fieldErrors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[#FF9500] hover:bg-[#FF8000] text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Signing in...' : 'Sign In'}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
            {state?.fieldErrors?.email && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
            {state?.fieldErrors?.password && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          <SubmitButton />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:text-primary-hover font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
