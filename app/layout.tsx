import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ClientToaster from '@/components/ClientToaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Finance Visualizer',
  description: 'Track your personal finances with beautiful visualizations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ClientToaster />
      </body>
    </html>
  )
}
