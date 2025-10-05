import React from 'react';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-blue-600',
  height = 'h-2',
  showPercentage = false,
  animated = true
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full">
      <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-right mt-1">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {clampedProgress.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;