import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Utensils,
  Heart,
  BookOpen,
  Plus
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { RecipeDetailModal } from './RecipeDetailModal'
import type { GeneratedRecipe } from '../../lib/gemini'

export const RecipeManager: React.FC = () => {
  const { recipes, fetchRecipes, setCurrentRecipe, setActiveView } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedCuisine, setSelectedCuisine] = useState('All')
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  useEffect(() => {
    fetchRecipes()
  }, [])
  
  const difficulties = ['All', 'easy', 'medium', 'hard']
  const cuisines = ['All', ...Array.from(new Set(recipes.map(r => r.cuisine)))]
  
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty
    const matchesCuisine = selectedCuisine === 'All' || recipe.cuisine === selectedCuisine
    
    return matchesSearch && matchesDifficulty && matchesCuisine
  })
  
  const handleRecipeClick = (recipe: any) => {
    // Convert database recipe to GeneratedRecipe format
    const convertedRecipe: GeneratedRecipe = {
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prep_time,
      cookTime: recipe.cook_time,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      tags: recipe.tags || [],
      tips: [],
      story: ''
    }
    
    setSelectedRecipe(convertedRecipe)
    setIsModalOpen(true)
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Recipe Collection</h1>
          <p className="text-neutral-600">Your saved recipes and AI-generated creations</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setActiveView('ai-chat')}
        >
          Generate Recipe
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search recipes..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty === 'All' ? 'All Difficulties' : difficulty}
                </option>
              ))}
            </select>
            
            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="px-4 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {cuisines.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine === 'All' ? 'All Cuisines' : cuisine}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>
      
      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <Card hover className="h-full flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                      {recipe.title}
                    </h3>
                    <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                      {recipe.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="primary" size="sm">
                        <Clock className="w-3 h-3 mr-1" />
                        {recipe.prep_time + recipe.cook_time} min
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        <Users className="w-3 h-3 mr-1" />
                        {recipe.servings} servings
                      </Badge>
                      <Badge variant="accent" size="sm">
                        <Utensils className="w-3 h-3 mr-1" />
                        {recipe.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="neutral" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4 border-t border-neutral-200">
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<BookOpen className="w-4 h-4" />}
                      onClick={() => handleRecipeClick(recipe)}
                      className="flex-1"
                    >
                      View Recipe
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Heart className="w-4 h-4" />}
                    >
                      <span className="sr-only">Favorite</span>
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No recipes found</h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm || selectedDifficulty !== 'All' || selectedCuisine !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Start by generating your first recipe with AI'
            }
          </p>
          <Button
            variant="primary"
            onClick={() => setActiveView('ai-chat')}
          >
            Generate Recipe
          </Button>
        </Card>
      )}
      
      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recipe={selectedRecipe}
      />
    </div>
  )
}