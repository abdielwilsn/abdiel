import React from 'react';

interface ItemCardProps {
  title: string;
  subtitle: string;
  onEdit?: () => void;
  onDelete: () => void;
  isSaving?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({
  title,
  subtitle,
  onEdit,
  onDelete,
  isSaving = false,
}) => {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 flex justify-between items-center group">
      <div>
        <h4 className="font-medium text-gray-900 dark:text-gray-100">{title}</h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Edit
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={isSaving}
          className="text-red-400 dark:text-red-500 p-2 hover:scale-110 transition-transform disabled:opacity-30"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              strokeWidth={2}
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
