export interface Transaction {
  _id?: string
  amount: number
  description: string
  category: string
  date: string
  type: 'income' | 'expense'
  createdAt?: Date
  updatedAt?: Date
}

export interface Category {
  _id?: string
  name: string
  color: string
  icon?: string
  type: 'income' | 'expense'
}

export interface Budget {
  _id?: string
  category: string
  amount: number
  month: number
  year: number
  spent?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface MonthlyExpense {
  month: string
  amount: number
}

export interface CategoryExpense {
  category: string
  amount: number
  color: string
}

export interface BudgetComparison {
  category: string
  budgeted: number
  actual: number
  remaining: number
  percentage: number
}
