'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Check, X } from 'lucide-react'
import { createList } from '@/lib/actions/lists'

export default function CreateListButton() {
  const [isCreating, setIsCreating] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when entering create mode
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isCreating])

  const handleCreate = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('List name cannot be empty')
      return
    }

    try {
      setError(null)
      const result = await createList({ name: trimmedName })

      if (result.success) {
        setName('')
        setIsCreating(false)
      } else {
        setError(result.error || 'Failed to create list')
      }
    } catch (err) {
      setError('Failed to create list')
    }
  }

  const handleCancel = () => {
    setIsCreating(false)
    setName('')
    setError(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleCreate()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isCreating) {
    return (
      <div className="p-2 space-y-2">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New list name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none text-sm"
            maxLength={100}
          />
          <button
            onClick={handleCreate}
            className="p-2 bg-[#FF9500] hover:bg-[#FF8000] text-white rounded-lg transition-colors flex-shrink-0"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex-shrink-0"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {error && (
          <p className="px-2 text-xs text-red-600">{error}</p>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="w-full px-4 py-3 flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
    >
      <Plus className="w-4 h-4" />
      New List
    </button>
  )
}
