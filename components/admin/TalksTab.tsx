import React from 'react';
import { Talk } from '../../types';

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

interface TalksTabProps {
  talks: Talk[];
  setTalks: (talks: Talk[]) => void;
  onSave: (table: string, data: any) => Promise<void>;
  onDelete: (table: string, id: string, list: any[], setter: Function) => Promise<void>;
}

const TalksTab: React.FC<TalksTabProps> = ({
  talks,
  setTalks,
  onSave,
  onDelete,
}) => {
  const handleCreateNewTalk = () => {
    const newTalk = {
      id: generateUUID(),
      title: 'New Talk',
      event: '',
      date: '',
      link: '',
      location: '',
    };
    setTalks([newTalk, ...talks]);
  };

  const updateTalk = (id: string, updates: Partial<Talk>) => {
    setTalks(talks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleSave = async (talk: Talk) => {
    await onSave('talks', talk);
    alert('Talk saved!');
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleCreateNewTalk}
        className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 transition-all font-medium"
      >
        + Add Talk Entry
      </button>
      <div className="space-y-4">
        {talks.map((talk) => (
          <div
            key={talk.id}
            className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              value={talk.title}
              onChange={(e) => updateTalk(talk.id, { title: e.target.value })}
              className="bg-transparent font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Talk Title"
            />
            <input
              value={talk.event}
              onChange={(e) => updateTalk(talk.id, { event: e.target.value })}
              className="bg-transparent text-gray-600 dark:text-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Event Name"
            />
            <input
              value={talk.date}
              onChange={(e) => updateTalk(talk.id, { date: e.target.value })}
              className="bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Date (e.g. Oct 2024)"
            />
            <div className="flex gap-2 items-center justify-end">
              <button
                onClick={() => handleSave(talk)}
                className="bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => onDelete('talks', talk.id, talks, setTalks)}
                className="text-red-400 dark:text-red-500 p-1 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalksTab;
