'use client'

import { useState } from 'react'
import { Trash2, Calendar, Clock } from 'lucide-react'
import { toggleTaskCompletion, deleteTask } from '@/lib/actions/tasks'
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
  const handleCheckboxChange = async () => {
    // Optimistically update in parent first
    onTaskToggle(task.id)
    // Then update server in background
    await toggleTaskCompletion(task.id)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete "${task.title}"?\n\nThis cannot be undone.`
    )

    if (!confirmed) return

    // Optimistically remove from UI
    onTaskDelete(task.id)
    // Then delete from server in background
    const result = await deleteTask(task.id)

    if (!result.success) {
      alert(result.error || 'Failed to delete task')
      // Could refresh here if needed
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
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={task.completed}
        onChange={handleCheckboxChange}
        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#FF9500] focus:ring-[#FF9500] cursor-pointer"
      />

      {/* Task Content */}
      <div className="flex-1 min-w-0" onClick={handleTaskClick}>
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`text-base ${
              task.completed
                ? 'line-through text-gray-400'
                : isOverdue
                ? 'text-red-600 cursor-pointer hover:text-red-700 font-medium'
                : 'text-gray-900 cursor-pointer hover:text-[#FF9500]'
            }`}
          >
            {task.title}
          </div>

          {/* List Name Pill - only show in All Tasks view */}
          {listName && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#FF9500] text-white">
              {listName}
            </span>
          )}
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
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all"
        title="Delete task"
      >
        <Trash2 className="w-5 h-5 text-red-600" />
      </button>
    </div>
  )
}
