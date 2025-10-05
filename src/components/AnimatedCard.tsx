import React from 'react';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  animation?: 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'fadeIn' | 'scaleIn' | 'bounceIn';
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  delay = 0, 
  className = '', 
  animation = 'slideInUp' 
}) => {
  const animationClass = `animate-${animation}`;
  
  return (
    <div 
      className={`${animationClass} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default AnimatedCard;
