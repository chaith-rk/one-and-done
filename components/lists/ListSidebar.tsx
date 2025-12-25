'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import ListItem from './ListItem'
import CreateListButton from './CreateListButton'
import type { List } from '@/types/database.types'

interface ListSidebarProps {
  lists: List[]
  currentListId?: string
  onListSelect?: (listId: string) => void
}

export default function ListSidebar({ lists, currentListId, onListSelect }: ListSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleListSelect = (listId: string) => {
    if (onListSelect) {
      onListSelect(listId)
    }
    setIsMobileOpen(false) // Close mobile menu after selection
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-50
          w-72 bg-white border-r border-gray-200
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Lists</h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <CreateListButton />
        </div>

        {/* List Items */}
        <div className="flex-1 overflow-y-auto">
          {lists.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No lists yet
            </div>
          ) : (
            lists.map((list) => (
              <ListItem
                key={list.id}
                list={list}
                isActive={list.id === currentListId}
                onSelect={() => handleListSelect(list.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 p-2 bg-white border border-gray-300 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </>
  )
}
