import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/supabase'

type Ingredient = Database['public']['Tables']['ingredients']['Row']
type Recipe = Database['public']['Tables']['recipes']['Row']
type MealPlan = Database['public']['Tables']['meal_plans']['Row']
type ChatMessage = Database['public']['Tables']['chat_history']['Row']

interface User {
  id: string
  email: string
}

interface AppState {
  // Auth
  user: User | null
  isLoading: boolean
  
  // Ingredients
  ingredients: Ingredient[]
  
  // Recipes
  recipes: Recipe[]
  currentRecipe: Recipe | null
  
  // Meal Plans
  mealPlans: MealPlan[]
  
  // Chat
  chatMessages: ChatMessage[]
  currentSessionId: string | null
  
  // UI State
  activeView: 'dashboard' | 'inventory' | 'recipes' | 'meal-plan' | 'ai-chat'
  isGeneratingRecipe: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setActiveView: (view: AppState['activeView']) => void
  setIsLoading: (loading: boolean) => void
  setIsGeneratingRecipe: (generating: boolean) => void
  
  // Ingredient actions
  fetchIngredients: () => Promise<void>
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateIngredient: (id: string, updates: Partial<Ingredient>) => Promise<void>
  deleteIngredient: (id: string) => Promise<void>
  
  // Recipe actions
  fetchRecipes: () => Promise<void>
  addRecipe: (recipe: Omit<Recipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  setCurrentRecipe: (recipe: Recipe | null) => void
  
  // Meal plan actions
  fetchMealPlans: () => Promise<void>
  addMealPlan: (mealPlan: Omit<MealPlan, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>
  
  // Chat actions
  fetchChatHistory: () => Promise<void>
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'user_id' | 'created_at' | 'session_id' | 'tokens_used' | 'response_time_ms'>) => Promise<void>
  startNewChatSession: () => void
  clearChatHistory: () => Promise<void>
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  ingredients: [],
  recipes: [],
  currentRecipe: null,
  mealPlans: [],
  chatMessages: [],
  currentSessionId: null,
  activeView: 'dashboard',
  isGeneratingRecipe: false,
  
  // Actions
  setUser: (user) => set({ user }),
  setActiveView: (activeView) => set({ activeView }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsGeneratingRecipe: (isGeneratingRecipe) => set({ isGeneratingRecipe }),
  
  // Ingredient actions
  fetchIngredients: async () => {
    const { user } = get()
    if (!user) {
      console.log('No user found when fetching ingredients')
      return
    }
    
    console.log('Fetching ingredients for user:', user.id)
    
    const { data, error } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching ingredients:', error)
      console.error('Supabase error details:', error.message, error.details, error.hint)
      return
    }
    
    console.log('Fetched ingredients:', data)
    set({ ingredients: data || [] })
  },
  
  addIngredient: async (ingredient) => {
    const { user } = get()
    if (!user) {
      console.error('No user found when adding ingredient')
      throw new Error('You must be logged in to add ingredients')
    }
    
    console.log('Adding ingredient:', { ingredient, user_id: user.id })
    
    const { data, error } = await supabase
      .from('ingredients')
      .insert([{ ...ingredient, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding ingredient:', error)
      console.error('Supabase error details:', error.message, error.details, error.hint)
      throw new Error(`Failed to add ingredient: ${error.message}`)
    }
    
    console.log('Ingredient added successfully:', data)
    
    set((state) => ({
      ingredients: [data, ...state.ingredients]
    }))
    
    return data
  },
  
  updateIngredient: async (id, updates) => {
    const { data, error } = await supabase
      .from('ingredients')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating ingredient:', error)
      return
    }
    
    set((state) => ({
      ingredients: state.ingredients.map((ing) =>
        ing.id === id ? data : ing
      )
    }))
  },
  
  deleteIngredient: async (id) => {
    const { error } = await supabase
      .from('ingredients')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting ingredient:', error)
      return
    }
    
    set((state) => ({
      ingredients: state.ingredients.filter((ing) => ing.id !== id)
    }))
  },
  
  // Recipe actions
  fetchRecipes: async () => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching recipes:', error)
      return
    }
    
    set({ recipes: data || [] })
  },
  
  addRecipe: async (recipe) => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('recipes')
      .insert([{ ...recipe, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding recipe:', error)
      return
    }
    
    set((state) => ({
      recipes: [data, ...state.recipes]
    }))
  },
  
  setCurrentRecipe: (currentRecipe) => set({ currentRecipe }),
  
  // Meal plan actions
  fetchMealPlans: async () => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: true })
    
    if (error) {
      console.error('Error fetching meal plans:', error)
      return
    }
    
    set({ mealPlans: data || [] })
  },
  
  addMealPlan: async (mealPlan) => {
    const { user } = get()
    if (!user) return
    
    const { data, error } = await supabase
      .from('meal_plans')
      .insert([{ ...mealPlan, user_id: user.id }])
      .select()
      .single()
    
    if (error) {
      console.error('Error adding meal plan:', error)
      return
    }
    
    set((state) => ({
      mealPlans: [...state.mealPlans, data]
    }))
  },

  // Chat actions
  fetchChatHistory: async () => {
    const { user } = get()
    if (!user) return

    console.log('Fetching chat history for user:', user.id)

    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching chat history:', error)
      return
    }

    console.log('Fetched chat messages:', data)
    set({ chatMessages: data || [] })
  },

  addChatMessage: async (message) => {
    const { user, currentSessionId } = get()
    if (!user) {
      throw new Error('You must be logged in to send messages')
    }

    const sessionId = currentSessionId || generateSessionId()
    
    const { data, error } = await supabase
      .from('chat_history')
      .insert([{ 
        ...message, 
        user_id: user.id,
        session_id: sessionId
      }])
      .select()
      .single()

    if (error) {
      console.error('Error adding chat message:', error)
      throw new Error(`Failed to save message: ${error.message}`)
    }

    console.log('Chat message saved:', data)

    set((state) => ({
      chatMessages: [...state.chatMessages, data],
      currentSessionId: sessionId
    }))

    return data
  },

  startNewChatSession: () => {
    const newSessionId = generateSessionId()
    console.log('Starting new chat session:', newSessionId)
    set({ currentSessionId: newSessionId })
  },

  clearChatHistory: async () => {
    const { user } = get()
    if (!user) return

    const { error } = await supabase
      .from('chat_history')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error clearing chat history:', error)
      return
    }

    set({ chatMessages: [], currentSessionId: null })
  },
}))

// Helper function to generate UUID session ID
function generateSessionId(): string {
  return crypto.randomUUID()
}