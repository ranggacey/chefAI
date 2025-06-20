import React from 'react'
import { motion } from 'framer-motion'
import { Search, Bell, Settings, Sparkles } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export const Header: React.FC = () => {
  const { setActiveView, user } = useStore()
  
  return (
    <header className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo for mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/images/logo.png" alt="Chef AI Logo" className="w-5 h-5 object-contain" />
          </div>
          <span className="text-lg font-medium">Chef AI</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-auto">
          <Input
            placeholder="Search recipes, ingredients..."
            leftIcon={<Search className="w-4 h-4" />}
            className="bg-neutral-50 border-neutral-200"
          />
        </div>
        
        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-neutral-900">
              Welcome back, {user?.email?.split('@')[0] || 'Chef'}!
            </p>
            <p className="text-xs text-neutral-500">Ready to cook something amazing?</p>
          </div>
          
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full"></span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
            
            <Button 
              variant="primary" 
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => setActiveView('ai-chat')}
            >
              Generate Recipe
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}