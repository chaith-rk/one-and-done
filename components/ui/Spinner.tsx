'use client'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'gray'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
}

const colorClasses = {
  primary: 'border-[#FF9500] border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-400 border-t-transparent',
}

export default function Spinner({ size = 'md', color = 'primary', className = '' }: SpinnerProps) {
  return (
    <div
      className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <Spinner size="lg" />
      <p className="mt-4 text-sm">{message}</p>
    </div>
  )
}
