
import React from 'react';
import { useData } from '../App';

const Photos: React.FC = () => {
  const { photos } = useData();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Photos</h1>
        <p className="opacity-50">Capturing moments through my lens.</p>
      </header>

      {photos.length === 0 ? (
        <div className="py-24 text-center opacity-30 italic">No photos shared yet.</div>
      ) : (
        <div className="columns-1 md:columns-2 gap-4 space-y-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800 break-inside-avoid">
              <img 
                src={photo.url} 
                alt={photo.caption} 
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-sm">{photo.caption}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Photos;
