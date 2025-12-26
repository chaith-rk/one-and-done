'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Calendar, Clock } from 'lucide-react'
import { createTask, updateTask } from '@/lib/actions/tasks'
import type { Task } from '@/types/database.types'

interface TaskFormProps {
  listId: string
  task?: Task | null
  onClose: () => void
  mode: 'create' | 'edit'
}

export default function TaskForm({ listId, task, onClose, mode }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [dueDate, setDueDate] = useState(task?.due_date || '')
  const [dueTime, setDueTime] = useState(
    task?.due_time ? task.due_time.slice(0, 5) : '' // Convert HH:MM:SS to HH:MM
  )
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError('Task title is required')
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === 'create') {
        const result = await createTask({
          list_id: listId,
          title: trimmedTitle,
          description: description.trim() || null,
          due_date: dueDate || null,
          due_time: dueTime ? `${dueTime}:00` : null, // Convert HH:MM to HH:MM:SS
        })

        if (result.success) {
          onClose()
        } else {
          setError(result.error || 'Failed to create task')
        }
      } else if (task) {
        const result = await updateTask(task.id, {
          title: trimmedTitle,
          description: description.trim() || null,
          due_date: dueDate || null,
          due_time: dueTime ? `${dueTime}:00` : null,
        })

        if (result.success) {
          onClose()
        } else {
          setError(result.error || 'Failed to update task')
        }
      }
    } catch (err) {
      setError(mode === 'create' ? 'Failed to create task' : 'Failed to update task')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
    >
      <div
        className="bg-white w-full md:max-w-2xl md:rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-2 md:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 id="task-form-title" className="text-lg font-semibold text-gray-900">
            {mode === 'create' ? 'New Task' : 'Edit Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Close"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              ref={titleInputRef}
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none"
              placeholder="What needs to be done?"
              maxLength={200}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none resize-none"
              placeholder="Add more details..."
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Due Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date</span>
                </div>
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label htmlFor="due-time" className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Due Time</span>
                </div>
              </label>
              <input
                id="due-time"
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9500] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#FF9500] hover:bg-[#FF8000] text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? mode === 'create'
                  ? 'Creating...'
                  : 'Saving...'
                : mode === 'create'
                ? 'Create Task'
                : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
