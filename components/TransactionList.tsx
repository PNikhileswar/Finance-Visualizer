'use client'

import { Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Transaction } from '@/types'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  showAll?: boolean
}

export default function TransactionList({ transactions, onEdit, onDelete, showAll = true }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions found. Add your first transaction to get started!
      </div>
    )
  }

  const displayTransactions = showAll ? transactions : transactions.slice(0, 5)

  return (
    <div className="space-y-3">
      {displayTransactions.map((transaction) => (
        <Card key={transaction._id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${
                transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
              
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(transaction)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => transaction._id && onDelete(transaction._id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {!showAll && transactions.length > 5 && (
        <div className="text-center pt-4">
          <p className="text-sm text-muted-foreground">
            Showing 5 of {transactions.length} transactions
          </p>
        </div>
      )}
    </div>
  )
}
