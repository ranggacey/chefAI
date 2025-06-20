import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    primary: 'bg-blue-100 text-blue-800 border-blue-200',
    secondary: 'bg-green-100 text-green-800 border-green-200',
    accent: 'bg-purple-100 text-purple-800 border-purple-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-orange-100 text-orange-800 border-orange-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }
  
  return (
    <span className={`
      inline-flex items-center font-medium rounded-full border
      ${variantClasses[variant]} ${sizeClasses[size]} ${className}
    `}>
      {children}
    </span>
  )
}