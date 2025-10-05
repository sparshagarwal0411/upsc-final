import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Download,
  Award,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';

const FakeLogin2: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('past-results');
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Fake database with students and admin
  const userDatabase = {
    'priya.sharma@student.com': {
      password: 'priya123',
      userType: 'student',
      studentId: 'STU001',
      name: 'Priya Sharma',
      email: 'priya.sharma@student.com',
      phone: '+91-9876543210',
      applications: [
        {
          id: 'UPSC240123456',
          examName: 'Civil Services (Preliminary) Examination 2024',
          applicationDate: '2024-02-15',
          status: 'Result Declared',
          percentile: 97.68757,
          rank: 156,
          qualified: true,
          canViewCertificate: true,
          examDate: '2024-05-26',
          resultDate: '2024-07-15'
        },
        {
          id: 'UPSC230987654',
          examName: 'Civil Services (Preliminary) Examination 2023',
          applicationDate: '2023-02-10',
          status: 'Result Declared',
          percentile: 89.2341,
          rank: 3456,
          qualified: false,
          canViewCertificate: false,
          examDate: '2023-05-28',
          resultDate: '2023-07-12'
        },
        {
          id: 'UPSC250123456',
          examName: 'Civil Services (Preliminary) Examination 2025',
          applicationDate: '2024-12-15',
          status: 'Admit Card Available',
          percentile: null,
          rank: null,
          qualified: null,
          canViewCertificate: false,
          examDate: '2025-05-25',
          resultDate: null,
          admitCardAvailable: true
        }
      ]
    },
    'rajesh.kumar@student.com': {
      password: 'rajesh123',
      userType: 'student',
      studentId: 'STU002',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@student.com',
      phone: '+91-9876543211',
      applications: [
        {
          id: 'UPSC240789012',
          examName: 'Civil Services (Preliminary) Examination 2024',
          applicationDate: '2024-02-18',
          status: 'Result Declared',
          percentile: 95.2341,
          rank: 1247,
          qualified: false,
          canViewCertificate: false,
          examDate: '2024-05-26',
          resultDate: '2024-07-15'
        },
        {
          id: 'UPSC230456789',
          examName: 'Civil Services (Preliminary) Examination 2023',
          applicationDate: '2023-02-12',
          status: 'Result Declared',
          percentile: 87.8912,
          rank: 4567,
          qualified: false,
          canViewCertificate: false,
          examDate: '2023-05-28',
          resultDate: '2023-07-12'
        }
      ]
    },
    'admin@upsc.gov.in': {
      password: 'admin123',
      userType: 'admin',
      adminId: 'ADM001',
      name: 'Admin User',
      email: 'admin@upsc.gov.in',
      phone: '+91-11-23098543'
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = userDatabase[loginForm.username as keyof typeof userDatabase];
    
    if (user && user.password === loginForm.password) {
      setCurrentStudent(user);
      setIsLoggedIn(true);
      // Set default tab based on user type
      setActiveTab(user.userType === 'admin' ? 'analysis' : 'past-results');
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentStudent(null);
    setLoginForm({ username: '', password: '' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Result Declared':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'Under Review':
        return <Clock className="text-yellow-500" size={20} />;
      case 'Rejected':
        return <AlertCircle className="text-red-500" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getQualificationBadge = (qualified: boolean) => {
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        qualified 
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      }`}>
        {qualified ? 'Qualified' : 'Not Qualified'}
      </span>
    );
  };

  if (isLoggedIn && currentStudent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Welcome, {currentStudent.name}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentStudent.userType === 'admin' ? 'Administrator' : `Student ID: ${currentStudent.studentId}`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('past-results')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'past-results'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <FileText className="inline-block w-4 h-4 mr-2" />
                  Past Results
                </button>
                {currentStudent.userType === 'admin' && (
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'analysis'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <BarChart3 className="inline-block w-4 h-4 mr-2" />
                    Analysis
                  </button>
                )}
              </nav>
            </div>
          </div>
          {/* User Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {currentStudent.userType === 'admin' ? 'Administrator Information' : 'Student Information'}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Full Name</span>
                <p className="font-semibold text-gray-900 dark:text-white">{currentStudent.name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                <p className="font-semibold text-gray-900 dark:text-white">{currentStudent.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                <p className="font-semibold text-gray-900 dark:text-white">{currentStudent.phone}</p>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'past-results' && currentStudent.applications && (
            <>
              {/* Applications History */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">My Applications</h2>
            
            <div className="space-y-6">
              {currentStudent.applications.map((application: any, index: number) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(application.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {application.examName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Application ID: {application.id}
                        </p>
                      </div>
                    </div>
                    {application.status === 'Admit Card Available' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Admit Card Ready
                      </span>
                    ) : (
                      getQualificationBadge(application.qualified)
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    {application.status === 'Admit Card Available' ? (
                      <>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            TBD
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Percentile</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            TBD
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Rank</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {application.examDate}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Exam Date</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                            TBD
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Result Date</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {application.percentile}%
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Percentile</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            #{application.rank}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Rank</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <div className="text-sm font-bold text-purple-600 dark:text-purple-400">
                            {application.examDate}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Exam Date</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                            {application.resultDate}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Result Date</div>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <FileText size={16} className="mr-2" />
                      View Details
                    </button>
                    {application.status === 'Admit Card Available' ? (
                      <>
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          <Download size={16} className="mr-2" />
                          Download Admit Card
                        </button>
                        <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                          <Eye size={16} className="mr-2" />
                          Preview Admit Card
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                          <Download size={16} className="mr-2" />
                          Download Result
                        </button>
                        {application.canViewCertificate && (
                          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                            <Award size={16} className="mr-2" />
                            View Certificate
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

              {/* Quick Stats */}
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentStudent.applications.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {currentStudent.applications.filter((app: any) => app.qualified === true).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Qualified</div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="text-purple-600 dark:text-purple-400" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.max(...currentStudent.applications.filter((app: any) => app.percentile !== null).map((app: any) => app.percentile))}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Best Percentile</div>
                </div>
              </div>
            </>
          )}

          {/* Analysis Tab for Admin */}
          {activeTab === 'analysis' && currentStudent.userType === 'admin' && (
            <div className="space-y-6">
              {/* Analytics Overview */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">System Analytics</h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="text-blue-600 dark:text-blue-400" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2,547</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="text-green-600 dark:text-green-400" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">5,234</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Applications</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="text-purple-600 dark:text-purple-400" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1,234</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Qualified Students</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="text-orange-600 dark:text-orange-400" size={24} />
                    </div>
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">23.6%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                  </div>
                </div>

                {/* Charts Placeholder */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Trends</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Chart showing performance over time</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Qualification Distribution</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pie chart showing qualification rates</p>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Activity className="text-green-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New application submitted</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <CheckCircle className="text-blue-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Result processed</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <Target className="text-purple-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">System maintenance completed</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Student Login
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Access your application history and results
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="email"
                  required
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your email"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter your password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Sign In
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default FakeLogin2;
