import React from 'react';
import { Photo } from '../../types';

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

interface PhotosTabProps {
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  onSave: (table: string, data: any) => Promise<void>;
  onDelete: (table: string, id: string, list: any[], setter: Function) => Promise<void>;
}

const PhotosTab: React.FC<PhotosTabProps> = ({
  photos,
  setPhotos,
  onSave,
  onDelete,
}) => {
  const handleCreateNewPhoto = () => {
    setPhotos([{ id: generateUUID(), url: '', caption: '' }, ...photos]);
  };

  const updatePhoto = (id: string, updates: Partial<Photo>) => {
    setPhotos(photos.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const handleSave = async (photo: Photo) => {
    await onSave('photos', photo);
    alert('Saved!');
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleCreateNewPhoto}
        className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 transition-all font-medium"
      >
        + Add Photo
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4"
          >
            {p.url && (
              <img
                src={p.url}
                className="w-full h-32 object-cover rounded-lg"
                alt={p.caption || 'Photo'}
              />
            )}
            <input
              value={p.url}
              onChange={(e) => updatePhoto(p.id, { url: e.target.value })}
              className="w-full bg-transparent text-xs border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Image URL"
            />
            <input
              value={p.caption}
              onChange={(e) => updatePhoto(p.id, { caption: e.target.value })}
              className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Caption"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleSave(p)}
                className="text-xs bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => onDelete('photos', p.id, photos, setPhotos)}
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

export default PhotosTab;
