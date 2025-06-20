import React, { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'
import { AuthPage } from './components/auth/AuthPage'
import { Navigation } from './components/layout/Navigation'
import { Header } from './components/layout/Header'
import { Dashboard } from './components/dashboard/Dashboard'
import { InventoryManager } from './components/inventory/InventoryManager'
import { RecipeManager } from './components/recipes/RecipeManager'
import { MealPlanManager } from './components/meal-plan/MealPlanManager'
import { AIChat } from './components/ai/AIChat'

function App() {
  const { activeView, setUser, user } = useStore()
  const [isAuthChecked, setIsAuthChecked] = useState(false)
  
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        })
      }
      setIsAuthChecked(true)
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        })
      } else {
        setUser(null)
      }
      setIsAuthChecked(true)
    })
    
    return () => subscription.unsubscribe()
  }, [setUser])
  
  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'inventory':
        return <InventoryManager />
      case 'recipes':
        return <RecipeManager />
      case 'meal-plan':
        return <MealPlanManager />
      case 'ai-chat':
        return <AIChat />
      default:
        return <Dashboard />
    }
  }
  
  // Show loading while checking auth
  if (!isAuthChecked) {
    return (
      <div className="h-screen bg-gradient-to-br from-primary-500 via-accent-500 to-secondary-500 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 14.5L4 19L5.5 20.5L10 16M15 5L9 11L13 15L19 9M15 5L19 9M15 5L19 1M19 9L23 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Chef AI</h1>
          <p className="text-white text-opacity-80">Loading your kitchen...</p>
        </div>
      </div>
    )
  }
  
  // Show auth page if not authenticated
  if (!user) {
    return (
      <>
        <AuthPage onAuthSuccess={() => {}} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#1C1917',
              borderRadius: '12px',
              border: '1px solid #E7E5E4',
              boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            },
          }}
        />
      </>
    )
  }
  
  return (
    <div className="h-screen bg-neutral-50 flex">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1C1917',
            borderRadius: '12px',
            border: '1px solid #E7E5E4',
            boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        }}
      />
    </div>
  )
}

export default App