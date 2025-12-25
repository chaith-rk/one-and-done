import { LoginForm } from '@/components/auth/LoginForm';
import { getUser } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign In | One and Done',
  description: 'Sign in to your One and Done account',
};

export default async function LoginPage() {
  // Redirect to home if already logged in
  const user = await getUser();
  if (user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <LoginForm />
    </div>
  );
}
