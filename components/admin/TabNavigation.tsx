import React from 'react';

export type TabType = 'home' | 'posts' | 'projects' | 'talks' | 'media' | 'photos' | 'use';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { value: TabType; label: string }[] = [
    { value: 'home', label: 'Home' },
    { value: 'posts', label: 'Posts' },
    { value: 'projects', label: 'Projects' },
    { value: 'talks', label: 'Talks' },
    { value: 'media', label: 'Media' },
    { value: 'photos', label: 'Photos' },
    { value: 'use', label: 'Tools' },
  ];

  return (
    <nav className="flex gap-4 border-b border-gray-100 dark:border-gray-800 pb-1 overflow-x-auto whitespace-nowrap scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`capitalize pb-3 px-1 text-sm transition-all border-b-2 ${
            activeTab === tab.value
              ? 'border-black dark:border-white text-gray-900 dark:text-gray-100 font-bold'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default TabNavigation;
