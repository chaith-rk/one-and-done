'use client'

import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import TaskItem from './TaskItem'
import TaskForm from './TaskForm'
import TaskFilterToggle from './TaskFilterToggle'
import { getTasks, getAllTasks } from '@/lib/actions/tasks'
import type { Task, TaskFilter, List } from '@/types/database.types'

interface TaskListProps {
  listId: string
  listName: string
  lists: List[]
}

export default function TaskList({ listId, listName, lists }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [sortByDueDate, setSortByDueDate] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const isAllTasksView = listId === 'all-tasks'

  // Fetch tasks whenever listId or filter changes
  useEffect(() => {
    fetchTasks()
  }, [listId, filter])

  const fetchTasks = async () => {
    setIsLoading(true)

    const result = isAllTasksView
      ? await getAllTasks({ filter })
      : await getTasks({
          list_id: listId,
          filter,
          sort_by: 'created_at', // Always fetch by created_at, we'll sort in UI
        })

    if (result.success && result.data) {
      setTasks(result.data)
    }

    setIsLoading(false)
  }

  // Sort and organize tasks
  const getSortedTasks = () => {
    let taskList = [...tasks]

    // Separate active and completed
    const activeTasks = taskList.filter((t) => !t.completed)
    const completedTasks = taskList.filter((t) => t.completed)

    // Sort active tasks
    if (sortByDueDate) {
      // Sort by due date: overdue first, then upcoming (earliest first), then no due date
      activeTasks.sort((a, b) => {
        const now = new Date()
        const dateA = a.due_date ? new Date(a.due_date) : null
        const dateB = b.due_date ? new Date(b.due_date) : null

        // No due date goes to end
        if (!dateA && dateB) return 1
        if (dateA && !dateB) return -1
        if (!dateA && !dateB) return 0

        // Both have due dates - compare them
        return dateA!.getTime() - dateB!.getTime()
      })
    } else {
      // Sort by most recently edited (updated_at DESC)
      activeTasks.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    }

    // Sort completed tasks by completed_at (most recently completed first)
    completedTasks.sort((a, b) => {
      const timeA = a.completed_at ? new Date(a.completed_at).getTime() : 0
      const timeB = b.completed_at ? new Date(b.completed_at).getTime() : 0
      return timeB - timeA
    })

    return [...activeTasks, ...completedTasks]
  }

  // Check if task is overdue
  const isOverdue = (task: Task) => {
    if (!task.due_date || task.completed) return false
    const now = new Date()
    const dueDate = new Date(task.due_date)
    return dueDate < now
  }

  // Get list name for a task
  const getListName = (task: Task): string => {
    const list = lists.find((l) => l.id === task.list_id)
    return list?.name || 'Unknown'
  }

  const handleTaskClick = (task: Task) => {
    setEditingTask(task)
  }

  const handleCloseForm = () => {
    setShowTaskForm(false)
    setEditingTask(null)
    fetchTasks() // Refresh after form closes
  }

  const handleTaskToggle = (taskId: string) => {
    // Optimistically update UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completed_at: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    )
    // Server update happens in TaskItem
  }

  const handleTaskDelete = (taskId: string) => {
    // Optimistically remove from UI
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
    // Server delete happens in TaskItem
  }


  // Empty states
  if (isLoading) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">Loading tasks...</p>
      </div>
    )
  }

  const sortedTasks = getSortedTasks()
  const activeTasks = sortedTasks.filter((t) => !t.completed)
  const completedTasks = sortedTasks.filter((t) => t.completed)
  const filteredTaskCount = tasks.length
  const allTasksCompleted = tasks.length > 0 && tasks.every((t) => t.completed)

  return (
    <div className="pb-24">
      {/* Header with Filter & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <TaskFilterToggle currentFilter={filter} onFilterChange={setFilter} />

        <div className="flex items-center gap-2">
          {/* Sort Toggle */}
          <label className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={sortByDueDate}
              onChange={(e) => setSortByDueDate(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#FF9500] focus:ring-[#FF9500]"
            />
            <span>Sort by Due Date</span>
          </label>

          {/* New Task Button - only show for specific lists, not All Tasks */}
          {!isAllTasksView && (
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF9500] hover:bg-[#FF8000] text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          )}
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
          {/* Active Tasks */}
          {activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskClick={handleTaskClick}
              onTaskToggle={handleTaskToggle}
              onTaskDelete={handleTaskDelete}
              isOverdue={isOverdue(task)}
              listName={isAllTasksView ? getListName(task) : undefined}
            />
          ))}

          {/* Separator between active and completed */}
          {activeTasks.length > 0 && completedTasks.length > 0 && (
            <div className="border-t-2 border-gray-200 my-2" />
          )}

          {/* Completed Tasks */}
          {completedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onTaskClick={handleTaskClick}
              onTaskToggle={handleTaskToggle}
              onTaskDelete={handleTaskDelete}
              isOverdue={false}
              listName={isAllTasksView ? getListName(task) : undefined}
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
    </div>
  )
}
