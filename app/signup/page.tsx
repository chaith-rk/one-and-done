import { SignupForm } from '@/components/auth/SignupForm';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign Up | One and Done',
  description: 'Create your One and Done account',
};

export default async function SignupPage() {
  // Redirect to home if already logged in
  const user = await getUser();
  if (user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <SignupForm />
    </div>
  );
}
