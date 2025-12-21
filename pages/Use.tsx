
import React from 'react';
import { useData } from '../App';

const Use: React.FC = () => {
  const { useSections } = useData();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Use</h1>
        <p className="opacity-50">The tools and gear I use daily.</p>
      </header>

      <div className="space-y-12">
        {useSections.map((section) => (
          <section key={section.id}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full"></span>
              {section.title}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.items.map((item, idx) => (
                <li key={idx} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 text-sm opacity-80">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {useSections.length === 0 && (
          <div className="py-12 text-center opacity-30 italic">No setup information provided.</div>
        )}
      </div>
    </div>
  );
};

export default Use;
