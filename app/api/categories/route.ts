import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, inMemoryDatabase } from '@/lib/database'

const defaultCategories = [
  { name: 'Food & Dining', color: '#ef4444', type: 'expense', categoryId: 'food' },
  { name: 'Transportation', color: '#f97316', type: 'expense', categoryId: 'transport' },
  { name: 'Entertainment', color: '#eab308', type: 'expense', categoryId: 'entertainment' },
  { name: 'Shopping', color: '#22c55e', type: 'expense', categoryId: 'shopping' },
  { name: 'Bills & Utilities', color: '#3b82f6', type: 'expense', categoryId: 'bills' },
  { name: 'Healthcare', color: '#8b5cf6', type: 'expense', categoryId: 'healthcare' },
  { name: 'Salary', color: '#10b981', type: 'income', categoryId: 'salary' },
  { name: 'Freelance', color: '#06b6d4', type: 'income', categoryId: 'freelance' },
  { name: 'Investment', color: '#6366f1', type: 'income', categoryId: 'investment' },
  { name: 'Other', color: '#6b7280', type: 'expense', categoryId: 'other' },
]

export async function GET() {
  try {
    const db = await getDatabase()
    
    if (db) {
      let categories = await db.collection('categories').find({}).toArray()
      
      // If categories collection is empty, seed it with default categories
      if (categories.length === 0) {
        console.log('Categories collection is empty, seeding with default categories')
        await db.collection('categories').insertMany(defaultCategories)
        categories = await db.collection('categories').find({}).toArray()
      }
      
      // Transform for consistent frontend format
      const transformedCategories = categories.map(cat => ({
        _id: cat.categoryId || cat._id?.toString(),
        name: cat.name,
        color: cat.color,
        type: cat.type
      }))
      
      return NextResponse.json(transformedCategories)
    } else {
      // Use in-memory storage
      console.log('Using in-memory storage for categories')
      const categories = await inMemoryDatabase.categories.find().toArray()
      return NextResponse.json(categories)
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Fallback to default categories if there's any error
    const fallbackCategories = defaultCategories.map(cat => ({
      _id: cat.categoryId,
      name: cat.name,
      color: cat.color,
      type: cat.type
    }))
    return NextResponse.json(fallbackCategories)
  }
}
