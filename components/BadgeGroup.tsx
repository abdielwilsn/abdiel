
import React from 'react';

interface BadgeGroupProps {
  title?: string;
  children: React.ReactNode;
}

const BadgeGroup: React.FC<BadgeGroupProps> = ({ title, children }) => {
  return (
    <div className="my-6">
      {title && <h3 className="text-sm font-medium opacity-50 mb-3">{title}</h3>}
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
};

export default BadgeGroup;
