import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase, inMemoryDatabase } from '@/lib/database'
import { Transaction } from '@/types'

export async function GET() {
  try {
    const db = await getDatabase()
    
    if (db) {
      const transactions = await db.collection('transactions').find({}).sort({ date: -1 }).toArray()
      return NextResponse.json(transactions)
    } else {
      // Use in-memory storage
      const transactions = await inMemoryDatabase.transactions.find().sort({ date: -1 }).toArray()
      return NextResponse.json(transactions)
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const transaction: Omit<Transaction, '_id'> = await request.json()
    
    // Validate required fields
    if (!transaction.amount || !transaction.description || !transaction.category || !transaction.date || !transaction.type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newTransaction = {
      ...transaction,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const db = await getDatabase()
    
    if (db) {
      const result = await db.collection('transactions').insertOne(newTransaction)
      return NextResponse.json({ _id: result.insertedId, ...newTransaction })
    } else {
      // Use in-memory storage
      const result = await inMemoryDatabase.transactions.insertOne(newTransaction)
      return NextResponse.json({ _id: result.insertedId, ...newTransaction })
    }
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { _id, ...updateData }: Transaction = await request.json()
    
    if (!_id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    const updatedTransaction = {
      ...updateData,
      updatedAt: new Date()
    }

    const db = await getDatabase()
    
    if (db) {
      const result = await db.collection('transactions').updateOne(
        { _id: new ObjectId(_id) },
        { $set: updatedTransaction }
      )
      
      if (result.modifiedCount === 0) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }
    } else {
      // Use in-memory storage
      const result = await inMemoryDatabase.transactions.updateOne(
        { _id },
        { $set: updatedTransaction }
      )
      
      if (result.modifiedCount === 0) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }
    }

    return NextResponse.json({ _id, ...updatedTransaction })
  } catch (error) {
    console.error('Error updating transaction:', error)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Transaction ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    
    if (db) {
      const result = await db.collection('transactions').deleteOne({ _id: new ObjectId(id) })
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }
    } else {
      // Use in-memory storage
      const result = await inMemoryDatabase.transactions.deleteOne({ _id: id })
      
      if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }
    }

    return NextResponse.json({ message: 'Transaction deleted successfully' })
  } catch (error) {
    console.error('Error deleting transaction:', error)
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
  }
}
