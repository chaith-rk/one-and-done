'use client'

import type { List } from '@/types/database.types'

interface ListItemProps {
  list: List
  isActive: boolean
  onSelect: () => void
}

export default function ListItem({ list, isActive, onSelect }: ListItemProps) {
  return (
    <div
      className={`
        px-4 py-3 cursor-pointer transition-colors
        ${isActive
          ? 'bg-orange-100 border-l-4 border-[#FF9500]'
          : 'border-l-4 border-transparent hover:bg-gray-50'
        }
      `}
      onClick={onSelect}
    >
      <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
        {list.name}
      </span>
    </div>
  )
}
