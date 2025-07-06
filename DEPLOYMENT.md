# 🚀 Deployment Guide for Personal Finance Visualizer

## Prerequisites
- Node.js 18+ installed
- Git repository set up
- MongoDB Atlas account (for cloud database)

## Option 1: Deploy to Vercel (Recommended - Free & Easy)

### Step 1: Set up MongoDB Atlas (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create a free account and new cluster
3. Create a database user with read/write permissions
4. Get your connection string (replace `<password>` with your database user password)
5. Whitelist your IP address (or use 0.0.0.0/0 for all IPs during development)

### Step 2: Prepare Environment Variables
Create these environment variables for production:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=finance-tracker
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### Step 3: Deploy to Vercel

#### Method A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from your project directory
cd C:\Internship\Finance-Visualizer
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (your account)
# - Link to existing project? N
# - Project name: finance-visualizer
# - Directory: ./
# - Override settings? N

# Set environment variables
vercel env add MONGODB_URI production
vercel env add MONGODB_DB production
vercel env add NEXT_PUBLIC_APP_URL production

# Deploy to production
vercel --prod
```

#### Method B: Using Git Integration
1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Personal Finance Visualizer"
git branch -M main
git remote add origin https://github.com/yourusername/finance-visualizer.git
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `MONGODB_DB`: finance-tracker
   - `NEXT_PUBLIC_APP_URL`: https://your-app-name.vercel.app
6. Click "Deploy"

### Step 4: Configure Domain (Optional)
- In Vercel dashboard, go to your project settings
- Add a custom domain if you have one
- Update `NEXT_PUBLIC_APP_URL` environment variable

---

## Option 2: Deploy to Netlify

### Step 1: Build for Static Export
```bash
# Add export script to package.json
npm run build
```

### Step 2: Deploy to Netlify
1. Go to [Netlify](https://netlify.com)
2. Drag and drop your `out` folder to deploy
3. Or connect your Git repository for continuous deployment

---

## Option 3: Deploy to Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

### Step 2: Deploy
```bash
cd C:\Internship\Finance-Visualizer
railway link
railway up
```

### Step 3: Set Environment Variables
```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set MONGODB_DB="finance-tracker"
```

---

## Option 4: Self-Hosted Deployment

### Using PM2 (Production Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Build the application
npm run build

# Start with PM2
pm2 start npm --name "finance-visualizer" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -t finance-visualizer .
docker run -p 3000:3000 -e MONGODB_URI="your-uri" finance-visualizer
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DB` | Database name | `finance-tracker` |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | `https://your-app.vercel.app` |

---

## Post-Deployment Checklist

- [ ] ✅ Application loads without errors
- [ ] ✅ Database connection works
- [ ] ✅ Can create transactions
- [ ] ✅ Can set budgets
- [ ] ✅ Charts display correctly
- [ ] ✅ Responsive design works on mobile
- [ ] ✅ Environment variables are set correctly
- [ ] ✅ HTTPS is enabled
- [ ] ✅ Custom domain configured (if applicable)

---

## Troubleshooting Common Issues

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Connection Issues
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### Environment Variables Not Working
- Make sure variables are set in your deployment platform
- Restart your application after setting variables
- Check for typos in variable names

---

## Monitoring and Maintenance

### Vercel Analytics
- Enable Vercel Analytics in your dashboard for traffic insights

### Error Monitoring
Consider adding error monitoring:
```bash
npm install @sentry/nextjs
```

### Database Monitoring
- Monitor MongoDB Atlas metrics
- Set up alerts for connection issues
- Regular database backups

---

## Security Considerations

- Use environment variables for all secrets
- Enable HTTPS (automatic with Vercel)
- Implement rate limiting for production
- Regular security updates

---

Your Personal Finance Visualizer is now ready for production! 🎉
