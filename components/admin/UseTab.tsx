import React from 'react';
import { ToolSection } from '../../types';

// Helper to generate valid UUIDs
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface UseTabProps {
  useSections: ToolSection[];
  setUseSections: (sections: ToolSection[]) => void;
  onSave: (table: string, data: any) => Promise<void>;
  onDelete: (table: string, id: string, list: any[], setter: Function) => Promise<void>;
}

const UseTab: React.FC<UseTabProps> = ({
  useSections,
  setUseSections,
  onSave,
  onDelete,
}) => {
  const handleCreateNewSection = () => {
    setUseSections([
      ...useSections,
      { id: generateUUID(), title: 'New Section', items: [] },
    ]);
  };

  const updateSection = (id: string, updates: Partial<ToolSection>) => {
    setUseSections(
      useSections.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleSave = async (section: ToolSection) => {
    await onSave('tool_sections', section);
    alert('Saved!');
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleCreateNewSection}
        className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 transition-all font-medium"
      >
        + Add Gear Category
      </button>
      <div className="space-y-6">
        {useSections.map((s) => (
          <div
            key={s.id}
            className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4"
          >
            <div className="flex justify-between items-center">
              <input
                value={s.title}
                onChange={(e) => updateSection(s.id, { title: e.target.value })}
                className="bg-transparent text-lg font-bold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(s)}
                  className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Save Section
                </button>
                <button
                  onClick={() =>
                    onDelete('tool_sections', s.id, useSections, setUseSections)
                  }
                  className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase text-gray-500 dark:text-gray-400 font-bold">
                Items (One per line)
              </label>
              <textarea
                value={s.items.join('\n')}
                onChange={(e) =>
                  updateSection(s.id, {
                    items: e.target.value.split('\n').filter((i) => i.trim() !== ''),
                  })
                }
                className="w-full h-32 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-800 p-3 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="MacBook Pro 14..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UseTab;
