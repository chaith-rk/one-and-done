'use client';

import { useState } from 'react';
import { createList, deleteList, updateList } from '@/lib/actions/lists';
import { createTask, deleteTask, getTasks, toggleTaskCompletion } from '@/lib/actions/tasks';

export function TestActions() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  const handleCreateInbox = async () => {
    const result = await createList({ name: 'Inbox', is_inbox: true });
    setResult(result);
    if (result.success) {
      window.location.reload();
    }
  };

  const handleCreateList = async () => {
    const result = await createList({ name: 'Test List ' + Date.now() });
    setResult(result);
    if (result.success) {
      window.location.reload();
    }
  };

  const handleUpdateList = async () => {
    const listId = prompt('Enter list ID to update:');
    const newName = prompt('Enter new name:');
    if (listId && newName) {
      const result = await updateList(listId, { name: newName });
      setResult(result);
      if (result.success) {
        window.location.reload();
      }
    }
  };

  const handleDeleteList = async () => {
    const listId = prompt('Enter list ID to delete:');
    if (listId) {
      const result = await deleteList(listId);
      setResult(result);
      if (result.success) {
        window.location.reload();
      }
    }
  };

  const handleCreateTask = async () => {
    const listId = prompt('Enter list ID:');
    const title = prompt('Enter task title:');
    if (listId && title) {
      const result = await createTask({ list_id: listId, title });
      setResult(result);
    }
  };

  const handleGetTasks = async () => {
    const listId = prompt('Enter list ID:');
    if (listId) {
      const result = await getTasks({ list_id: listId });
      setResult(result);
    }
  };

  const handleToggleTask = async () => {
    const taskId = prompt('Enter task ID to toggle:');
    if (taskId) {
      const result = await toggleTaskCompletion(taskId);
      setResult(result);
    }
  };

  const handleDeleteTask = async () => {
    const taskId = prompt('Enter task ID to delete:');
    if (taskId) {
      const result = await deleteTask(taskId);
      setResult(result);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">List Operations</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateInbox}
            className="px-4 py-2 bg-[#FF9500] text-white rounded hover:bg-[#FF8000]"
          >
            Create Inbox List
          </button>
          <button
            onClick={handleCreateList}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Test List
          </button>
          <button
            onClick={handleUpdateList}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Update List
          </button>
          <button
            onClick={handleDeleteList}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete List
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Task Operations</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleCreateTask}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Task
          </button>
          <button
            onClick={handleGetTasks}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Get Tasks
          </button>
          <button
            onClick={handleToggleTask}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Toggle Task Complete
          </button>
          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Task
          </button>
        </div>
      </div>

      {result && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Last Action Result</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
