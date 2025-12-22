import React from 'react';
import { useData } from '../App';

const Use: React.FC = () => {
  const { useSections } = useData();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Use
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          The tools and gear I use daily.
        </p>
      </header>

      <div className="space-y-12">
        {useSections.map((section) => (
          <section key={section.id}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-900 dark:bg-gray-100"></span>
              {section.title}
            </h2>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {section.items.map((item, idx) => (
                <li
                  key={idx}
                  className="
                    p-3 rounded-lg 
                    border border-gray-200 dark:border-gray-800 
                    bg-white dark:bg-gray-900 
                    text-gray-700 dark:text-gray-300 
                    text-sm 
                    hover:border-gray-300 dark:hover:border-gray-700 
                    transition-colors
                  "
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}

        {useSections.length === 0 && (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500 italic">
            No setup information provided.
          </div>
        )}
      </div>
    </div>
  );
};

export default Use;