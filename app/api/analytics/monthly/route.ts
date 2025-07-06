import { NextRequest, NextResponse } from 'next/server'
import { getDatabase, inMemoryDatabase } from '@/lib/database'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const months = parseInt(searchParams.get('months') || '12')

    const db = await getDatabase()
    
    // Get transactions for the last N months
    const monthlyData = []
    const now = new Date()
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const start = startOfMonth(date)
      const end = endOfMonth(date)
      
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
        // Use in-memory storage
        const allTransactions = await inMemoryDatabase.transactions.find({ type: 'expense' }).toArray()
        transactions = allTransactions.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate >= start && transactionDate <= end
        })
      }
      
      const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0)
      
      monthlyData.push({
        month: format(date, 'MMM yyyy'),
        amount: totalExpenses
      })
    }

    return NextResponse.json(monthlyData)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
