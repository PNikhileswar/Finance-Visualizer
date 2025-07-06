import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, inMemoryDatabase } from '@/lib/database'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = parseInt(searchParams.get('month') || new Date().getMonth().toString())
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())

    const db = await getDatabase()
    
    // Get budgets for the specified month/year
    let budgets = []
    if (db) {
      budgets = await db.collection('budgets').find({ month, year }).toArray()
    } else {
      budgets = await inMemoryDatabase.budgets.find({ month, year }).toArray()
    }

    // Get actual spending for the same period
    const start = startOfMonth(new Date(year, month, 1))
    const end = endOfMonth(new Date(year, month, 1))
    
    let transactions = []
    if (db) {
      transactions = await db.collection('transactions').find({
        date: {
          $gte: format(start, 'yyyy-MM-dd'),
          $lte: format(end, 'yyyy-MM-dd')
        },
        type: 'expense'
      }).toArray()
    } else {
      const allTransactions = await inMemoryDatabase.transactions.find({ type: 'expense' }).toArray()
      transactions = allTransactions.filter(t => {
        const transactionDate = new Date(t.date)
        return transactionDate >= start && transactionDate <= end
      })
    }

    // Calculate actual spending by category
    const actualSpending = transactions.reduce((acc, transaction) => {
      const category = transaction.category
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += transaction.amount
      return acc
    }, {} as Record<string, number>)

    // Combine budget and actual data
    const budgetComparison = budgets.map(budget => {
      const actual = actualSpending[budget.category] || 0
      const remaining = Math.max(0, budget.amount - actual)
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0

      return {
        category: budget.category,
        budgeted: budget.amount,
        actual,
        remaining,
        percentage: Math.min(100, percentage)
      }
    })

    return NextResponse.json(budgetComparison)
  } catch (error) {
    console.error('Error fetching budget comparison:', error)
    return NextResponse.json({ error: 'Failed to fetch budget comparison' }, { status: 500 })
  }
}
