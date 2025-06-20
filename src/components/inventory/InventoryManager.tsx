import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Package, 
  Calendar,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { AddIngredientModal } from './AddIngredientModal'

const categories = [
  'All',
  'Vegetables',
  'Fruits',
  'Meat',
  'Dairy',
  'Grains',
  'Spices',
  'Condiments',
  'Other'
]

export const InventoryManager: React.FC = () => {
  const { ingredients, fetchIngredients, deleteIngredient } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'expiry' | 'quantity'>('name')
  
  useEffect(() => {
    fetchIngredients()
  }, [])
  
  // Filter and sort ingredients
  const filteredIngredients = ingredients
    .filter(ingredient => {
      const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || ingredient.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'expiry':
          if (!a.expiry_date && !b.expiry_date) return 0
          if (!a.expiry_date) return 1
          if (!b.expiry_date) return -1
          return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
        case 'quantity':
          return b.quantity - a.quantity
        default:
          return 0
      }
    })
  
  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return 'none'
    
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'expired'
    if (diffDays <= 3) return 'expiring'
    if (diffDays <= 7) return 'warning'
    return 'fresh'
  }
  
  const getExpiryBadge = (expiryDate: string | null) => {
    const status = getExpiryStatus(expiryDate)
    
    switch (status) {
      case 'expired':
        return <Badge variant="error" size="sm">Expired</Badge>
      case 'expiring':
        return <Badge variant="warning" size="sm">Expires Soon</Badge>
      case 'warning':
        return <Badge variant="accent" size="sm">Use Soon</Badge>
      case 'fresh':
        return <Badge variant="success" size="sm">Fresh</Badge>
      default:
        return null
    }
  }
  
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kitchen Inventory</h1>
          <p className="text-neutral-600">Manage your ingredients and track expiry dates</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Ingredient
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search ingredients..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'expiry' | 'quantity')}
              className="px-4 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="expiry">Sort by Expiry</option>
              <option value="quantity">Sort by Quantity</option>
            </select>
          </div>
        </div>
      </Card>
      
      {/* Ingredients Grid */}
      {filteredIngredients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredIngredients.map((ingredient) => (
              <motion.div
                key={ingredient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                layout
              >
                <Card hover className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">{ingredient.name}</h3>
                      <p className="text-sm text-neutral-600">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                    </div>
                    
                    <div className="flex gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-1.5 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteIngredient(ingredient.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="neutral" size="sm">
                      {ingredient.category}
                    </Badge>
                    
                    {ingredient.expiry_date && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(ingredient.expiry_date).toLocaleDateString()}
                          </span>
                        </div>
                        {getExpiryBadge(ingredient.expiry_date)}
                      </div>
                    )}
                    
                    {getExpiryStatus(ingredient.expiry_date) === 'expiring' && (
                      <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Use within 3 days</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">No ingredients found</h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm || selectedCategory !== 'All' 
              ? 'Try adjusting your search or filters'
              : 'Start by adding your first ingredient'
            }
          </p>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            Add Ingredient
          </Button>
        </Card>
      )}
      
      {/* Add Ingredient Modal */}
      <AddIngredientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}