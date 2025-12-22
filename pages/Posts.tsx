import React from "react";
import { Link } from "react-router-dom";
import { useData } from "../App";

const Posts: React.FC = () => {
  const { posts } = useData();

  // Extract unique years from posts
  // Fix: Explicitly type Set as Set<string> to ensure Array.from returns string[] instead of unknown[]
  const years = Array.from(
    new Set<string>(
      posts.map((p) => {
        const yearMatch = p.date.match(/\d{4}/);
        return yearMatch ? yearMatch[0] : "Other";
      })
    )
  ).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-2">Blog</h1>
          <p className="opacity-50">Sharing my thoughts and findings.</p>
        </div>
        <Link
          to="/categories"
          className="text-sm opacity-50 hover:opacity-100 hover:text-black dark:hover:text-white transition-all border-b border-dashed border-gray-400 dark:border-gray-600"
        >
          Browse Categories
        </Link>
      </header>

      <div className="space-y-10">
        {years.map((year) => {
          const yearPosts = posts.filter((post) => post.date.includes(year));
          if (yearPosts.length === 0) return null;

          return (
            <section key={year}>
              <div className="relative h-10 flex items-center mb-4">
                <span className="text-6xl font-black opacity-[0.03] absolute -left-4 select-none">
                  {year}
                </span>
                <span className="text-xl font-medium opacity-20 dark:opacity-30 ml-2">
                  {year}
                </span>
              </div>

              <ul className="space-y-8">
                {yearPosts.map((post) => (
                  <li key={post.id} className="group">
                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 md:gap-4">
                      <Link
                        to={`/posts/${post.id}`}
                        className="text-lg opacity-80 group-hover:opacity-100 transition-opacity"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-3 text-xs opacity-30 dark:opacity-50 group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity">
                        <span className="whitespace-nowrap">{post.date}</span>
                        <span className="w-1 h-1 bg-current rounded-full"></span>
                        <span className="whitespace-nowrap">
                          {post.duration}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default Posts;
