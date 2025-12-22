import React from 'react';
import { MediaItem } from '../../types';

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

interface MediaTabProps {
  media: MediaItem[];
  setMedia: (media: MediaItem[]) => void;
  onSave: (table: string, data: any) => Promise<void>;
  onDelete: (table: string, id: string, list: any[], setter: Function) => Promise<void>;
}

const MediaTab: React.FC<MediaTabProps> = ({
  media,
  setMedia,
  onSave,
  onDelete,
}) => {
  const handleCreateNewMedia = () => {
    setMedia([
      { id: generateUUID(), title: 'New Media', link: '', type: 'video' },
      ...media,
    ]);
  };

  const updateMedia = (id: string, updates: Partial<MediaItem>) => {
    setMedia(media.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleSave = async (mediaItem: MediaItem) => {
    await onSave('media', mediaItem);
    alert('Saved!');
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleCreateNewMedia}
        className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 transition-all font-medium"
      >
        + Add Media Appearance
      </button>
      <div className="space-y-3">
        {media.map((m) => (
          <div
            key={m.id}
            className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-4 items-center"
          >
            <select
              value={m.type}
              onChange={(e) =>
                updateMedia(m.id, { type: e.target.value as any })
              }
              className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded px-2 py-1 text-sm capitalize text-gray-900 dark:text-gray-100"
            >
              {['video', 'podcast', 'article'].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              value={m.title}
              onChange={(e) => updateMedia(m.id, { title: e.target.value })}
              className="bg-transparent flex-1 font-medium text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Title"
            />
            <input
              value={m.link}
              onChange={(e) => updateMedia(m.id, { link: e.target.value })}
              className="bg-transparent text-gray-600 dark:text-gray-400 text-xs flex-1 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="URL"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleSave(m)}
                className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => onDelete('media', m.id, media, setMedia)}
                className="text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
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

export default MediaTab;
