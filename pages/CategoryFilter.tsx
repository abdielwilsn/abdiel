
import React from 'react';
import { useParams, Link } from 'react-router-dom';
// Import useData to access the shared state
import { useData } from '../App';

const CategoryFilter: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  // Access posts from the data context
  const { posts } = useData();
  const filteredPosts = posts.filter(post => post.categories.includes(category || ''));

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="opacity-30">Category:</span>
            <span className="text-black dark:text-white capitalize">{category}</span>
          </h1>
          <p className="opacity-50">Found {filteredPosts.length} posts.</p>
        </div>
        <Link to="/categories" className="text-sm opacity-50 hover:opacity-100 hover:text-black dark:hover:text-white underline underline-offset-4">
          All Categories
        </Link>
      </header>

      <ul className="space-y-8">
        {filteredPosts.map(post => (
          <li key={post.id} className="group">
            <Link to={`/posts/${post.id}`} className="block space-y-1">
              <h3 className="text-xl group-hover:text-black dark:group-hover:text-white transition-colors font-medium">
                {post.title}
              </h3>
              <div className="flex items-center gap-3 text-sm opacity-40">
                <span>{post.date}</span>
                <span className="w-1 h-1 bg-current rounded-full"></span>
                <span>{post.duration}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;
