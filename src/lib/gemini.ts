const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || 'AIzaSyDLJJqUeecYYMPuLXkrUQWUhl78cSmoANg'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

console.log('🔑 Gemini API Key loaded:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT FOUND')
console.log('🤖 Using Gemini Model: gemini-1.5-flash (Free Tier)')
console.log('🌐 API Endpoint:', GEMINI_API_URL)

if (!GEMINI_API_KEY) {
  console.error('❌ Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.')
}

export interface RecipeRequest {
  ingredients: string[]
  preferences?: string[]
  dietaryRestrictions?: string[]
  cookingTime?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine?: string
  mood?: string
}

export interface GeneratedRecipe {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: string
  cuisine: string
  tags: string[]
  tips?: string[]
  story?: string
}

export class GeminiService {
  private async makeRequest(prompt: string): Promise<string> {
    try {
      // Check if API key is available
      if (!GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured. Please check your environment variables.')
      }

      console.log('Making request to Gemini API...', { url: GEMINI_API_URL })
      
      const requestBody = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 8192,
        }
      }

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      console.log('Gemini API response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Gemini API error response:', errorText)
        
        if (response.status === 400) {
          throw new Error('Invalid request. Please check your API key or try again.')
        } else if (response.status === 403) {
          throw new Error('API key is invalid or doesn\'t have permission.')
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.')
        } else {
          throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
        }
      }

      const data = await response.json()
      console.log('Gemini API response data:', data)

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated. Please try with different input.')
      }

      const content = data.candidates[0]?.content?.parts[0]?.text
      if (!content) {
        throw new Error('Empty response from AI. Please try again.')
      }

      return content
    } catch (error) {
      console.error('Gemini API request failed:', error)
      
      if (error instanceof Error) {
        throw error
      } else {
        throw new Error('Failed to connect to AI service. Please check your internet connection and try again.')
      }
    }
  }

  async generateRecipe(request: RecipeRequest): Promise<GeneratedRecipe> {
    const prompt = this.buildRecipePrompt(request)
    const response = await this.makeRequest(prompt)
    return this.parseRecipeResponse(response)
  }

  async getCookingTips(recipe: string): Promise<string[]> {
    const prompt = `Give me 3-5 professional cooking tips for making this recipe better: ${recipe}. 
    Return only the tips as a JSON array of strings.`
    
    const response = await this.makeRequest(prompt)
    try {
      return JSON.parse(response)
    } catch {
      return response.split('\n').filter(tip => tip.trim().length > 0).slice(0, 5)
    }
  }

  async suggestSubstitutions(ingredient: string): Promise<string[]> {
    const prompt = `What are 3-5 good substitutions for "${ingredient}" in cooking? 
    Return only the substitutions as a JSON array of strings.`
    
    const response = await this.makeRequest(prompt)
    try {
      return JSON.parse(response)
    } catch {
      return response.split('\n').filter(sub => sub.trim().length > 0).slice(0, 5)
    }
  }

  async answerCookingQuestion(question: string, context?: string): Promise<string> {
    const prompt = `As a professional chef, answer this cooking question: "${question}"
    ${context ? `Context: ${context}` : ''}
    
    Provide a helpful, practical answer in 2-3 sentences.`
    
    return await this.makeRequest(prompt)
  }

  private buildRecipePrompt(request: RecipeRequest): string {
    const {
      ingredients,
      preferences = [],
      dietaryRestrictions = [],
      cookingTime,
      difficulty = 'medium',
      cuisine,
      mood
    } = request

    return `Create a unique and creative recipe using these ingredients: ${ingredients.join(', ')}.

Requirements:
- Difficulty: ${difficulty}
- ${cookingTime ? `Maximum cooking time: ${cookingTime} minutes` : ''}
- ${cuisine ? `Cuisine style: ${cuisine}` : ''}
- ${preferences.length > 0 ? `Preferences: ${preferences.join(', ')}` : ''}
- ${dietaryRestrictions.length > 0 ? `Dietary restrictions: ${dietaryRestrictions.join(', ')}` : ''}
- ${mood ? `Mood/Style: ${mood}` : ''}

Return the recipe in this exact JSON format:
{
  "title": "Recipe Name",
  "description": "Brief appetizing description",
  "ingredients": ["ingredient 1 with amount", "ingredient 2 with amount"],
  "instructions": ["step 1", "step 2", "step 3"],
  "prepTime": 15,
  "cookTime": 30,
  "servings": 4,
  "difficulty": "easy|medium|hard",
  "cuisine": "cuisine type",
  "tags": ["tag1", "tag2", "tag3"],
  "tips": ["tip 1", "tip 2"],
  "story": "Brief interesting story about the dish"
}

Make it creative and unique, not just a standard recipe. Include interesting flavor combinations and techniques.`
  }

  private parseRecipeResponse(response: string): GeneratedRecipe {
    try {
      console.log('🍳 Raw AI response:', response)
      
      // Remove markdown code blocks and clean response
      let cleanResponse = response
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/^```/g, '')
        .trim()
      
      console.log('🧹 Cleaned response:', cleanResponse)
      
      // Try to extract JSON from the response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        console.log('✅ Parsed recipe:', parsed)
        
        return {
          title: parsed.title || 'Generated Recipe',
          description: parsed.description || 'A delicious recipe created just for you',
          ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : [],
          instructions: Array.isArray(parsed.instructions) ? parsed.instructions : [],
          prepTime: Number(parsed.prepTime) || 15,
          cookTime: Number(parsed.cookTime) || 30,
          servings: Number(parsed.servings) || 4,
          difficulty: parsed.difficulty || 'medium',
          cuisine: parsed.cuisine || 'fusion',
          tags: Array.isArray(parsed.tags) ? parsed.tags : ['ai-generated', 'creative'],
          tips: Array.isArray(parsed.tips) ? parsed.tips : [],
          story: parsed.story || ''
        }
      }
    } catch (error) {
      console.error('❌ Failed to parse recipe response:', error)
      console.error('📄 Response that failed:', response)
    }

    // Fallback parsing if JSON parsing fails
    console.log('⚠️ Using fallback parsing')
    return this.fallbackParseRecipe(response)
  }

  private fallbackParseRecipe(response: string): GeneratedRecipe {
    const lines = response.split('\n').filter(line => line.trim())
    
    return {
      title: lines[0]?.replace(/^#+\s*/, '') || 'Generated Recipe',
      description: 'A delicious recipe created just for you',
      ingredients: lines.filter(line => line.includes('cup') || line.includes('tbsp') || line.includes('tsp')).slice(0, 10),
      instructions: lines.filter(line => line.match(/^\d+\./) || line.toLowerCase().includes('step')).slice(0, 8),
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      difficulty: 'medium',
      cuisine: 'fusion',
      tags: ['ai-generated', 'creative'],
      tips: [],
      story: ''
    }
  }
}

export const geminiService = new GeminiService()

// Direct API test function (bypass service layer)
export const testGeminiDirect = async (): Promise<boolean> => {
  try {
    console.log('🔥 Testing Gemini API directly...')
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say hello in one word.'
          }]
        }]
      })
    })

    console.log('🌐 Direct API response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Direct API error:', errorText)
      return false
    }

    const data = await response.json()
    console.log('📄 Direct API response data:', data)
    
    if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
      console.log('✅ Direct API test successful!')
      return true
    } else {
      console.log('❌ Direct API returned no content')
      return false
    }
  } catch (error: any) {
    console.error('❌ Direct API test failed:', error)
    return false
  }
}

// Test function for debugging
export const testGeminiConnection = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing Gemini API connection...')
    console.log('🔑 API Key available:', !!GEMINI_API_KEY)
    console.log('🔗 API URL:', GEMINI_API_URL)
    console.log('🔍 API Key preview:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'Not found')
    
    // Simple test prompt
    const testPrompt = 'Say "Hello from Gemini" in one sentence.'
    console.log('📝 Test prompt:', testPrompt)
    
    const testResponse = await geminiService.answerCookingQuestion(testPrompt)
    console.log('✅ Test response:', testResponse)
    
    if (testResponse && testResponse.length > 0) {
      console.log('🎉 Gemini API connection successful!')
      return true
    } else {
      console.log('❌ Empty response from Gemini API')
      return false
    }
  } catch (error: any) {
    console.error('❌ Gemini connection test failed:', error)
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return false
  }
}