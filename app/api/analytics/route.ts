import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      message: 'Analytics API endpoint',
      endpoints: {
        monthly: '/api/analytics/monthly',
        categories: '/api/analytics/categories',
        budgetComparison: '/api/analytics/budget-comparison'
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}