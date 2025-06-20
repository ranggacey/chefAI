import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Package } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import toast from 'react-hot-toast'

interface AddIngredientModalProps {
  isOpen: boolean
  onClose: () => void
}

const categories = [
  { label: 'Vegetables', value: 'vegetables' },
  { label: 'Fruits', value: 'fruits' },
  { label: 'Meat', value: 'meat' },
  { label: 'Seafood', value: 'seafood' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Grains', value: 'grains' },
  { label: 'Spices', value: 'spices' },
  { label: 'Herbs', value: 'herbs' },
  { label: 'Pantry', value: 'pantry' },
  { label: 'Frozen', value: 'frozen' },
  { label: 'Beverages', value: 'beverages' },
  { label: 'Other', value: 'other' }
]

const units = [
  'pieces',
  'kg',
  'g',
  'lbs',
  'oz',
  'liters',
  'ml',
  'cups',
  'tbsp',
  'tsp',
  'cans',
  'bottles'
]

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  isOpen,
  onClose
}) => {
  const { addIngredient, fetchIngredients } = useStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: 'pieces',
    category: 'other',
    expiry_date: ''
  })
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.quantity) {
      toast.error('Please fill in all required fields')
      return
    }
    
    console.log('Form data being submitted:', formData)
    setIsLoading(true)
    
    try {
      const result = await addIngredient({
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        category: formData.category,
        expiry_date: formData.expiry_date || null
      })
      
      console.log('Add ingredient result:', result)
      toast.success('Ingredient added successfully!')
      
      // Refresh ingredients list
      await fetchIngredients()
      
      setFormData({
        name: '',
        quantity: '',
        unit: 'pieces',
        category: 'other',
        expiry_date: ''
      })
      onClose()
    } catch (error: any) {
      console.error('Error in handleSubmit:', error)
      const errorMessage = error.message || 'Failed to add ingredient'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
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
            className="relative bg-white rounded-2xl shadow-strong max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Add Ingredient</h2>
                  <p className="text-sm text-neutral-600">Add a new ingredient to your inventory</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <Input
                label="Ingredient Name *"
                placeholder="e.g., Tomatoes, Chicken Breast"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Quantity *"
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 bg-white"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                  </select>
              </div>
              
              <Input
                label="Expiry Date (Optional)"
                type="date"
                value={formData.expiry_date}
                onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              />
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Add Ingredient
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}