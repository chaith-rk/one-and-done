'use client'

import type { TaskFilter } from '@/types/database.types'

interface TaskFilterToggleProps {
  currentFilter: TaskFilter
  onFilterChange: (filter: TaskFilter) => void
}

export default function TaskFilterToggle({
  currentFilter,
  onFilterChange,
}: TaskFilterToggleProps) {
  const filters: { value: TaskFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ]

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors first:rounded-l-lg last:rounded-r-lg ${
            currentFilter === filter.value
              ? 'bg-[#FF9500] text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
