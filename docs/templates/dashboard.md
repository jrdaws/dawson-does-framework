# Dashboard Template

Complete guide to building admin panels and data visualization dashboards.

## Table of Contents

- [Overview](#overview)
- [What's Included](#whats-included)
- [When to Use This Template](#when-to-use-this-template)
- [File Structure](#file-structure)
- [Quick Start](#quick-start)
- [Component Library](#component-library)
- [Data Visualization](#data-visualization)
- [Customization Guide](#customization-guide)
- [Recommended Integrations](#recommended-integrations)
- [Example Dashboards](#example-dashboards)
- [Deployment](#deployment)

## Overview

The Dashboard template provides a production-ready foundation for building admin panels, internal tools, and data visualization dashboards. It includes a responsive sidebar layout, pre-built UI components, data tables, charts, and a clean, professional design.

### Key Features

- Responsive sidebar navigation
- Pre-built dashboard components
- Data tables with sorting and filtering
- Chart placeholders ready for integration
- Settings pages
- Stats cards and metrics display
- Professional UI design
- Mobile-responsive layout
- TypeScript for type safety
- Tailwind CSS for styling

### Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI:** React 19, Tailwind CSS
- **Language:** TypeScript 5
- **Charts:** Ready for Recharts, Chart.js, or Tremor
- **Tables:** Built-in, ready for TanStack Table
- **Icons:** Unicode emojis (easily replaceable)
- **State:** React hooks

## What's Included

### Core Features

#### 1. Sidebar Navigation

- Collapsible sidebar
- Active route highlighting
- Icon support
- User profile section
- Responsive mobile menu
- Customizable menu items

#### 2. Dashboard Overview

- Stats cards with metrics
- Chart placeholders
- Recent activity feed
- Data table with sample data
- Responsive grid layout
- Professional styling

#### 3. Settings Pages

- Account settings
- Profile management
- Preferences configuration
- Easy to extend with more pages

#### 4. UI Components

- Cards and panels
- Buttons and forms
- Tables with styling
- Stats displays
- Activity feeds
- Loading states

### File Structure

```
my-dashboard/
├── app/
│   ├── settings/
│   │   └── page.tsx              # Settings page
│   ├── layout.tsx                # Root layout with sidebar
│   ├── page.tsx                  # Dashboard home
│   └── globals.css               # Global styles
├── components/
│   ├── dashboard/
│   │   ├── sidebar.tsx           # Navigation sidebar
│   │   ├── header.tsx            # Top header
│   │   ├── stats-card.tsx        # Metric cards
│   │   └── activity-feed.tsx     # Recent activity
│   └── ui/
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card component
│       └── table.tsx             # Table component
├── lib/
│   ├── utils.ts                  # Utility functions
│   └── data.ts                   # Sample data
├── public/                       # Static assets
├── .env.example                  # Environment template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## When to Use This Template

### Perfect For

The Dashboard template is ideal when you're building:

**Admin Panels:**
- CMS admin interfaces
- User management dashboards
- Content moderation tools
- System administration panels
- Configuration management

**Internal Tools:**
- Team dashboards
- Business intelligence tools
- Operations dashboards
- Monitoring interfaces
- Analytics viewers

**Data Visualization:**
- Analytics dashboards
- Reporting interfaces
- KPI dashboards
- Performance monitoring
- Sales dashboards

**Management Interfaces:**
- Inventory management
- Order management
- Customer support tools
- Project management
- Resource planning

### Not Ideal For

Consider other templates if you're building:

- **Public websites** → Use Landing Page template
- **SaaS with billing** → Use SaaS template
- **Blogs** → Use Blog template
- **Marketing sites** → Use Landing Page template

## Quick Start

### 1. Export the Template

```bash
# Export dashboard template
framework export dashboard ./my-dashboard

# Navigate to project
cd my-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Customize

The dashboard is ready to use out of the box. Start customizing:

1. Update sidebar navigation items
2. Replace sample data with real data
3. Add authentication if needed
4. Connect to your database
5. Add charts and visualizations

## Component Library

### Sidebar Component

The sidebar is fully customizable:

```typescript
// app/page.tsx (excerpt showing sidebar configuration)
const navigationItems = [
  { label: "Overview", icon: "📊", active: true, href: "/" },
  { label: "Analytics", icon: "📈", href: "/analytics" },
  { label: "Customers", icon: "👥", href: "/customers" },
  { label: "Orders", icon: "🛍️", href: "/orders" },
  { label: "Products", icon: "📦", href: "/products" },
  { label: "Settings", icon: "⚙️", href: "/settings" }
]
```

Customize the sidebar:

```typescript
// components/dashboard/sidebar.tsx
interface SidebarProps {
  items: NavigationItem[]
  user?: {
    name: string
    email: string
    avatar?: string
  }
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ items, user, collapsed, onToggle }: SidebarProps) {
  return (
    <aside className={`bg-gray-800 text-white ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Sidebar content */}
    </aside>
  )
}
```

### Stats Card Component

Display key metrics:

```typescript
// components/dashboard/stats-card.tsx
interface StatsCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    positive: boolean
  }
  icon?: React.ReactNode
}

export function StatsCard({ label, value, change, icon }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      {change && (
        <div className={`mt-4 text-sm ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
          {change.positive ? '↑' : '↓'} {Math.abs(change.value)}% from last month
        </div>
      )}
    </div>
  )
}

// Usage
<StatsCard
  label="Total Revenue"
  value="$45,231.89"
  change={{ value: 20.1, positive: true }}
/>
```

### Data Table Component

Display tabular data:

```typescript
// components/dashboard/data-table.tsx
interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ data, columns, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th key={String(column.key)} className="p-3 text-left text-sm font-medium text-gray-500">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              onClick={() => onRowClick?.(row)}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              {columns.map((column) => (
                <td key={String(column.key)} className="p-3 text-sm">
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Usage
const columns: Column<Order>[] = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  {
    key: 'status',
    label: 'Status',
    render: (status) => (
      <span className={`px-3 py-1 rounded-full text-xs ${
        status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {status}
      </span>
    )
  },
  { key: 'amount', label: 'Amount' },
  { key: 'date', label: 'Date' }
]

<DataTable data={orders} columns={columns} />
```

### Activity Feed Component

Show recent activity:

```typescript
// components/dashboard/activity-feed.tsx
interface Activity {
  id: string
  user: string
  action: string
  time: string
  icon?: React.ReactNode
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          {activity.icon && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              {activity.icon}
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-medium">{activity.user}</p>
            <p className="text-sm text-gray-600">{activity.action}</p>
            <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Button Component

Reusable button styles:

```typescript
// components/ui/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-md font-medium transition-colors'

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-gray-100'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

## Data Visualization

### Adding Charts

The template includes chart placeholders. Here's how to add real charts:

#### Option 1: Recharts

```bash
npm install recharts
```

```typescript
// components/dashboard/revenue-chart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 }
]

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

#### Option 2: Chart.js

```bash
npm install react-chartjs-2 chart.js
```

```typescript
// components/dashboard/bar-chart.tsx
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function BarChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [4000, 3000, 5000, 4500, 6000, 5500],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Monthly Revenue'
      }
    }
  }

  return <Bar data={data} options={options} />
}
```

#### Option 3: Tremor

```bash
npm install @tremor/react
```

```typescript
// components/dashboard/tremor-chart.tsx
import { Card, Title, BarChart } from '@tremor/react'

const data = [
  { month: 'Jan', 'Revenue': 4000 },
  { month: 'Feb', 'Revenue': 3000 },
  { month: 'Mar', 'Revenue': 5000 },
  { month: 'Apr', 'Revenue': 4500 },
  { month: 'May', 'Revenue': 6000 },
  { month: 'Jun', 'Revenue': 5500 }
]

export function TremorChart() {
  return (
    <Card>
      <Title>Monthly Revenue</Title>
      <BarChart
        data={data}
        index="month"
        categories={['Revenue']}
        colors={['blue']}
        valueFormatter={(number) => `$${number.toLocaleString()}`}
        className="mt-4 h-72"
      />
    </Card>
  )
}
```

### Data Fetching

Connect to real data:

```typescript
// lib/api.ts
export async function fetchDashboardStats() {
  const res = await fetch('/api/dashboard/stats')
  if (!res.ok) throw new Error('Failed to fetch stats')
  return res.json()
}

export async function fetchRecentOrders() {
  const res = await fetch('/api/orders?limit=10')
  if (!res.ok) throw new Error('Failed to fetch orders')
  return res.json()
}

// app/page.tsx
import { fetchDashboardStats, fetchRecentOrders } from '@/lib/api'

export default async function DashboardPage() {
  const [stats, orders] = await Promise.all([
    fetchDashboardStats(),
    fetchRecentOrders()
  ])

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Render stats and orders */}
    </div>
  )
}
```

## Customization Guide

### Changing Colors

Update your dashboard theme:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Sidebar colors
        sidebar: {
          bg: '#1f2937',      // gray-800
          text: '#ffffff',
          hover: '#374151',   // gray-700
          active: '#3b82f6'   // blue-500
        },
        // Dashboard colors
        dashboard: {
          bg: '#f9fafb',      // gray-50
          card: '#ffffff',
          border: '#e5e7eb'   // gray-200
        }
      }
    }
  }
}
```

### Adding Pages

Create new dashboard pages:

```typescript
// app/analytics/page.tsx
export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Your analytics content */}
      </div>
    </div>
  )
}
```

Add to navigation:

```typescript
// Update navigation items in app/page.tsx
const navigationItems = [
  { label: "Overview", icon: "📊", href: "/" },
  { label: "Analytics", icon: "📈", href: "/analytics" }, // New page
  { label: "Settings", icon: "⚙️", href: "/settings" }
]
```

### Adding Authentication

Protect your dashboard with auth:

```bash
# Add Supabase auth
framework integrate auth supabase
```

Update layout:

```typescript
// app/layout.tsx
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function RootLayout({ children }) {
  const user = await getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
```

### Connecting to Database

Add database integration:

```bash
# Add Supabase
framework integrate db supabase
```

Fetch real data:

```typescript
// lib/db.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) throw error
  return data
}

// app/page.tsx
import { getOrders } from '@/lib/db'

export default async function DashboardPage() {
  const orders = await getOrders()

  return (
    <div>
      <h1>Dashboard</h1>
      <DataTable data={orders} columns={orderColumns} />
    </div>
  )
}
```

### Mobile Responsiveness

The dashboard is mobile-responsive by default. Customize breakpoints:

```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

Responsive layout example:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Stats cards */}
</div>
```

## Recommended Integrations

### Essential Integrations

**Authentication:**
```bash
framework integrate auth supabase
# or
framework integrate auth clerk
```

**Database:**
```bash
framework integrate db supabase
# or
framework integrate db planetscale
```

**Charts:**
```bash
npm install recharts
# or
npm install @tremor/react
```

### Useful Integrations

**Advanced Tables:**
```bash
npm install @tanstack/react-table
```

**Date Handling:**
```bash
npm install date-fns
```

**Forms:**
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Icons:**
```bash
npm install lucide-react
# or
npm install @heroicons/react
```

**Data Fetching:**
```bash
npm install @tanstack/react-query
```

### Integration Examples

#### TanStack Table

```typescript
// components/dashboard/advanced-table.tsx
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender
} from '@tanstack/react-table'

