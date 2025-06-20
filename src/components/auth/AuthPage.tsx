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
  Users,
  BookOpen,
  Calendar,
  Utensils,
  Heart
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
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

        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password
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

  const features = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI Recipe Generation",
      description: "Create unique recipes using your available ingredients with advanced AI technology",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Recipe Collection",
      description: "Save, organize, and share your favorite recipes with beautiful collections",
      color: "from-blue-400 to-purple-500"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Meal Planning",
      description: "Plan your weekly meals intelligently and reduce food waste effectively",
      color: "from-green-400 to-teal-500"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Kitchen Management",
      description: "Track ingredients, expiry dates, and kitchen inventory with smart alerts",
      color: "from-pink-400 to-red-500"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {/* Left Side - Features Showcase */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white bg-opacity-10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-96 h-96 bg-yellow-300 bg-opacity-20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-pink-300 bg-opacity-15 rounded-full blur-2xl animate-bounce-gentle"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-blue-300 bg-opacity-10 rounded-full blur-2xl animate-pulse"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Logo Section */}
            <div className="flex items-center gap-6 mb-12">
              <motion.div 
                className="w-20 h-20 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-lg border border-white border-opacity-30"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ChefHat className="w-10 h-10" />
              </motion.div>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                  Chef AI
                </h1>
                <p className="text-2xl text-white text-opacity-90 font-light">Smart Kitchen Assistant</p>
              </div>
            </div>
            
            {/* Main Heading */}
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your Kitchen Experience with{' '}
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-white text-opacity-90 mb-16 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Discover the future of cooking with our intelligent assistant that helps you create amazing meals, 
              manage ingredients efficiently, and plan your culinary journey like never before.
            </motion.p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="flex items-start gap-5 p-6 bg-white bg-opacity-10 rounded-2xl backdrop-blur-lg border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2 text-white">{feature.title}</h3>
                      <p className="text-white text-opacity-80 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Section */}
            <motion.div 
              className="flex items-center gap-12 mt-16 pt-8 border-t border-white border-opacity-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-white text-opacity-70">Recipes Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">5K+</div>
                <div className="text-white text-opacity-70">Happy Chefs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">99%</div>
                <div className="text-white text-opacity-70">Satisfaction Rate</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-4 mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chef AI</h1>
              <p className="text-gray-600">Smart Kitchen Assistant</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-10">
                <motion.h2 
                  className="text-4xl font-bold text-gray-900 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {isLogin ? 'Welcome Back!' : 'Join Chef AI'}
                </motion.h2>
                <motion.p 
                  className="text-gray-600 text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {isLogin 
                    ? 'Sign in to continue your culinary journey' 
                    : 'Create your account and start cooking smarter'
                  }
                </motion.p>
              </div>

              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      placeholder="chef@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
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
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 text-gray-900 placeholder-gray-400"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span className="text-lg">{isLogin ? 'Sign In' : 'Create Account'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-orange-600 hover:text-orange-700 font-bold transition-colors"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* Demo Account Info */}
              <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border-2 border-orange-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <span className="font-bold text-orange-800">Try Demo Account</span>
                </div>
                <p className="text-orange-700">
                  <strong>Email:</strong> demo@chefai.com<br />
                  <strong>Password:</strong> password123
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}