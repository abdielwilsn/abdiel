
import React from 'react';
import { Link } from 'react-router-dom';
// Import useData to access the shared state
import { useData } from '../App';

const Categories: React.FC = () => {
  // Access posts from the data context
  const { posts } = useData();
  // Fix: Explicitly type Set as Set<string> to ensure Array.from returns string[] instead of unknown[]
  const allCategories: string[] = Array.from(new Set<string>(posts.flatMap(post => post.categories))).sort();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="opacity-50">Browse posts by topic.</p>
      </header>

      <div className="flex flex-wrap gap-4">
        {allCategories.map((cat: string) => {
          const count = posts.filter(p => p.categories.includes(cat)).length;
          return (
            <Link
              key={cat}
              to={`/categories/${cat}`}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-all flex items-center gap-3 group"
            >
              <span className="capitalize">{cat}</span>
              <span className="text-xs opacity-40 group-hover:opacity-100">{count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
