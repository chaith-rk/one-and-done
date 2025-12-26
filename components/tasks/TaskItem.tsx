'use client'

import { useState } from 'react'
import { Trash2, Calendar, Clock } from 'lucide-react'
import { toggleTaskCompletion, deleteTask } from '@/lib/actions/tasks'
import { useToast } from '@/components/ui/Toast'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import type { Task } from '@/types/database.types'

interface TaskItemProps {
  task: Task
  onTaskClick: (task: Task) => void
  onTaskToggle: (taskId: string) => void
  onTaskDelete: (taskId: string) => void
  isOverdue: boolean
  listName?: string
}

export default function TaskItem({
  task,
  onTaskClick,
  onTaskToggle,
  onTaskDelete,
  isOverdue,
  listName,
}: TaskItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { addToast } = useToast()

  const handleCheckboxChange = async () => {
    // Optimistically update in parent first
    onTaskToggle(task.id)
    // Then update server in background
    const result = await toggleTaskCompletion(task.id)
    if (!result.success) {
      // Revert optimistic update would require refresh
      addToast('Failed to update task', 'error')
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    setShowDeleteConfirm(false)
    // Optimistically remove from UI
    onTaskDelete(task.id)
    // Then delete from server in background
    const result = await deleteTask(task.id)

    if (!result.success) {
      addToast(result.error || 'Failed to delete task', 'error')
    } else {
      addToast('Task deleted', 'success')
    }
  }

  const handleTaskClick = () => {
    onTaskClick(task)
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return null
    // timeStr is in format HH:MM:SS
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div
      className={`group flex items-start gap-3 p-4 border-b hover:bg-gray-50 transition-colors`}
      role="listitem"
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleCheckboxChange}
        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FF9500] focus:ring-[#FF9500] focus:ring-2 focus:ring-offset-1 cursor-pointer"
        aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
      />

      {/* Task Content */}
      <button
        type="button"
        className="flex-1 min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-[#FF9500] focus:ring-offset-2 rounded"
        onClick={handleTaskClick}
        aria-label={`Edit task: ${task.title}`}
      >
        <div
          className={`text-base ${
            task.completed
              ? 'line-through text-gray-400'
              : isOverdue
              ? 'text-red-600 hover:text-red-700 font-medium'
              : 'text-gray-900 hover:text-[#FF9500]'
          }`}
        >
          {task.title}
        </div>

        {task.description && (
          <div
            className={`text-sm mt-1 ${
              task.completed ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            {task.description}
          </div>
        )}

        {/* Due Date/Time */}
        {(task.due_date || task.due_time) && (
          <div
            className={`flex items-center gap-3 mt-2 text-sm ${
              task.completed
                ? 'text-gray-300'
                : isOverdue
                ? 'text-red-600 font-medium'
                : 'text-gray-500'
            }`}
          >
            {task.due_date && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(task.due_date)}</span>
              </div>
            )}
            {task.due_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTime(task.due_time)}</span>
              </div>
            )}
          </div>
        )}
      </button>

      {/* List Name Pill - only show in All Tasks view */}
      {listName && (
        <span className="flex-shrink-0 w-[100px] px-2.5 py-1 rounded-md text-xs font-medium bg-[#FF9500] text-white text-center truncate">
          {listName}
        </span>
      )}

      {/* Delete Button - visible on mobile, hover-visible on desktop */}
      <button
        onClick={handleDeleteClick}
        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all flex-shrink-0 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500"
        title="Delete task"
        aria-label={`Delete task: ${task.title}`}
      >
        <Trash2 className="w-5 h-5 text-red-600" />
      </button>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  )
}
