import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Bell,
  Moon,
  Sun,
  Type,
  Globe,
  FileText,
  Calendar,
  BookOpen,
  Search,
  Phone,
  LogIn,
  LogOut,
  User,
  Settings,
  UserCircle,
  ChevronDown,
  Wallet,
  Bot,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userCredit, setUserCredit] = useState<number | null>(null);
  const [creditLoading, setCreditLoading] = useState(false);
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);
  const { isDark, toggleTheme } = useTheme();
  const { unreadCount, markAllAsRead } = useNotifications();
  const { increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  const navigationItems = [
    { name: t('nav.exams'), path: '/exams', icon: Calendar },
    { name: t('Alerts'), path: '/notifications', icon: Bell },
    { name: t('nav.pastPapers'), path: '/past-papers', icon: FileText },
    { name: t('AI Study Assistance'), path: '/ai-study-assistance', icon: Bot },
    // { name: t('nav.applicationStatus'), path: '/application-status', icon: Search },
    { name: t('nav.resources'), path: '/resources', icon: BookOpen },
    { name: t('nav.contact'), path: '/contact', icon: Phone },
    
  ];

  const handleNotificationClick = () => {
    if (unreadCount > 0) {
      markAllAsRead();
    }
  };

  // Fetch user credit
  const fetchUserCredit = async () => {
    if (!isAuthenticated) return;
    
    try {
      setCreditLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) return;

      const response = await fetch("https://igdt.adityaexp.dev/api/user", {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserCredit(userData.user.credit || 0);
      }
    } catch (error) {
      console.error('Error fetching user credit:', error);
    } finally {
      setCreditLoading(false);
    }
  };

  // Format credit amount in rupees
  const formatCredit = (amount: number | null) => {
    if (amount === null) return '₹0';
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch user credit when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCredit();
    } else {
      setUserCredit(null);
    }
  }, [isAuthenticated]);

  // Listen for credit update events
  useEffect(() => {
    const handleCreditUpdate = () => {
      if (isAuthenticated) {
        fetchUserCredit();
      }
    };

    window.addEventListener('creditUpdated', handleCreditUpdate);
    return () => {
      window.removeEventListener('creditUpdated', handleCreditUpdate);
    };
  }, [isAuthenticated]);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/90 backdrop-blur shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 focus:outline-none" aria-label="Home">
  <img src="/logo.png" alt="Logo" className="h-40 md:h-45 w-auto border-none" />
</Link>


          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={item.path === '/notifications' ? handleNotificationClick : undefined}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-800 dark:bg-cyan-400 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-300 dark:hover:bg-blue-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                  {item.path === '/notifications' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Accessibility and Theme Controls */}
          <div className="hidden md:flex items-center space-x-2">
            {/* User Authentication */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <UserCircle size={20} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown size={16} className="text-blue-600 dark:text-blue-400" />
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <User size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      {/* Credit Display */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wallet size={16} className="text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Balance:</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {creditLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                          ) : (
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              {formatCredit(userCredit)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Options */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={16} />
                        <span>Settings</span>
                      </Link>
                      <Link
                        to="/ai-study-assistance"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Bot size={16} />
                        <span>AI Study Assistant</span>
                      </Link>
                      <Link
                        to="/notifications"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleNotificationClick();
                        }}
                      >
                        <Bell size={16} />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-auto">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 px-3 py-2 bg-blue-800 dark:bg-cyan-400 text-white dark:text-black font-semibold rounded-md hover:bg-cyan-500 dark:hover:bg-blue-600 transition-colors"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
            )}

            <button
              onClick={decreaseFontSize}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              title="Decrease font size"
            >
              <Type size={16} />
            </button>
            <button
              onClick={increaseFontSize}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              title="Increase font size"
            >
              <Type size={20} />
            </button>
            <button
              onClick={toggleLanguage}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              title="Toggle language"
            >
              <Globe size={18} />
              <span className="ml-1 text-sm">{language.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* Credit Display */}
                <div className="mb-3 flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Wallet size={16} className="text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Balance:</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {creditLoading ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCredit(userCredit)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile Profile Options */}
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </Link>
                  <Link
                    to="/ai-study-assistance"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Bot size={16} />
                    <span>AI Study Assistant</span>
                  </Link>
                  <Link
                    to="/notifications"
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => {
                      setIsOpen(false);
                      handleNotificationClick();
                    }}
                  >
                    <Bell size={16} />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-auto">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full text-left"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn size={18} />
                  <span>Login / Register</span>
                </Link>
              </div>
            )}

            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    setIsOpen(false);
                    if (item.path === '/notifications') {
                      handleNotificationClick();
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                  {item.path === '/notifications' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs ml-2">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
            
            {/* Mobile accessibility controls */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Accessibility</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={decreaseFontSize}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Type size={14} />
                  </button>
                  <button
                    onClick={increaseFontSize}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Type size={18} />
                  </button>
                  <button
                    onClick={toggleLanguage}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Globe size={16} />
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="p-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;