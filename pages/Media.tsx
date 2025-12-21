
import React from 'react';
// Import useData to access the shared state
import { useData } from '../App';

const Media: React.FC = () => {
  // Access media from the data context
  const { media } = useData();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Media</h1>
        <p className="opacity-50">Appearances on podcasts, videos, and interviews.</p>
      </header>

      <div className="space-y-6">
        {media.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            className="flex items-center gap-4 group p-3 -mx-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
              {item.type === 'video' ? '🎬' : item.type === 'podcast' ? '🎙️' : '📰'}
            </div>
            <div>
              <h3 className="font-medium group-hover:text-black dark:group-hover:text-white transition-colors">{item.title}</h3>
              <span className="text-xs opacity-30 uppercase tracking-widest">{item.type}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Media;
