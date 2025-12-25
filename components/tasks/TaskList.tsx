'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'
import TaskFilterToggle from './TaskFilterToggle'
import BulkActionBar from './BulkActionBar'
import { getTasks } from '@/lib/actions/tasks'
import type { Task, TaskFilter, TaskSortBy } from '@/types/database.types'

interface TaskListProps {
  listId: string
  listName: string
}

export default function TaskList({ listId, listName }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [sortBy, setSortBy] = useState<TaskSortBy>('created_at')
  const [isLoading, setIsLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([])

  // Fetch tasks whenever listId, filter, or sortBy changes
  useEffect(() => {
    fetchTasks()
  }, [listId, filter, sortBy])

  const fetchTasks = async () => {
    setIsLoading(true)
    const result = await getTasks({
      list_id: listId,
      filter,
      sort_by: sortBy,
    })

    if (result.success && result.data) {
      // Sort completed tasks to bottom
      const sorted = sortTasksWithCompletedAtBottom(result.data)
      setTasks(sorted)
    }

    setIsLoading(false)
    setSelectedTaskIds([]) // Clear selection when fetching new tasks
  }

  // Sort tasks so completed ones are always at the bottom
  const sortTasksWithCompletedAtBottom = (taskList: Task[]) => {
    const incomplete = taskList.filter((t) => !t.completed)
    const complete = taskList.filter((t) => t.completed)
    return [...incomplete, ...complete]
  }

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
    fetchTasks() // Refresh after form closes
  }

  const handleSelectionToggle = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    )
  }

  const handleClearSelection = () => {
    setSelectedTaskIds([])
    fetchTasks() // Refresh after bulk operations
  }

  const isSelectionMode = selectedTaskIds.length > 0

  // Empty states
  if (isLoading) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">Loading tasks...</p>
      </div>
    )
  }

  const filteredTaskCount = tasks.length
  const allTasksCompleted = tasks.length > 0 && tasks.every((t) => t.completed)

  return (
    <div className="pb-24">
      {/* Header with Filter & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <TaskFilterToggle currentFilter={filter} onFilterChange={setFilter} />

        <div className="flex items-center gap-2">
          {/* Sort Toggle */}
          <button
            onClick={() =>
              setSortBy(sortBy === 'created_at' ? 'due_date' : 'created_at')
            }
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sortBy === 'created_at' ? 'Newest First' : 'By Due Date'}
          </button>

          {/* New Task Button */}
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF9500] hover:bg-[#FF8000] text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTaskCount === 0 ? (
        <div className="text-center py-16 text-gray-500">
          {filter === 'all' && (
            <>
              <p className="text-lg">No tasks yet</p>
              <p className="text-sm mt-2">Click "New Task" to add your first task</p>
            </>
          )}
          {filter === 'active' && <p className="text-lg">No active tasks</p>}
          {filter === 'completed' && <p className="text-lg">No completed tasks</p>}
        </div>
      ) : allTasksCompleted && filter === 'all' ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">All tasks completed! 🎉</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskClick={handleTaskClick}
              isSelectionMode={isSelectionMode}
              isSelected={selectedTaskIds.includes(task.id)}
              onSelectionToggle={handleSelectionToggle}
            />
          ))}
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          listId={listId}
          mode="create"
          onClose={handleCloseForm}
        />
      )}

      {/* Edit Task Form Modal */}
      {editingTask && (
        <TaskForm
          listId={listId}
          task={editingTask}
          mode="edit"
          onClose={handleCloseForm}
        />
      )}

      {/* Bulk Action Bar */}
      <BulkActionBar
        selectedTaskIds={selectedTaskIds}
        onClearSelection={handleClearSelection}
      />
    </div>
  )
}
