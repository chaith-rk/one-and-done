'use client';

import { signup } from '@/lib/actions/auth';
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
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
          <p className="text-gray-600">Create your free account</p>
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
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
            {state?.fieldErrors?.password && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.password[0]}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
            {state?.fieldErrors?.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{state.fieldErrors.confirmPassword[0]}</p>
            )}
          </div>

          <SubmitButton />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:text-primary-hover font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
