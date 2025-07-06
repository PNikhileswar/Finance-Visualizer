import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const MONGODB_DB = process.env.MONGODB_DB || 'finance-tracker'

// In-memory storage for development when MongoDB is not available
let inMemoryData = {
  transactions: [
    {
      _id: 'sample1',
      amount: 45.50,
      category: 'food',
      description: 'Lunch at restaurant',
      date: new Date().toISOString().split('T')[0],
      type: 'expense'
    },
    {
      _id: 'sample2',
      amount: 25.00,
      category: 'transport',
      description: 'Bus fare',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      type: 'expense'
    },
    {
      _id: 'sample3',
      amount: 120.00,
      category: 'entertainment',
      description: 'Movie tickets',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0], // 2 days ago
      type: 'expense'
    },
    {
      _id: 'sample4',
      amount: 2500.00,
      category: 'salary',
      description: 'Monthly salary',
      date: new Date().toISOString().split('T')[0],
      type: 'income'
    },
    {
      _id: 'sample5',
      amount: 80.00,
      category: 'shopping',
      description: 'Groceries',
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0], // 3 days ago
      type: 'expense'
    }
  ] as any[],
  budgets: [
    {
      _id: 'budget1',
      category: 'food',
      amount: 300,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    },
    {
      _id: 'budget2',
      category: 'transport',
      amount: 100,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    },
    {
      _id: 'budget3',
      category: 'entertainment',
      amount: 200,
      month: new Date().getMonth(),
      year: new Date().getFullYear()
    }
  ] as any[],
  categories: [
    { _id: 'food', name: 'Food & Dining', color: '#ef4444', type: 'expense' },
    { _id: 'transport', name: 'Transportation', color: '#f97316', type: 'expense' },
    { _id: 'entertainment', name: 'Entertainment', color: '#eab308', type: 'expense' },
    { _id: 'shopping', name: 'Shopping', color: '#22c55e', type: 'expense' },
    { _id: 'bills', name: 'Bills & Utilities', color: '#3b82f6', type: 'expense' },
    { _id: 'healthcare', name: 'Healthcare', color: '#8b5cf6', type: 'expense' },
    { _id: 'salary', name: 'Salary', color: '#10b981', type: 'income' },
    { _id: 'freelance', name: 'Freelance', color: '#06b6d4', type: 'income' },
    { _id: 'investment', name: 'Investment', color: '#6366f1', type: 'income' },
    { _id: 'other', name: 'Other', color: '#6b7280', type: 'expense' },
  ]
}

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase() {
  // For now, skip MongoDB connection on Vercel to avoid SSL issues
  if (process.env.VERCEL) {
    console.log('Running on Vercel, using in-memory storage')
    return { client: null, db: null }
  }

  try {
    if (client && db) {
      return { client, db }
    }

    // MongoDB connection options optimized for Vercel and Atlas
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 30000,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      tls: true,
      tlsInsecure: false,
      useUnifiedTopology: true,
      family: 4, // Force IPv4
      bufferMaxEntries: 0
    }

    client = new MongoClient(MONGODB_URI, options)
    await client.connect()
    
    // Test the connection
    await client.db(MONGODB_DB).admin().ping()
    
    db = client.db(MONGODB_DB)
    
    console.log('Connected to MongoDB')
    return { client, db }
  } catch (error) {
    console.warn('MongoDB connection failed, using in-memory storage:', error)
    return { client: null, db: null }
  }
}

export async function getDatabase() {
  const { db } = await connectToDatabase()
  return db
}

// Fallback functions for in-memory storage
export const inMemoryDatabase = {
  transactions: {
    find: (query: any = {}) => {
      let result = [...inMemoryData.transactions]
      if (query.category) {
        result = result.filter(t => t.category === query.category)
      }
      if (query.type) {
        result = result.filter(t => t.type === query.type)
      }
      return {
        toArray: () => Promise.resolve(result),
        sort: (sortQuery: any) => ({
          toArray: () => Promise.resolve(result.sort((a, b) => {
            if (sortQuery.date === -1) {
              return new Date(b.date).getTime() - new Date(a.date).getTime()
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime()
          }))
        })
      }
    },
    insertOne: (doc: any) => {
      const newDoc = { ...doc, _id: Date.now().toString() }
      inMemoryData.transactions.push(newDoc)
      return Promise.resolve({ insertedId: newDoc._id })
    },
    updateOne: (filter: any, update: any) => {
      const index = inMemoryData.transactions.findIndex(t => t._id === filter._id)
      if (index !== -1) {
        inMemoryData.transactions[index] = { ...inMemoryData.transactions[index], ...update.$set }
      }
      return Promise.resolve({ modifiedCount: index !== -1 ? 1 : 0 })
    },
    deleteOne: (filter: any) => {
      const index = inMemoryData.transactions.findIndex(t => t._id === filter._id)
      if (index !== -1) {
        inMemoryData.transactions.splice(index, 1)
      }
      return Promise.resolve({ deletedCount: index !== -1 ? 1 : 0 })
    }
  },
  budgets: {
    find: (query: any = {}) => {
      let result = [...inMemoryData.budgets]
      if (query.month !== undefined) {
        result = result.filter(b => b.month === query.month)
      }
      if (query.year !== undefined) {
        result = result.filter(b => b.year === query.year)
      }
      return {
        toArray: () => Promise.resolve(result)
      }
    },
    insertOne: (doc: any) => {
      const newDoc = { ...doc, _id: Date.now().toString() }
      inMemoryData.budgets.push(newDoc)
      return Promise.resolve({ insertedId: newDoc._id })
    },
    updateOne: (filter: any, update: any) => {
      const index = inMemoryData.budgets.findIndex(b => 
        b.category === filter.category && b.month === filter.month && b.year === filter.year
      )
      if (index !== -1) {
        inMemoryData.budgets[index] = { ...inMemoryData.budgets[index], ...update.$set }
      } else {
        // Insert if not found
        const newDoc = { ...filter, ...update.$set, _id: Date.now().toString() }
        inMemoryData.budgets.push(newDoc)
      }
      return Promise.resolve({ modifiedCount: 1, upsertedCount: index === -1 ? 1 : 0 })
    },
    findOne: (filter: any) => {
      const result = inMemoryData.budgets.find(b => 
        b.category === filter.category && b.month === filter.month && b.year === filter.year
      )
      return Promise.resolve(result || null)
    }
  },
  categories: {
    find: () => ({
      toArray: () => Promise.resolve([...inMemoryData.categories])
    })
  }
}
