
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../App';
import { marked } from 'marked';
import AdSlot from '../components/AdSlot';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts } = useData();
  const post = posts.find(p => p.id === id);
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const renderMarkdown = async () => {
      if (post?.content) {
        try {
          const result = await marked.parse(post.content);
          setHtmlContent(result);
        } catch (e) {
          console.error("Markdown parsing error:", e);
          setHtmlContent("<p>Error loading content.</p>");
        }
      }
    };
    renderMarkdown();
  }, [post?.content]);

  if (!post) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold opacity-50 mb-4">Post not found</h2>
        <button 
          onClick={() => navigate('/posts')}
          className="text-black dark:text-white hover:underline font-medium"
        >
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <article className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm opacity-40">
          <time>{post.date}</time>
          <span className="w-1 h-1 bg-current rounded-full"></span>
          <span>{post.duration} read</span>
          {post.categories.length > 0 && (
            <>
              <span className="w-1 h-1 bg-current rounded-full"></span>
              <div className="flex gap-2">
                {post.categories.map(cat => (
                  <Link
                    key={cat}
                    to={`/categories/${cat}`}
                    className="hover:text-black dark:hover:text-white transition-colors capitalize"
                  >
                    #{cat}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <div 
        className="prose dark:prose-invert max-w-none opacity-90 leading-relaxed text-[17px]"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {!post.content && (
        <div className="opacity-50 italic py-12">
          <p>This post has no content yet.</p>
        </div>
      )}

      {/* AdSense Placement */}
      <AdSlot />

      <footer className="mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
        <Link 
          to="/posts" 
          className="text-sm opacity-50 hover:opacity-100 hover:text-black dark:hover:text-white transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to the list
        </Link>
      </footer>
    </article>
  );
};

export default PostDetail;
