'use client'

import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import MonthlyChart from '@/components/MonthlyChart'
import CategoryChart from '@/components/CategoryChart'
import BudgetChart from '@/components/BudgetChart'
import BudgetForm from '@/components/BudgetForm'
import { Transaction, CategoryExpense, MonthlyExpense, BudgetComparison } from '@/types'

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyExpense[]>([])
  const [categoryData, setCategoryData] = useState<CategoryExpense[]>([])
  const [budgetData, setBudgetData] = useState<BudgetComparison[]>([])
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showBudgetForm, setShowBudgetForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAllTransactions, setShowAllTransactions] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch transactions
      const transactionsRes = await fetch('/api/transactions')
      const transactionsData = await transactionsRes.json()
      setTransactions(transactionsData)

      // Fetch monthly analytics
      const monthlyRes = await fetch('/api/analytics/monthly?months=6')
      const monthlyAnalytics = await monthlyRes.json()
      setMonthlyData(monthlyAnalytics)

      // Fetch category analytics
      const categoryRes = await fetch('/api/analytics/categories')
      const categoryAnalytics = await categoryRes.json()
      setCategoryData(categoryAnalytics)

      // Fetch budget comparison
      const now = new Date()
      const budgetRes = await fetch(`/api/analytics/budget-comparison?month=${now.getMonth()}&year=${now.getFullYear()}`)
      const budgetAnalytics = await budgetRes.json()
      setBudgetData(budgetAnalytics)
      
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTransactionSuccess = () => {
    setShowTransactionForm(false)
    setEditingTransaction(null)
    fetchData()
  }

  const handleBudgetSuccess = () => {
    setShowBudgetForm(false)
    fetchData()
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowTransactionForm(true)
  }

  const handleDeleteTransaction = async (id: string) => {
    try {
      await fetch(`/api/transactions?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  // Calculate summary statistics
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const netIncome = totalIncome - totalExpenses
  const displayTransactions = showAllTransactions ? transactions : transactions.slice(0, 5)

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-40"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Personal Finance Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">Track your income, expenses, and budgets with beautiful insights</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowBudgetForm(true)} className="shadow-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Set Budget
          </Button>
          <Button onClick={() => setShowTransactionForm(true)} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Income</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">${totalIncome.toFixed(2)}</div>
            <p className="text-xs text-green-600 mt-1">All time income</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Total Expenses</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-red-600 mt-1">All time expenses</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Net Income</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${netIncome >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              ${netIncome.toFixed(2)}
            </div>
            <p className="text-xs text-blue-600 mt-1">Income - Expenses</p>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Categories</CardTitle>
            <PieChart className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700">{categoryData.length}</div>
            <p className="text-xs text-purple-600 mt-1">Active spending categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Monthly Expenses</CardTitle>
            <CardDescription className="text-base">Your spending trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <MonthlyChart data={monthlyData} />
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Expenses by Category</CardTitle>
            <CardDescription className="text-base">Breakdown of your spending by category</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <CategoryChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

      {/* Budget vs Actual */}
      {budgetData.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Budget vs Actual Spending</CardTitle>
            <CardDescription className="text-base">Track your budget performance this month</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <BudgetChart data={budgetData} />
          </CardContent>
        </Card>
      )}

      {/* Transactions */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">
                {showAllTransactions ? 'All Transactions' : 'Recent Transactions'}
              </CardTitle>
              <CardDescription className="text-base mt-1">
                {showAllTransactions 
                  ? `Showing all ${transactions.length} transactions` 
                  : 'Your latest financial activity'
                }
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAllTransactions(!showAllTransactions)}
              className="shadow-sm"
            >
              {showAllTransactions ? 'Show Recent Only' : 'View All'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <TransactionList
            transactions={displayTransactions}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            showAll={true}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      {showTransactionForm && (
        <TransactionForm
          isOpen={showTransactionForm}
          onClose={() => {
            setShowTransactionForm(false)
            setEditingTransaction(null)
          }}
          onSuccess={handleTransactionSuccess}
          transaction={editingTransaction}
        />
      )}

      {showBudgetForm && (
        <BudgetForm
          isOpen={showBudgetForm}
          onClose={() => setShowBudgetForm(false)}
          onSuccess={handleBudgetSuccess}
        />
      )}

      {/* Help Section */}
      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Check out our <a href="/help" className="text-blue-600 hover:underline">Help Center</a> for guides on managing transactions and budgets.
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAllTransactions(!showAllTransactions)}
          >
            {showAllTransactions ? 'Show Recent Only' : 'View All Transactions'}
          </Button>
        </div>
      </div>
    </div>
  )
}
