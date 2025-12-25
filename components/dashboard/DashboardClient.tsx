'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, Trash2, Check, X } from 'lucide-react'
import ListSidebar from '@/components/lists/ListSidebar'
import { updateList, deleteList } from '@/lib/actions/lists'
import type { List } from '@/types/database.types'

interface DashboardClientProps {
  lists: List[]
  initialListId: string
}

export default function DashboardClient({ lists, initialListId }: DashboardClientProps) {
  const [selectedListId, setSelectedListId] = useState(initialListId)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedList = lists.find(list => list.id === selectedListId)

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const startEditing = () => {
    if (selectedList && !selectedList.is_inbox) {
      setEditedName(selectedList.name)
      setIsEditing(true)
      setError(null)
    }
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditedName('')
    setError(null)
  }

  const saveEdit = async () => {
    if (!selectedList) return

    const trimmedName = editedName.trim()

    if (!trimmedName) {
      setError('List name cannot be empty')
      return
    }

    if (trimmedName === selectedList.name) {
      cancelEditing()
      return
    }

    try {
      const result = await updateList(selectedList.id, { name: trimmedName })

      if (result.success) {
        cancelEditing()
      } else {
        setError(result.error || 'Failed to rename list')
      }
    } catch (err) {
      setError('Failed to rename list')
    }
  }

  const handleDelete = async () => {
    if (!selectedList) return

    const confirmed = window.confirm(
      `Delete "${selectedList.name}"?\n\nThis will also delete all tasks in this list. This cannot be undone.`
    )

    if (!confirmed) return

    try {
      const result = await deleteList(selectedList.id)

      if (!result.success) {
        alert(result.error || 'Failed to delete list')
      } else {
        // Switch to Inbox or first available list
        const inboxList = lists.find(l => l.is_inbox)
        const newList = inboxList || lists.find(l => l.id !== selectedList.id)
        if (newList) {
          setSelectedListId(newList.id)
        }
      }
    } catch (err) {
      alert('Failed to delete list')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ListSidebar
        lists={lists}
        currentListId={selectedListId}
        onListSelect={setSelectedListId}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8 md:p-8 pt-20 md:pt-8">
          {selectedList ? (
            <div>
              {/* List Header with Edit/Delete */}
              <div className="mb-6">
                {isEditing ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 text-3xl font-bold px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                        maxLength={100}
                      />
                      <button
                        onClick={saveEdit}
                        className="p-2 bg-[#FF9500] hover:bg-[#FF8000] text-white rounded-lg transition-colors"
                        title="Save"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {selectedList.name}
                    </h1>
                    {!selectedList.is_inbox && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={startEditing}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          title="Rename list"
                        >
                          <Edit2 className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={handleDelete}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete list"
                        >
                          <Trash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Task Area Placeholder */}
              <div className="text-center py-16 text-gray-500">
                <p className="text-lg">No tasks yet</p>
                <p className="text-sm mt-2">Task management coming in Phase 5</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">Select a list to view tasks</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
