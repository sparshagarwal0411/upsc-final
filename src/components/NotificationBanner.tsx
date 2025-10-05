import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const NotificationBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Important:</strong> UPSC Civil Services Preliminary Exam 2024 registration deadline extended to March 15, 2024.
              <a href="/notifications" className="ml-1 underline hover:no-underline">
                View details
              </a>
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationBanner;