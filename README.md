# Personal Finance Visualizer

A comprehensive web application for tracking personal finances with beautiful visualizations, budgeting tools, and spending insights.

## 🌟 Features

### Stage 1: Basic Transaction Tracking ✅
- ✅ Add/Edit/Delete transactions (amount, date, description)
- ✅ Transaction list view with filtering
- ✅ Monthly expenses bar chart
- ✅ Form validation and error handling

### Stage 2: Categories ✅
- ✅ Predefined categories for transactions (Food, Transportation, Entertainment, etc.)
- ✅ Category-wise pie chart visualization
- ✅ Dashboard with summary cards (total expenses, income, net income)
- ✅ Recent transactions display

### Stage 3: Budgeting ✅
- ✅ Set monthly category budgets
- ✅ Budget vs actual comparison chart with progress bars
- ✅ Spending insights and budget alerts
- ✅ Visual indicators for over-budget categories

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **Charts**: Recharts
- **Database**: MongoDB (with in-memory fallback)
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MongoDB (optional - app works without it)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Finance-Visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional)**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=finance-tracker
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Key Features

### Dashboard Overview
- **Summary Cards**: Total income, expenses, net income, and active categories
- **Monthly Trends**: Bar chart showing spending trends over the last 6 months
- **Category Breakdown**: Pie chart displaying expense distribution by category
- **Budget Progress**: Visual progress bars showing budget vs actual spending
- **Recent Transactions**: Quick view of latest financial activities

### Transaction Management
- **Quick Add**: Fast transaction entry with smart defaults
- **Categories**: 10 predefined categories (Food, Transportation, Entertainment, etc.)
- **Validation**: Comprehensive form validation with error messages
- **Edit/Delete**: Full CRUD operations for transaction management

### Budgeting Tools
- **Monthly Budgets**: Set spending limits for each category
- **Progress Tracking**: Visual progress bars and percentage indicators
- **Budget Alerts**: Color-coded warnings for over-budget categories
- **Comparison Charts**: Side-by-side budget vs actual spending

### Data Storage
- **MongoDB Integration**: Full database support for production use
- **In-Memory Fallback**: Works without database setup for development
- **Persistent Categories**: Pre-loaded expense and income categories
- **Real-time Updates**: Instant UI updates after data changes

## 🏗️ Project Structure

```
Finance-Visualizer/
├── app/
│   ├── api/                    # API routes
│   │   ├── transactions/       # Transaction CRUD operations
│   │   ├── categories/         # Category management
│   │   ├── budgets/           # Budget operations
│   │   └── analytics/         # Data analytics endpoints
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Dashboard.tsx          # Main dashboard
│   ├── TransactionForm.tsx    # Transaction add/edit form
│   ├── TransactionList.tsx    # Transaction listing
│   ├── BudgetForm.tsx         # Budget setting form
│   ├── MonthlyChart.tsx       # Monthly expenses chart
│   ├── CategoryChart.tsx      # Category pie chart
│   └── BudgetChart.tsx        # Budget comparison chart
├── lib/
│   ├── database.ts            # Database connection and utilities
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript type definitions
└── README.md
```

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop**: Full dashboard with all charts and features
- **Tablet**: Optimized layout with stacked components
- **Mobile**: Touch-friendly interface with collapsible sections

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface using shadcn/ui
- **Color-coded Categories**: Each category has a distinct color for easy identification
- **Interactive Charts**: Hover effects and tooltips for better data exploration
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages and validation
- **Toast Notifications**: Success/error feedback for user actions

## 📈 Analytics & Insights

- **Monthly Trends**: Track spending patterns over time
- **Category Analysis**: Understand where your money goes
- **Budget Performance**: See how well you stick to your budgets
- **Spending Alerts**: Visual warnings for budget overruns

## 🔧 Development

### Running Tests
```bash
npm run lint
```

### Building for Production
```bash
npm run build
npm start
```

### Database Setup (Optional)
If you want to use MongoDB instead of in-memory storage:

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `.env.local` file with your connection string
3. The app will automatically detect and use the database

## 🚀 Deployment

The application can be deployed on any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

For MongoDB, consider:
- **MongoDB Atlas** (cloud)
- **DigitalOcean Managed Databases**
- **AWS DocumentDB**

## 📋 API Endpoints

- `GET/POST/PUT/DELETE /api/transactions` - Transaction management
- `GET /api/categories` - Fetch categories
- `GET/POST /api/budgets` - Budget management
- `GET /api/analytics/monthly` - Monthly expense trends
- `GET /api/analytics/categories` - Category-wise expenses
- `GET /api/analytics/budget-comparison` - Budget vs actual comparison

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include screenshots if applicable

---

**Built with ❤️ using Next.js, React, and modern web technologies.**
