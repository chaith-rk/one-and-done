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

  // Sort lists: Inbox first, then others by newest first
  const sortedLists = [...lists].sort((a, b) => {
    // Inbox always first
    if (a.is_inbox) return -1
    if (b.is_inbox) return 1

    // Other lists sorted by created_at DESC (newest first)
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

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
          {/* All Tasks - Special View */}
          <button
            onClick={() => handleListSelect('all-tasks')}
            className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors border-b border-gray-200 ${
              currentListId === 'all-tasks' ? 'bg-orange-50 border-l-4 border-l-[#FF9500]' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#FF9500]"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className={`font-medium ${currentListId === 'all-tasks' ? 'text-[#FF9500]' : 'text-gray-700'}`}>
                All Tasks
              </span>
            </div>
          </button>

          {sortedLists.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              No lists yet
            </div>
          ) : (
            sortedLists.map((list) => (
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
