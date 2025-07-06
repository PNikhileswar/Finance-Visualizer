import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, inMemoryDatabase } from '@/lib/database'

export async function GET() {
  try {
    const db = await getDatabase()
    
    let transactions = []
    let categories = []
    
    if (db) {
      transactions = await db.collection('transactions').find({ type: 'expense' }).toArray()
      categories = await db.collection('categories').find({}).toArray()
    } else {
      // Use in-memory storage
      transactions = await inMemoryDatabase.transactions.find({ type: 'expense' }).toArray()
      categories = await inMemoryDatabase.categories.find().toArray()
    }

    // Create a map of category colors and names
    const categoryColorMap = categories.reduce((acc, cat: any) => {
      const categoryId = cat.categoryId || cat._id?.toString() || cat.name
      acc[categoryId] = {
        color: cat.color,
        name: cat.name
      }
      return acc
    }, {} as Record<string, { color: string; name: string }>)

    // Group transactions by category
    const categoryTotals = transactions.reduce((acc, transaction) => {
      const category = transaction.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += transaction.amount
      return acc
    }, {} as Record<string, number>)

    // Convert to array format for pie chart
    const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
      category: categoryColorMap[category]?.name || category,
      amount,
      color: categoryColorMap[category]?.color || '#6b7280'
    }))

    return NextResponse.json(categoryData)
  } catch (error) {
    console.error('Error fetching category analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch category analytics' }, { status: 500 })
  }
}
