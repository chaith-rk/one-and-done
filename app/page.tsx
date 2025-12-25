import { getUser } from '@/lib/actions/auth';
import { getLists } from '@/lib/actions/lists';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/dashboard/DashboardClient';

export default async function Home() {
  const user = await getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  // Fetch user's lists
  const listsResult = await getLists();
  const lists = listsResult.data || [];

  // Find Inbox list (created on signup)
  const inboxList = lists.find(list => list.is_inbox);
  const initialListId = inboxList?.id || lists[0]?.id || '';

  // If no lists exist (shouldn't happen), show error
  if (lists.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center text-red-600">
          <p>Error: No lists found. Please contact support.</p>
        </div>
      </div>
    );
  }

  return <DashboardClient lists={lists} initialListId={initialListId} />;
}
