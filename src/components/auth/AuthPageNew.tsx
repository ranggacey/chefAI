import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChefHat, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Calendar,
  Utensils,
  ShieldCheck
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface AuthPageProps {
  onAuthSuccess: () => void
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isLogin) {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        })

        if (error) {
          // Handle specific email confirmation error
          if (error.message.includes('Email not confirmed')) {
            toast.error('Please check your email and click the confirmation link before signing in.', {
              duration: 6000,
              style: {
                maxWidth: '400px',
              }
            })
          } else {
            throw error
          }
          return
        }
        
        toast.success('Welcome back, Chef!')
        onAuthSuccess()
      } else {
        // Register
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          return
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          return
        }

        // Gunakan URL situs yang benar untuk redirect
        const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
        
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${siteUrl}/auth/callback`
          }
        })

        if (error) throw error
        
        toast.success('Account created successfully! Please check your email to confirm your account before signing in.', {
          duration: 8000,
          style: {
            maxWidth: '400px',
          }
        })
        
        // Switch to login mode after successful registration
        setIsLogin(true)
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Benefits of using the app
  const benefits = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI-Powered Recipes",
      description: "Generate personalized recipes based on your available ingredients"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Meal Planning",
      description: "Plan your weekly meals with smart suggestions and reminders"
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      title: "Inventory Management",
      description: "Track and manage your kitchen inventory with expiry alerts"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Recipe Collection",
      description: "Save and organize your favorite recipes in one place"
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col lg:flex-row">
      {/* Left side - Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header with logo */}
        <div className="px-8 py-6 border-b border-white/10">
          <div className="flex items-center gap-3 max-w-md mx-auto w-full">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <span className="text-xl font-medium">Chef AI</span>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12">
          <div className="max-w-md mx-auto w-full">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? 'Welcome back' : 'Create account'}
              </h1>
              <p className="text-neutral-400 mb-8">
                {isLogin 
                  ? 'Sign in to continue to Chef AI' 
                  : 'Join Chef AI to start your culinary journey'
                }
              </p>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                  />
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-neutral-300">
                    Password
                  </label>
                  {isLogin && (
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-300 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="pt-1 pb-2">
                      <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••••"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                          required
                        />
                        <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                      </div>
                      <p className="mt-2 text-xs text-neutral-500">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
              
              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
                </button>
              </div>
            </form>
            
            <div className="mt-8 flex items-center gap-2 justify-center">
              <ShieldCheck className="w-4 h-4 text-neutral-500" />
              <span className="text-xs text-neutral-500">Secure authentication powered by Supabase</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Features showcase */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-neutral-900 to-neutral-950 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-center p-16 z-10">
          <div className="max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Transform your cooking experience with 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400"> Chef AI</span>
              </h2>
              
              <p className="text-neutral-400 text-lg mb-12">
                Chef AI uses artificial intelligence to help you create amazing meals, 
                manage ingredients efficiently, and plan your culinary journey.
              </p>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{benefit.title}</h3>
                      <p className="text-neutral-400">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 pt-8 border-t border-neutral-800">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[...Array(4)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-neutral-700 to-neutral-800 border border-neutral-800 flex items-center justify-center text-xs font-medium"
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-medium">Join 5,000+ chefs</div>
                    <div className="text-sm text-neutral-400">who are already using Chef AI</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 