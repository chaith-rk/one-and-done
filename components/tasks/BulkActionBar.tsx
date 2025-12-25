'use client'

import { Check, Trash2, X } from 'lucide-react'
import { bulkCompleteTasks, bulkDeleteTasks } from '@/lib/actions/tasks'

interface BulkActionBarProps {
  selectedTaskIds: string[]
  onClearSelection: () => void
}

export default function BulkActionBar({
  selectedTaskIds,
  onClearSelection,
}: BulkActionBarProps) {
  const count = selectedTaskIds.length

  const handleBulkComplete = async () => {
    const result = await bulkCompleteTasks({
      task_ids: selectedTaskIds,
      completed: true,
    })

    if (result.success) {
      onClearSelection()
    } else {
      alert(result.error || 'Failed to complete tasks')
    }
  }

  const handleBulkDelete = async () => {
    const confirmed = window.confirm(
      `Delete ${count} task${count > 1 ? 's' : ''}?\n\nThis cannot be undone.`
    )

    if (!confirmed) return

    const result = await bulkDeleteTasks({
      task_ids: selectedTaskIds,
    })

    if (result.success) {
      onClearSelection()
    } else {
      alert(result.error || 'Failed to delete tasks')
    }
  }

  if (count === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-4 md:left-64">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {count} task{count > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Clear selection"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBulkComplete}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF9500] hover:bg-[#FF8000] text-white rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Complete Selected</span>
          </button>

          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected</span>
          </button>
        </div>
      </div>
    </div>
  )
}
