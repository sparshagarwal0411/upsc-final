import React, { createContext, useContext, useState } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
  downloadUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const initialNotifications: Notification[] = [
  {
    id: '1',
    title: 'CSE Prelims 2025 - Registration Closed',
    message: 'Civil Services Preliminary Examination 2025 registration closed on February 21, 2025. Exam scheduled for May 25, 2025.',
    type: 'info',
    date: '2025-02-21',
    read: false,
    downloadUrl: '/downloads/cse-prelims-2025-notification.pdf',
  },
  {
    id: '2',
    title: 'CDS (I) 2025 - Registration Closed',
    message: 'Combined Defence Services Examination (I) 2025 registration closed on January 1, 2025. Exam scheduled for April 14, 2025.',
    type: 'info',
    date: '2025-01-01',
    read: false,
    downloadUrl: '/downloads/cds-i-2025-notification.pdf',
  },
  {
    id: '3',
    title: 'NDA (I) 2025 - Registration Closed',
    message: 'National Defence Academy Examination (I) 2025 registration closed on January 1, 2025. Exam scheduled for April 13, 2025.',
    type: 'info',
    date: '2025-01-01',
    read: false,
  },
  {
    id: '4',
    title: 'Engineering Services 2025 - Registration Closed',
    message: 'Engineering Services Examination 2025 registration closed on November 22, 2024. Prelims on June 8, 2025.',
    type: 'info',
    date: '2024-11-22',
    read: false,
  },
  {
    id: '5',
    title: 'CAPF 2025 - Registration Opening Soon',
    message: 'Central Armed Police Forces (ACs) Examination 2025 registration opens on March 5, 2025. Last date: March 25, 2025.',
    type: 'warning',
    date: '2025-02-28',
    read: false,
    downloadUrl: '/downloads/capf-2025-notification.pdf',
  },
  {
    id: '6',
    title: 'CMS 2025 - Registration Opening Soon',
    message: 'Combined Medical Services Examination 2025 registration opens on February 19, 2025. Last date: March 11, 2025.',
    type: 'warning',
    date: '2025-02-15',
    read: false,
  },
  {
    id: '7',
    title: 'NDA (II) 2025 - Registration Opening Soon',
    message: 'NDA & NA Examination (II) 2025 registration opens on May 28, 2025. Last date: June 20, 2025.',
    type: 'warning',
    date: '2025-05-20',
    read: false,
  },
  {
    id: '8',
    title: 'CDS (II) 2025 - Registration Opening Soon',
    message: 'Combined Defence Services Examination (II) 2025 registration opens on May 28, 2025. Last date: June 20, 2025.',
    type: 'warning',
    date: '2025-05-20',
    read: false,
  },
  {
    id: '9',
    title: 'IFS Prelims 2025 - Registration Closed',
    message: 'Indian Forest Service Preliminary Examination 2025 registration closed on February 21, 2025. Exam on May 25, 2025.',
    type: 'info',
    date: '2025-02-21',
    read: false,
  },
  {
    id: '10',
    title: 'Updated Study Material Available',
    message: 'Latest syllabus and study guides for 2025 examinations now available in Resources section.',
    type: 'success',
    date: '2025-01-15',
    read: true,
    downloadUrl: '/downloads/study-material-2025.zip',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead, markAllAsRead, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};