
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, href, icon, className = '' }) => {
  const content = (
    <span className={`
      inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-sm transition-all
      bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700
      text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white
      ${href ? 'cursor-pointer' : ''}
      ${className}
    `}>
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </span>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
};

export default Badge;
