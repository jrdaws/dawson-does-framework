"use client";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check localStorage and system preference
    const stored = localStorage.getItem('darkMode');
    const isDark = stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const stats = [
    { label: "Total Revenue", value: "$45,231.89", change: "+20.1%", positive: true },
    { label: "Active Users", value: "2,350", change: "+12.3%", positive: true },
    { label: "Conversions", value: "456", change: "-3.2%", positive: false },
    { label: "Total Orders", value: "1,234", change: "+8.7%", positive: true }
  ];

  const recentActivity = [
    { user: "Sarah Johnson", action: "Created new project", time: "2 minutes ago" },
    { user: "Mike Chen", action: "Updated settings", time: "15 minutes ago" },
    { user: "Emma Davis", action: "Completed task", time: "1 hour ago" },
    { user: "John Smith", action: "Added new member", time: "2 hours ago" },
    { user: "Lisa Brown", action: "Exported report", time: "3 hours ago" }
  ];

  const tableData = [
    { id: "#3210", customer: "Sarah Johnson", status: "Completed", amount: "$299.00", date: "Dec 20, 2024" },
    { id: "#3209", customer: "Mike Chen", status: "Pending", amount: "$149.00", date: "Dec 20, 2024" },
    { id: "#3208", customer: "Emma Davis", status: "Completed", amount: "$499.00", date: "Dec 19, 2024" },
    { id: "#3207", customer: "John Smith", status: "Cancelled", amount: "$199.00", date: "Dec 19, 2024" },
    { id: "#3206", customer: "Lisa Brown", status: "Completed", amount: "$349.00", date: "Dec 18, 2024" }
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-0'} bg-gray-800 dark:bg-black text-white transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-6 border-b border-gray-700 dark:border-gray-800">
          <h2 className="m-0 text-xl">Dashboard</h2>
        </div>
        <nav className="flex-1 py-4">
          {[
            { label: "Overview", icon: "📊", active: true },
            { label: "Analytics", icon: "📈" },
            { label: "Customers", icon: "👥" },
            { label: "Orders", icon: "🛍️" },
            { label: "Products", icon: "📦" },
            { label: "Settings", icon: "⚙️" }
          ].map((item, i) => (
            <a
              key={i}
              href={item.label === "Settings" ? "/settings" : "#"}
              className={`flex items-center gap-3 px-6 py-3 text-white no-underline ${item.active ? 'bg-gray-700 dark:bg-gray-800 border-l-[3px] border-l-blue-500' : 'border-l-[3px] border-l-transparent hover:bg-gray-700 dark:hover:bg-gray-800'}`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-6 border-t border-gray-700 dark:border-gray-800">
          <div className="text-sm text-gray-400 dark:text-gray-500">Logged in as</div>
          <div className="font-medium mt-1">admin@example.com</div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center transition-colors">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-transparent border-none text-xl cursor-pointer text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          >
            ☰
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="bg-transparent border-none text-xl cursor-pointer hover:opacity-70"
              aria-label="Toggle dark mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="bg-transparent border-none text-xl cursor-pointer hover:opacity-70">
              🔔
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
          <h1 className="mb-6 text-3xl font-semibold text-gray-900 dark:text-white">Overview</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{stat.label}</div>
                <div className="text-3xl font-semibold mb-2 text-gray-900 dark:text-white">{stat.value}</div>
                <div className={`text-sm ${stat.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change} from last month
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-[2fr_1fr] gap-6 mb-6">
            {/* Chart Placeholder */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Revenue Chart</h2>
              <div className="h-[300px] bg-gradient-to-b from-blue-500 to-blue-800 rounded-lg flex items-center justify-center text-white text-lg">
                Chart Component Placeholder
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <div className="flex flex-col gap-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className={`pb-4 ${i < recentActivity.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{activity.user}</div>
                    <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-1">{activity.action}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 text-sm text-gray-900 dark:text-gray-200">{row.id}</td>
                      <td className="p-3 text-sm text-gray-900 dark:text-gray-200">{row.customer}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          row.status === "Completed" ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                          row.status === "Pending" ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                          'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm font-medium text-gray-900 dark:text-gray-200">{row.amount}</td>
                      <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{row.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
