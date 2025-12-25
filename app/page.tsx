import { getUser, logout } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">One and Done</h1>
        <p className="mt-4 text-gray-600">Welcome, {user.email}!</p>
        <p className="mt-2 text-sm text-gray-500">Dashboard coming soon...</p>

        <form action={logout} className="mt-8">
          <button
            type="submit"
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
