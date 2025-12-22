import React from 'react';

interface AdminHeaderProps {
  isSaving: boolean;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ isSaving, onLogout }) => {
  return (
    <header className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Admin Portal</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Synchronized with Supabase Cloud</p>
      </div>
      <div className="flex items-center gap-4">
        {isSaving && (
          <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
            Syncing...
          </span>
        )}
        <button
          onClick={onLogout}
          className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 bg-red-500/10 dark:bg-red-500/20 px-3 py-1 rounded-md transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
