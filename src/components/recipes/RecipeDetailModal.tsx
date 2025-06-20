import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Clock, 
  Users, 
  ChefHat, 
  Utensils,
  Star,
  Heart,
  Share2,
  Bookmark
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import type { GeneratedRecipe } from '../../lib/gemini'

interface RecipeDetailModalProps {
  isOpen: boolean
  onClose: () => void
  recipe: GeneratedRecipe | null
  onSave?: () => void
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  isOpen,
  onClose,
  recipe,
  onSave
}) => {
  if (!recipe) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-strong max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="relative">
              {/* Hero Section */}
              <div className="bg-gradient-to-r from-primary-500 via-accent-500 to-secondary-500 p-8 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="pr-12">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-lg">
                      <ChefHat className="w-6 h-6" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {recipe.cuisine}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-3">{recipe.title}</h1>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    {recipe.description}
                  </p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-white/80" />
                      <span>{recipe.prepTime + recipe.cookTime} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-white/80" />
                      <span>{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-white/80" />
                      <span>{recipe.difficulty} level</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="absolute -bottom-6 left-8 right-8 flex gap-3">
                {onSave && (
                  <Button
                    variant="primary"
                    size="lg"
                    leftIcon={<Heart className="w-5 h-5" />}
                    onClick={onSave}
                    className="shadow-strong"
                  >
                    Save Recipe
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<Share2 className="w-5 h-5" />}
                  className="bg-white shadow-strong"
                >
                  Share
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  leftIcon={<Bookmark className="w-5 h-5" />}
                  className="bg-white shadow-strong"
                >
                  Bookmark
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="pt-12 pb-8 px-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Ingredients */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Utensils className="w-4 h-4 text-primary-600" />
                    </div>
                    Ingredients
                  </h2>
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                      >
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="w-2 h-2 bg-primary-500 rounded-full" />
                        </div>
                        <span className="text-neutral-800 font-medium">{ingredient}</span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
                
                {/* Instructions */}
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center">
                      <ChefHat className="w-4 h-4 text-accent-600" />
                    </div>
                    Instructions
                  </h2>
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                      >
                        <div className="w-8 h-8 bg-accent-100 text-accent-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-neutral-800 leading-relaxed">{instruction}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </div>
              
              {/* Tips & Story */}
              {(recipe.tips && recipe.tips.length > 0) || recipe.story ? (
                <div className="mt-8 grid lg:grid-cols-2 gap-8">
                  {/* Chef's Tips */}
                  {recipe.tips && recipe.tips.length > 0 && (
                    <Card className="p-6">
                      <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                          <Star className="w-4 h-4 text-secondary-600" />
                        </div>
                        Chef's Tips
                      </h2>
                      <div className="space-y-3">
                        {recipe.tips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-secondary-50"
                          >
                            <Star className="w-4 h-4 text-secondary-500 mt-1 flex-shrink-0" />
                            <p className="text-neutral-700">{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  )}
                  
                  {/* Recipe Story */}
                  {recipe.story && (
                    <Card className="p-6">
                      <h2 className="text-xl font-bold text-neutral-900 mb-4">Recipe Story</h2>
                      <p className="text-neutral-700 leading-relaxed italic">
                        {recipe.story}
                      </p>
                    </Card>
                  )}
                </div>
              ) : null}
              
              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <Card className="mt-8 p-6">
                  <h2 className="text-lg font-semibold text-neutral-900 mb-3">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
} 