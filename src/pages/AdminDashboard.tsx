import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Download,
  Eye,
  Settings,
  Bell,
  Shield,
  Activity,
  UserCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Applications',
      value: '1,24,567',
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'Registered Users',
      value: '2,45,890',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Active Exams',
      value: '15',
      change: '+2',
      trend: 'up',
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Success Rate',
      value: '0.23%',
      change: '+0.02%',
      trend: 'up',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const recentApplications = [
    { id: 'UPSC240001', name: 'Rahul Sharma', exam: 'CSE Prelims', status: 'Completed', date: '2024-01-15' },
    { id: 'UPSC240002', name: 'Priya Singh', exam: 'CDS (I)', status: 'Pending', date: '2024-01-15' },
    { id: 'UPSC240003', name: 'Amit Kumar', exam: 'NDA (I)', status: 'Completed', date: '2024-01-14' },
    { id: 'UPSC240004', name: 'Sneha Patel', exam: 'ESE', status: 'Under Review', date: '2024-01-14' },
    { id: 'UPSC240005', name: 'Vikash Yadav', exam: 'CAPF', status: 'Completed', date: '2024-01-13' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'Server load is high (85%)', time: '5 min ago' },
    { type: 'info', message: 'Database backup completed successfully', time: '1 hour ago' },
    { type: 'success', message: 'Payment gateway updated', time: '2 hours ago' },
    { type: 'error', message: 'Failed login attempts detected', time: '3 hours ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'under review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'error': return <AlertTriangle size={16} className="text-red-500" />;
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      default: return <Bell size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="text-blue-600" size={32} />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">UPSC Portal Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'users', name: 'Users', icon: Users },
                { id: 'exams', name: 'Exams', icon: Calendar },
                { id: 'system', name: 'System', icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp size={16} className="text-green-500 mr-1" />
                          <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts and Tables */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Applications */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Applications</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View All</button>
                </div>
                <div className="space-y-4">
                  {recentApplications.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{app.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{app.id} • {app.exam}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{app.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Alerts</h3>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Clear All</button>
                </div>
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Management</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <UserCheck size={16} className="mr-2 inline" />
                  Verify Users
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download size={16} className="mr-2 inline" />
                  Export
                </button>
              </div>
            </div>
            <div className="text-center py-12">
              <Users size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">User Management Panel</h3>
              <p className="text-gray-600 dark:text-gray-300">Advanced user management features coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exam Management</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Calendar size={16} className="mr-2 inline" />
                  Schedule Exam
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Eye size={16} className="mr-2 inline" />
                  View Reports
                </button>
              </div>
            </div>
            <div className="text-center py-12">
              <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Exam Management Panel</h3>
              <p className="text-gray-600 dark:text-gray-300">Comprehensive exam scheduling and management tools</p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Monitoring</h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  <Activity size={16} className="mr-2 inline" />
                  System Health
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Download size={16} className="mr-2 inline" />
                  Logs
                </button>
              </div>
            </div>
            <div className="text-center py-12">
              <Activity size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">System Monitoring</h3>
              <p className="text-gray-600 dark:text-gray-300">Real-time system performance and health monitoring</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;