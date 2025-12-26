'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const confirmButtonStyles = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-in fade-in duration-200"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-red-600' : 'text-yellow-600'}`} />
            </div>
            <div className="flex-1">
              <h3 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <p id="confirm-dialog-description" className="mt-2 text-sm text-gray-600">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonStyles[variant]}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
