import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  BookOpen, 
  Calendar, 
  TrendingUp,
  Clock,
  AlertTriangle,
  Sparkles,
  ChefHat,
  Users,
  Utensils,
  Plus,
  ArrowRight,
  Star,
  Zap
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { StatsCard } from './StatsCard'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

export const Dashboard: React.FC = () => {
  const { 
    ingredients, 
    recipes, 
    mealPlans, 
    fetchIngredients, 
    fetchRecipes, 
    fetchMealPlans,
    setActiveView,
    user 
  } = useStore()
  
  useEffect(() => {
    fetchIngredients()
    fetchRecipes()
    fetchMealPlans()
  }, [])
  
  // Calculate stats
  const expiringIngredients = ingredients.filter(ing => {
    if (!ing.expiry_date) return false
    const expiryDate = new Date(ing.expiry_date)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3 && diffDays >= 0
  })
  
  const recentRecipes = recipes.slice(0, 3)
  const todayMeals = mealPlans.filter(meal => {
    const today = new Date().toISOString().split('T')[0]
    return meal.date === today
  })

  const quickActions = [
    {
      title: "Add Ingredients",
      description: "Stock your kitchen inventory",
      icon: <Package className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      action: () => setActiveView('inventory')
    },
    {
      title: "Generate Recipe",
      description: "AI-powered recipe creation",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      action: () => setActiveView('ai-chat')
    },
    {
      title: "Plan Meals",
      description: "Organize your weekly menu",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      action: () => setActiveView('meal-plan')
    }
  ]
  
  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="p-6 space-y-8">
        {/* Hero Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 rounded-3xl p-8 text-white"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-4 right-4 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-yellow-300 bg-opacity-20 rounded-full blur-xl animate-bounce-gentle"></div>
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-pink-300 bg-opacity-15 rounded-full blur-lg animate-float"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4 mb-4"
                >
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-lg">
                    <ChefHat className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0] || 'Chef'}! 👨‍🍳</h1>
                    <p className="text-white text-opacity-90 text-lg">Ready to create something delicious today?</p>
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white text-opacity-80 text-lg mb-6 max-w-2xl"
                >
                  Your AI-powered kitchen assistant is ready to help you discover new recipes, manage ingredients, and plan amazing meals.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button 
                    variant="accent" 
                    size="lg"
                    leftIcon={<Sparkles className="w-5 h-5" />}
                    onClick={() => setActiveView('ai-chat')}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-lg border border-white border-opacity-30"
                  >
                    Generate New Recipe
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="lg"
                    leftIcon={<Plus className="w-5 h-5" />}
                    onClick={() => setActiveView('inventory')}
                    className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-lg border border-white border-opacity-20 text-white"
                  >
                    Add Ingredients
                  </Button>
                </motion.div>
              </div>
              
              {/* Stats Preview */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="hidden lg:flex flex-col gap-4"
              >
                <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-30">
                  <div className="text-2xl font-bold">{ingredients.length}</div>
                  <div className="text-sm text-white text-opacity-80">Ingredients</div>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-4 border border-white border-opacity-30">
                  <div className="text-2xl font-bold">{recipes.length}</div>
                  <div className="text-sm text-white text-opacity-80">Recipes</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group cursor-pointer"
                onClick={action.action}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-gray-200">
                  <div className={`w-14 h-14 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  <div className="flex items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                    <span className="text-sm font-medium">Get started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kitchen Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Ingredients"
              value={ingredients.length}
              change="+3 this week"
              changeType="positive"
              icon={<Package className="w-6 h-6" />}
              color="primary"
            />
            <StatsCard
              title="Saved Recipes"
              value={recipes.length}
              change="+2 new recipes"
              changeType="positive"
              icon={<BookOpen className="w-6 h-6" />}
              color="secondary"
            />
            <StatsCard
              title="Planned Meals"
              value={mealPlans.length}
              change="This week"
              changeType="neutral"
              icon={<Calendar className="w-6 h-6" />}
              color="accent"
            />
            <StatsCard
              title="Expiring Soon"
              value={expiringIngredients.length}
              change="Use within 3 days"
              changeType={expiringIngredients.length > 0 ? "warning" : "positive"}
              icon={<AlertTriangle className="w-6 h-6" />}
              color="warning"
            />
          </div>
        </motion.div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expiring Ingredients */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Expiring Soon</h3>
                    <p className="text-sm text-gray-600">Use these ingredients first</p>
                  </div>
                </div>
                <Badge variant="warning" size="sm">
                  {expiringIngredients.length} items
                </Badge>
              </div>
              
              {expiringIngredients.length > 0 ? (
                <div className="space-y-4">
                  {expiringIngredients.slice(0, 5).map((ingredient) => (
                    <motion.div 
                      key={ingredient.id} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-shadow"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-orange-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{ingredient.name}</p>
                          <p className="text-sm text-gray-600">
                            {ingredient.quantity} {ingredient.unit}
                          </p>
                        </div>
                      </div>
                      <Badge variant="warning" size="sm">
                        {Math.ceil((new Date(ingredient.expiry_date!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                      </Badge>
                    </motion.div>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => setActiveView('inventory')}
                  >
                    View All Ingredients
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">All Fresh!</h4>
                  <p className="text-gray-600 text-sm">All your ingredients are fresh and ready to use.</p>
                </div>
              )}
            </Card>
          </motion.div>
          
          {/* Recent Recipes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Recipes</h3>
                    <p className="text-sm text-gray-600">Your latest culinary creations</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveView('recipes')}
                >
                  View All
                </Button>
              </div>
              
              {recentRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {recentRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="group cursor-pointer"
                    >
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <Utensils className="w-4 h-4 text-white" />
                          </div>
                          <Badge variant="neutral" size="sm">
                            {recipe.difficulty}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">{recipe.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{recipe.prep_time + recipe.cook_time} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{recipe.servings} servings</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">No recipes yet</h4>
                  <p className="text-gray-600 mb-4 text-sm">Let's create your first recipe with AI!</p>
                  <Button 
                    variant="primary"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    onClick={() => setActiveView('ai-chat')}
                  >
                    Generate Recipe
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
        
        {/* Today's Meals */}
        {todayMeals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Today's Meals</h3>
                    <p className="text-sm text-gray-600">Your planned meals for today</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setActiveView('meal-plan')}
                >
                  View Meal Plan
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {todayMeals.map((meal, index) => (
                  <motion.div 
                    key={meal.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" size="sm">
                        {meal.meal_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{meal.notes || 'No recipe selected'}</p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}