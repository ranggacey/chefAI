import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useStore } from './store/useStore'
import { AuthPage } from './components/auth/AuthPage'
import { AuthCallback } from './components/auth/AuthCallback'
import { Navigation } from './components/layout/Navigation'
import { Header } from './components/layout/Header'
import { Dashboard } from './components/dashboard/Dashboard'
import { InventoryManager } from './components/inventory/InventoryManager'
import { RecipeManager } from './components/recipes/RecipeManager'
import { MealPlanManager } from './components/meal-plan/MealPlanManager'
import { AIChat } from './components/ai/AIChat'

// Komponen layout utama
const AppLayout = () => {
  const { activeView } = useStore();
  
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
  
  return (
    <div className="h-screen bg-neutral-50 flex">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

function App() {
  const { setUser, user } = useStore()
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
  
  // Show loading while checking auth
  if (!isAuthChecked) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 14.5L4 19L5.5 20.5L10 16M15 5L9 11L13 15L19 9M15 5L19 9M15 5L19 1M19 9L23 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-white">Chef AI</h1>
          <p className="text-white text-opacity-80">Loading your kitchen...</p>
        </div>
      </div>
    )
  }
  
    return (
    <BrowserRouter>
      <Routes>
        {/* Rute autentikasi */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage onAuthSuccess={() => {}} />} 
        />
        
        {/* Rute aplikasi yang dilindungi */}
        <Route 
          path="/*" 
          element={user ? <AppLayout /> : <Navigate to="/auth" replace />} 
        />
      </Routes>
      
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
    </BrowserRouter>
  )
}

export default App