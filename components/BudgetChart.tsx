'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Progress } from '@/components/ui/progress'
import { Card } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react'
import { BudgetComparison } from '@/types'

interface BudgetChartProps {
  data: BudgetComparison[]
}

export default function BudgetChart({ data }: BudgetChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200">
        <Target className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">No Budget Data</h3>
        <p className="text-sm text-gray-400">Set up your budgets to see beautiful insights</p>
      </div>
    )
  }

  // Prepare data for the chart
  const chartData = data.map(item => ({
    category: item.category,
    budgeted: item.budgeted,
    actual: item.actual,
    percentage: item.percentage
  }))

  // Calculate totals for overview
  const totalBudgeted = data.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = data.reduce((sum, item) => sum + item.actual, 0)
  const overallPercentage = (totalActual / totalBudgeted) * 100

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Budgeted</p>
              <p className="text-2xl font-bold text-blue-900">${totalBudgeted.toFixed(2)}</p>
            </div>
            <Target className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Total Spent</p>
              <p className="text-2xl font-bold text-purple-900">${totalActual.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className={`p-4 bg-gradient-to-br ${overallPercentage > 100 ? 'from-red-50 to-red-100 border-red-200' : 'from-green-50 to-green-100 border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${overallPercentage > 100 ? 'text-red-800' : 'text-green-800'}`}>
                Overall Status
              </p>
              <p className={`text-2xl font-bold ${overallPercentage > 100 ? 'text-red-900' : 'text-green-900'}`}>
                {overallPercentage.toFixed(1)}%
              </p>
            </div>
            {overallPercentage > 100 ? 
              <TrendingUp className="h-8 w-8 text-red-600" /> : 
              <TrendingDown className="h-8 w-8 text-green-600" />
            }
          </div>
        </Card>
      </div>

      {/* Side by Side: Progress Bars and Chart */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Beautiful Progress Cards */}
        <div className="space-y-2">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Budget Progress</h3>
            <p className="text-sm text-gray-600">Track your spending against each category budget</p>
          </div>
          
          {data.map((item, index) => {
            const isOverBudget = item.percentage > 100
            const progressColor = isOverBudget ? 'bg-red-500' : item.percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
            const cardColor = isOverBudget ? 'from-red-50 to-red-100 border-red-200' : 
                             item.percentage > 80 ? 'from-yellow-50 to-yellow-100 border-yellow-200' : 
                             'from-green-50 to-green-100 border-green-200'
            
            return (
              <Card key={item.category} className={`p-2.5 bg-gradient-to-br ${cardColor} transition-all duration-300 hover:shadow-md`}>
                <div className="space-y-1.5">
                  {/* Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-800 capitalize text-sm">{item.category}</h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        isOverBudget ? 'bg-red-200 text-red-800' :
                        item.percentage > 80 ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {isOverBudget ? '⚠️' :
                         item.percentage > 80 ? '⚡' :
                         '✅'}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-800">
                        ${item.actual.toFixed(0)} / ${item.budgeted.toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-0.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-gray-700">
                        {item.percentage.toFixed(0)}% used
                      </span>
                      <span className={`font-medium ${item.remaining > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {item.remaining > 0 ? 
                          `$${item.remaining.toFixed(0)} left` : 
                          `$${Math.abs(item.remaining).toFixed(0)} over`
                        }
                      </span>
                    </div>
                    
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
                          style={{ width: `${Math.min(100, item.percentage)}%` }}
                        />
                      </div>
                      {item.percentage > 100 && (
                        <div className="absolute right-0 top-0 h-1.5 bg-red-600 rounded-r-full animate-pulse"
                             style={{ width: `${Math.min(10, item.percentage - 100)}%` }} />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Comparison Chart */}
        <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-gray-200">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Budget vs Actual</h3>
            <p className="text-sm text-gray-600">Visual comparison of planned vs actual spending</p>
          </div>
          
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="budgetedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.6}/>
                  </linearGradient>
                  <linearGradient id="overbudgetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="category" 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `$${value.toFixed(2)}`, 
                    name === 'budgeted' ? 'Budgeted' : 'Spent'
                  ]}
                  labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="budgeted" 
                  fill="url(#budgetedGradient)" 
                  name="budgeted" 
                  radius={[3, 3, 0, 0]}
                  stroke="#94a3b8"
                  strokeWidth={1}
                />
                <Bar dataKey="actual" name="actual" radius={[3, 3, 0, 0]} stroke="#22c55e" strokeWidth={1}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.percentage > 100 ? 'url(#overbudgetGradient)' : 'url(#actualGradient)'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
