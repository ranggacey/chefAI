import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Sparkles, 
  ChefHat, 
  Clock, 
  Users, 
  Utensils,
  BookOpen,
  Heart,
  Loader2,
  Trash2,
  RotateCcw
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { geminiService, testGeminiConnection, testGeminiDirect, type RecipeRequest, type GeneratedRecipe } from '../../lib/gemini'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { RecipeDetailModal } from '../recipes/RecipeDetailModal'
import toast from 'react-hot-toast'

interface Message {
  id: string
  type: 'user' | 'ai' | 'recipe'
  content: string
  recipe?: GeneratedRecipe
  timestamp: Date
}

export const AIChat: React.FC = () => {
  const { 
    ingredients, 
    addRecipe, 
    isGeneratingRecipe, 
    setIsGeneratingRecipe,
    chatMessages,
    fetchChatHistory,
    addChatMessage,
    startNewChatSession,
    clearChatHistory
  } = useStore()
  
  const [inputValue, setInputValue] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<GeneratedRecipe | null>(null)
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Convert Supabase chat messages to local format
  const messages: Message[] = chatMessages.map(msg => ({
    id: msg.id,
    type: (msg.metadata?.recipe ? 'recipe' : msg.message_type) as 'user' | 'ai' | 'recipe',
    content: msg.content,
    recipe: msg.metadata?.recipe || undefined,
    timestamp: new Date(msg.created_at)
  }))
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  useEffect(() => {
    // Load chat history when component mounts
    fetchChatHistory()
    
    // Start new session if none exists
    if (!chatMessages.length) {
      startNewChatSession()
      
      // Add welcome message if no chat history
      setTimeout(async () => {
        try {
          await addMessage('ai', "Hello! I'm your AI Chef assistant. I can help you create amazing recipes using the ingredients you have, answer cooking questions, and provide culinary tips. What would you like to cook today?", { isWelcome: true })
        } catch (error) {
          console.error('Failed to add welcome message:', error)
        }
      }, 1000)
    }
  }, [])
  
  const handleTestConnection = async () => {
    setIsGeneratingRecipe(true)
    try {
      console.log('🚀 Starting AI connection test...')
      
      // Test direct API first
      console.log('📡 Step 1: Testing direct API...')
      const directTest = await testGeminiDirect()
      
      if (directTest) {
        console.log('✅ Direct API test passed, testing service layer...')
        const serviceTest = await testGeminiConnection()
        
        if (serviceTest) {
          toast.success('✅ AI connection fully successful!')
        } else {
          toast.error('⚠️ Direct API works but service layer failed. Check console.')
        }
      } else {
        console.log('❌ Direct API test failed')
        toast.error('❌ AI connection failed! Check console for details.')
      }
    } catch (error: any) {
      console.error('🚨 Connection test error:', error)
      toast.error(`Connection test failed: ${error.message}`)
    } finally {
      setIsGeneratingRecipe(false)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return
    
    setInputValue('')
    setIsGeneratingRecipe(true)
    
    try {
      console.log('Sending message to AI:', inputValue)
      
      // Save user message
      await addMessage('user', inputValue, { selectedIngredients })
      
      // Check if user is asking for a recipe
      const isRecipeRequest = inputValue.toLowerCase().includes('recipe') || 
                             inputValue.toLowerCase().includes('cook') ||
                             inputValue.toLowerCase().includes('make') ||
                             selectedIngredients.length > 0
      
      if (isRecipeRequest && (selectedIngredients.length > 0 || ingredients.length > 0)) {
        console.log('Generating recipe with ingredients:', selectedIngredients)
        await generateRecipe(inputValue)
      } else {
        console.log('Answering cooking question')
        // General cooking question
        const response = await geminiService.answerCookingQuestion(inputValue)
        
        // Save AI response
        await addMessage('ai', response)
      }
    } catch (error: any) {
      console.error('AI Chat error:', error)
      
      // More specific error messages
      let errorMessage = 'Failed to get response. Please try again.'
      
      if (error.message) {
        if (error.message.includes('API key')) {
          errorMessage = 'AI service configuration error. Please contact support.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.'
        } else if (error.message.includes('429')) {
          errorMessage = 'Too many requests. Please wait a moment and try again.'
        } else {
          errorMessage = `AI Error: ${error.message}`
        }
      }
      
      toast.error(errorMessage)
      
      // Add error message to chat
      try {
        await addMessage('ai', `Sorry, I encountered an error: ${errorMessage}. Please try again or contact support if the problem persists.`, { error: true })
      } catch (dbError) {
        console.error('Failed to save error message:', dbError)
      }
    } finally {
      setIsGeneratingRecipe(false)
    }
  }
  
  const generateRecipe = async (prompt: string) => {
    try {
      const ingredientsToUse = selectedIngredients.length > 0 
        ? selectedIngredients 
        : ingredients.slice(0, 8).map(ing => ing.name)
      
      const request: RecipeRequest = {
        ingredients: ingredientsToUse,
        preferences: extractPreferences(prompt),
        mood: prompt
      }
      
      const recipe = await geminiService.generateRecipe(request)
      
      // Save recipe message
      await addMessage('recipe', `I've created a delicious recipe for you using your ingredients!`, { recipe })
      
      setSelectedIngredients([])
    } catch (error) {
      // Save error message
      await addMessage('ai', "I'm sorry, I couldn't generate a recipe right now. Please try again with different ingredients or preferences.", { error: true })
    }
  }
  
  const extractPreferences = (prompt: string): string[] => {
    const preferences: string[] = []
    const lowerPrompt = prompt.toLowerCase()
    
    if (lowerPrompt.includes('vegetarian')) preferences.push('vegetarian')
    if (lowerPrompt.includes('vegan')) preferences.push('vegan')
    if (lowerPrompt.includes('gluten-free')) preferences.push('gluten-free')
    if (lowerPrompt.includes('healthy')) preferences.push('healthy')
    if (lowerPrompt.includes('quick') || lowerPrompt.includes('fast')) preferences.push('quick')
    if (lowerPrompt.includes('easy')) preferences.push('easy')
    
    return preferences
  }
  
  const handleSaveRecipe = async (recipe: GeneratedRecipe) => {
    try {
      await addRecipe({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        servings: recipe.servings,
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine,
        tags: recipe.tags
      })
      
      toast.success('Recipe saved to your collection!')
    } catch (error) {
      toast.error('Failed to save recipe')
    }
  }
  
  const toggleIngredient = (ingredientName: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredientName)
        ? prev.filter(name => name !== ingredientName)
        : [...prev, ingredientName]
    )
  }
  
  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      try {
        await clearChatHistory()
        startNewChatSession()
        toast.success('Chat history cleared')
      } catch (error) {
        toast.error('Failed to clear chat history')
      }
    }
  }
  
  const handleViewRecipe = (recipe: GeneratedRecipe) => {
    setSelectedRecipe(recipe)
    setIsRecipeModalOpen(true)
  }
  
  // Wrapper function to add chat message with defaults
  const addMessage = async (type: 'user' | 'ai' | 'system' | 'recipe', content: string, metadata: any = {}) => {
    return await addChatMessage({
      message_type: type,
      content,
      metadata
    })
  }
  
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-neutral-900">AI Chef Assistant</h1>
            <p className="text-neutral-600">Your personal culinary companion powered by AI</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={startNewChatSession}
            >
              New Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleClearChat}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Clear
            </Button>
          </div>
        </div>
        
        {/* Ingredient Selection */}
        {ingredients.length > 0 && (
          <Card className="mt-4">
            <h3 className="font-semibold text-neutral-900 mb-3">Select ingredients to use:</h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.slice(0, 12).map((ingredient) => (
                <motion.button
                  key={ingredient.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleIngredient(ingredient.name)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedIngredients.includes(ingredient.name)
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {ingredient.name}
                </motion.button>
              ))}
            </div>
            {selectedIngredients.length > 0 && (
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <p className="text-sm text-neutral-600">
                  Selected: {selectedIngredients.join(', ')}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'user' ? (
                <div className="max-w-xs lg:max-w-md bg-primary-500 text-white rounded-2xl rounded-br-md px-4 py-3">
                  <p>{message.content}</p>
                </div>
              ) : message.type === 'recipe' ? (
                <Card className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-primary-500" />
                    <span className="font-medium text-primary-700">Recipe Generated</span>
                  </div>
                  
                  {message.recipe && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900 mb-2">
                          {message.recipe.title}
                        </h3>
                        <p className="text-neutral-600 mb-4">{message.recipe.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="primary" size="sm">
                            <Clock className="w-3 h-3 mr-1" />
                            {message.recipe.prepTime + message.recipe.cookTime} min
                          </Badge>
                          <Badge variant="secondary" size="sm">
                            <Users className="w-3 h-3 mr-1" />
                            {message.recipe.servings} servings
                          </Badge>
                          <Badge variant="accent" size="sm">
                            <Utensils className="w-3 h-3 mr-1" />
                            {message.recipe.difficulty}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">Ingredients:</h4>
                          <ul className="space-y-1 text-sm text-neutral-700">
                            {message.recipe.ingredients.map((ingredient, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">Instructions:</h4>
                          <ol className="space-y-2 text-sm text-neutral-700">
                            {message.recipe.instructions.map((instruction, index) => (
                              <li key={index} className="flex gap-3">
                                <span className="w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                                  {index + 1}
                                </span>
                                {instruction}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                      
                      {message.recipe.tips && message.recipe.tips.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">Chef's Tips:</h4>
                          <ul className="space-y-1 text-sm text-neutral-700">
                            {message.recipe.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Sparkles className="w-3 h-3 text-accent-500 mt-0.5 flex-shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-4 border-t border-neutral-200">
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<Heart className="w-4 h-4" />}
                          onClick={() => handleSaveRecipe(message.recipe!)}
                        >
                          Save Recipe
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          leftIcon={<BookOpen className="w-4 h-4" />}
                          onClick={() => handleViewRecipe(message.recipe!)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              ) : (
                <div className="max-w-xs lg:max-w-md bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <ChefHat className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-neutral-800">{message.content}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isGeneratingRecipe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-xs lg:max-w-md bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                <p className="text-neutral-800">Creating your recipe...</p>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="space-y-2">
        {/* Test Button - For debugging */}
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTestConnection}
            disabled={isGeneratingRecipe}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {isGeneratingRecipe ? 'Testing...' : 'Test AI Connection'}
          </Button>
          <div className="text-xs text-neutral-500 flex items-center">
            Check browser console (F12) for detailed logs
          </div>
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Ask me anything about cooking or request a recipe..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isGeneratingRecipe}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send
          </Button>
        </div>
      </div>
      
      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        recipe={selectedRecipe}
        onSave={selectedRecipe ? () => handleSaveRecipe(selectedRecipe) : undefined}
      />
    </div>
  )
}