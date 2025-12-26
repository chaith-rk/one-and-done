import { getUser } from '@/lib/actions/auth';
import { getLists } from '@/lib/actions/lists';
import { redirect } from 'next/navigation';
import { TestActions } from './TestActions';

export default async function TestPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // Test fetching lists
  const listsResult = await getLists();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Phase 3 Test Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify({ email: user.email, id: user.id }, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Current Lists</h2>
        {listsResult.success && listsResult.data && listsResult.data.length > 0 ? (
          <ul className="list-disc pl-5 mb-4">
            {listsResult.data.map((list) => (
              <li key={list.id} className="mb-2">
                <strong>{list.name}</strong> {list.is_inbox && '(Inbox)'}
                <br />
                <span className="text-sm text-gray-600">ID: {list.id}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 mb-4">No lists found. Create one using the buttons below.</p>
        )}
        <pre className="bg-gray-100 p-4 rounded text-xs">
          {JSON.stringify(listsResult, null, 2)}
        </pre>
      </div>

      <TestActions />
    </div>
  );
}