export function AdvancedTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Example Dashboards

### 1. CRM Admin Dashboard

Features added:
- Customer management
- Deal pipeline
- Activity tracking
- Sales reports
- Team performance metrics

Integrations used:
- Supabase (database)
- Recharts (visualizations)
- TanStack Table (data tables)
- React Hook Form (forms)

### 2. E-commerce Analytics

Features added:
- Sales analytics
- Product performance
- Customer insights
- Inventory tracking
- Revenue charts

Integrations used:
- Supabase (database)
- Tremor (charts)
- date-fns (date formatting)
- Lucide React (icons)

### 3. Project Management Tool

Features added:
- Project overview
- Task management
- Team activity
- Time tracking
- Progress visualization

Integrations used:
- Supabase (database + real-time)
- Chart.js (charts)
- TanStack Table (task lists)
- React Query (data fetching)

### 4. Support Ticket System

Features added:
- Ticket queue
- Status tracking
- Customer information
- Response templates
- Performance metrics

Integrations used:
- Supabase (database)
- Clerk (authentication)
- Recharts (metrics)
- React Hook Form (ticket forms)

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy --prod
```

### Environment Variables

If using integrations:

```bash
# .env.local (for development)
# .env.production (for Vercel)

# Database
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."

# Auth (if using)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
```

### Build Command

```bash
npm run build
```

### Test Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Sidebar not collapsing

Check state management:

```typescript
const [sidebarOpen, setSidebarOpen] = useState(true)

// Toggle function
<button onClick={() => setSidebarOpen(!sidebarOpen)}>
  Toggle
</button>
```

### Charts not rendering

Install chart library:

```bash
npm install recharts
# or your preferred chart library
```

### Mobile menu not working

Verify responsive classes:

```typescript
<div className="hidden md:flex">
  {/* Desktop menu */}
</div>
<div className="md:hidden">
  {/* Mobile menu */}
</div>
```

### Data not loading

Check API routes and data fetching:

```typescript
// Add error handling
try {
  const data = await fetchData()
} catch (error) {
  console.error('Failed to fetch:', error)
}
```

## Next Steps

1. **Customize the design** - Update colors and styling
2. **Add real data** - Connect to your database
3. **Add charts** - Install and configure chart library
4. **Add authentication** - Protect your dashboard
5. **Deploy** - Launch to production

## Resources

- [Template README](./README.md)
- [Integration Docs](../integrations/README.md)
- [Deployment Guide](../deploy/README.md)
- [Recharts Documentation](https://recharts.org)
- [TanStack Table](https://tanstack.com/table)

---

**Ready to build?** Start with `framework export dashboard ./my-dashboard`
