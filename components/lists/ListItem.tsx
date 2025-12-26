'use client'

import { Home, List as ListIcon } from 'lucide-react'
import type { List } from '@/types/database.types'

interface ListItemProps {
  list: List
  isActive: boolean
  onSelect: () => void
}

export default function ListItem({ list, isActive, onSelect }: ListItemProps) {
  const isHome = list.is_inbox

  return (
    <button
      className={`
        w-full px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors text-left
        ${isActive
          ? 'bg-orange-50 border-l-4 border-[#FF9500]'
          : 'border-l-4 border-transparent hover:bg-gray-50'
        }
        ${isHome ? 'border-b border-gray-200' : ''}
      `}
      onClick={onSelect}
      aria-current={isActive ? 'page' : undefined}
    >
      {isHome ? (
        <Home className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#FF9500]' : 'text-gray-500'}`} />
      ) : (
        <ListIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#FF9500]' : 'text-gray-400'}`} />
      )}
      <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
        {isHome ? 'Home' : list.name}
      </span>
    </button>
  )
}
