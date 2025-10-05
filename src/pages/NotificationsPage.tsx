import React from 'react';
import { Bell, Calendar, AlertTriangle, CheckCircle, Info, Download } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  // Mark all as read when the page loads
  React.useEffect(() => {
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0) {
      markAllAsRead();
    }
  }, []);

  // Download function
  const handleDownload = (notification: any) => {
    if (notification.downloadUrl) {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = notification.downloadUrl;
      link.download = `${notification.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // Mark as read if not already read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Trigger download if download URL exists
    if (notification.downloadUrl) {
      handleDownload(notification);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-600" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-600" />;
      default:
        return <Info size={20} className="text-blue-600" />;
    }
  };

  const getNotificationBorder = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-l-yellow-500';
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="animate-slideInDown">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-300">Stay updated with important announcements and deadlines</p>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={notification.id}
            className={`bg-slate-200/20 dark:bg-slate-800/30 rounded-xl shadow-lg p-6 border-l-4 ${getNotificationBorder(notification.type)} ${
              !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
            } transform transition-all duration-300 hover:bg-slate-400/30 hover:shadow-xl dark:hover:bg-slate-600/30 dark:hover:shadow-xl animate-slideInUp ${
              notification.downloadUrl ? 'cursor-pointer' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {notification.title}
                    {!notification.read && (
                      <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                    {notification.downloadUrl && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Download size={12} className="mr-1" />
                        Download Available
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={16} className="mr-1" />
                    {notification.date}
                  </div>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{notification.message}</p>
                <div className="mt-3 flex space-x-3">
                  {!notification.read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Mark as read
                    </button>
                  )}
                  {notification.downloadUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(notification);
                      }}
                      className="inline-flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      <Download size={14} className="mr-1" />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
          <p className="text-gray-600 dark:text-gray-300">You're all caught up! Check back later for updates.</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;