import React, { useState } from 'react';
import { BadgeItem } from '../../types';

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

interface BadgeEditorProps {
  title: string;
  items: BadgeItem[];
  onUpdate: (items: BadgeItem[]) => void;
}

const BadgeEditor: React.FC<BadgeEditorProps> = ({ title, items, onUpdate }) => {
  const [newItem, setNewItem] = useState({ label: '', href: '' });

  const handleAdd = () => {
    if (newItem.label) {
      onUpdate([...items, { ...newItem, id: generateUUID() }]);
      setNewItem({ label: '', href: '' });
    }
  };

  const handleRemove = (id: string) => {
    onUpdate(items.filter((i) => i.id !== id));
  };

  return (
    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800">
      <h3 className="text-[10px] font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-widest">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 px-3 py-1 rounded-md text-xs flex items-center gap-2 border border-gray-100 dark:border-gray-700"
          >
            <span className="text-gray-900 dark:text-gray-100">{item.label}</span>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-400 dark:text-red-500 font-bold hover:scale-125 transition-transform"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          placeholder="Label"
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded px-3 py-1.5 text-xs flex-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          value={newItem.label}
          onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
        />
        <input
          placeholder="Link"
          className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded px-3 py-1.5 text-xs flex-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          value={newItem.href}
          onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
        />
        <button
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default BadgeEditor;
