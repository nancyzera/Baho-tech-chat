import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  DollarSign,
  UserCheck,
  Menu,
  Bell,
  Search,
  Accessibility
} from 'lucide-react';
import { useState } from 'react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    {
      title: 'Active Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Messages Today',
      value: '18,429',
      change: '+8.2%',
      trend: 'up',
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Active Premium Plans',
      value: '1,234',
      change: '+15.3%',
      trend: 'up',
      icon: CreditCard,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Revenue (MTD)',
      value: '$23,456',
      change: '+18.7%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const recentActivity = [
    { id: 1, user: 'Sarah Johnson', action: 'Subscribed to Premium', time: '5 min ago', amount: '$19.00', status: 'success' },
    { id: 2, user: 'Michael Chen', action: 'Started free trial', time: '12 min ago', amount: '-', status: 'pending' },
    { id: 3, user: 'Emily Rodriguez', action: 'Upgraded to Enterprise', time: '23 min ago', amount: '$49.00', status: 'success' },
    { id: 4, user: 'David Kim', action: 'Sent 100 messages', time: '35 min ago', amount: '-', status: 'active' },
    { id: 5, user: 'Lisa Williams', action: 'Canceled subscription', time: '1 hour ago', amount: '-$19.00', status: 'canceled' },
    { id: 6, user: 'James Brown', action: 'Subscribed to Premium', time: '2 hours ago', amount: '$19.00', status: 'success' }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'chat-logs', label: 'Chat Logs', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#4A00E0] to-[#8E2DE2] text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Accessibility className="w-6 h-6 text-[#4A00E0]" />
          </div>
          <div>
            <div className="text-white">Baho Tech</div>
            <div className="text-white/70 text-sm">Admin Panel</div>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? 'bg-white/20 shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => onNavigate('landing')}
          className="w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-center"
        >
          Back to Site
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users, transactions..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#4A00E0] w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] flex items-center justify-center">
                <span className="text-white">A</span>
              </div>
              <div>
                <div className="text-gray-900">Admin User</div>
                <div className="text-gray-600 text-sm">Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-gray-900 text-3xl mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600">Monitor your platform's performance and user activity</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                        stat.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">{stat.change}</span>
                      </div>
                    </div>
                    <div className="text-gray-600 text-sm mb-1">{stat.title}</div>
                    <div className="text-gray-900 text-3xl">{stat.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-gray-900 text-xl mb-1">
                      Recent Activity
                    </h2>
                    <p className="text-gray-600 text-sm">Latest user actions and transactions</p>
                  </div>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] text-white rounded-lg hover:shadow-lg transition-shadow">
                    View All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-gray-600 text-sm">User</th>
                      <th className="px-6 py-4 text-left text-gray-600 text-sm">Action</th>
                      <th className="px-6 py-4 text-left text-gray-600 text-sm">Time</th>
                      <th className="px-6 py-4 text-left text-gray-600 text-sm">Amount</th>
                      <th className="px-6 py-4 text-left text-gray-600 text-sm">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] flex items-center justify-center">
                              <UserCheck className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-gray-900">{activity.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{activity.action}</td>
                        <td className="px-6 py-4 text-gray-600">{activity.time}</td>
                        <td className="px-6 py-4 text-gray-900">{activity.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-sm ${
                            activity.status === 'success' ? 'bg-green-100 text-green-700' :
                            activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            activity.status === 'active' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] flex items-center justify-center">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-gray-900 text-lg">System Health</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">API Response Time</span>
                      <span className="text-gray-900">98ms</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">Server Uptime</span>
                      <span className="text-gray-900">99.9%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600 text-sm">User Satisfaction</span>
                      <span className="text-gray-900">4.8/5.0</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#4A00E0] to-[#8E2DE2] rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span>Add New User</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>View All Chats</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-left flex items-center gap-3">
                    <CreditCard className="w-5 h-5" />
                    <span>Manage Subscriptions</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
