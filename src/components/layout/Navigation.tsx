import React from 'react'
import { motion } from 'framer-motion'
import { 
  Home, 
  Package, 
  BookOpen, 
  Calendar, 
  MessageCircle,
  ChefHat,
  LogOut
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'recipes', label: 'Recipes', icon: BookOpen },
  { id: 'meal-plan', label: 'Meal Plan', icon: Calendar },
  { id: 'ai-chat', label: 'AI Chef', icon: MessageCircle },
] as const

export const Navigation: React.FC = () => {
  const { activeView, setActiveView, user, setUser } = useStore()
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Error signing out')
    }
  }
  
  return (
    <nav className="bg-white border-r border-neutral-200 w-64 h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Chef AI</h1>
            <p className="text-sm text-neutral-500">Smart Kitchen Assistant</p>
          </div>
        </div>
      </div>
      
      {/* Navigation Items */}
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            
            return (
              <li key={item.id}>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                    />
                  )}
                </motion.button>
              </li>
            )
          })}
        </ul>
      </div>
      
      {/* User Profile */}
      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 mb-3">
          <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-primary-400 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">
              {user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-neutral-500">Chef Level: Beginner</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </nav>
  )
}