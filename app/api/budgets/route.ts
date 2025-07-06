import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase, inMemoryDatabase } from '@/lib/database'
import { Budget } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || '0')
    const year = parseInt(searchParams.get('year') || '0')

    const db = await getDatabase()
    const query = month && year ? { month, year } : {}
    
    if (db) {
      const budgets = await db.collection('budgets').find(query).toArray()
      return NextResponse.json(budgets)
    } else {
      // Use in-memory storage
      const budgets = await inMemoryDatabase.budgets.find(query).toArray()
      return NextResponse.json(budgets)
    }
  } catch (error) {
    console.error('Error fetching budgets:', error)
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const budget: Omit<Budget, '_id'> = await request.json()
    
    // Validate required fields
    if (!budget.category || !budget.amount || budget.month === undefined || !budget.year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (budget.amount <= 0) {
      return NextResponse.json({ error: 'Budget amount must be greater than 0' }, { status: 400 })
    }

    const newBudget = {
      ...budget,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const db = await getDatabase()
    
    if (db) {
      // Check if budget already exists
      const existingBudget = await db.collection('budgets').findOne({
        category: budget.category,
        month: budget.month,
        year: budget.year
      })

      if (existingBudget) {
        // Update existing budget
        await db.collection('budgets').updateOne(
          { _id: existingBudget._id },
          { $set: { ...newBudget, updatedAt: new Date() } }
        )
        return NextResponse.json({ 
          _id: existingBudget._id,
          ...newBudget 
        })
      } else {
        // Insert new budget
        const result = await db.collection('budgets').insertOne(newBudget)
        return NextResponse.json({ 
          _id: result.insertedId,
          ...newBudget 
        })
      }
    } else {
      // Use in-memory storage
      const result = await inMemoryDatabase.budgets.updateOne(
        { 
          category: budget.category, 
          month: budget.month, 
          year: budget.year 
        },
        { $set: newBudget }
      )
      
      return NextResponse.json({ 
        _id: Date.now().toString(),
        ...newBudget 
      })
    }
  } catch (error) {
    console.error('Error creating/updating budget:', error)
    return NextResponse.json({ 
      error: 'Failed to create/update budget',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
