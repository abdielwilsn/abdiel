import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { Post } from '../../types';

interface PostEditorProps {
  post: Post;
  onUpdate: (id: string, updates: Partial<Post>) => void;
  onBack: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const PostEditor: React.FC<PostEditorProps> = ({
  post,
  onUpdate,
  onBack,
  onSave,
  isSaving,
}) => {
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [previewHtml, setPreviewHtml] = useState('');

  // Sync preview whenever content changes or mode switches to preview
  useEffect(() => {
    let isMounted = true;
    if (post && editorMode === 'preview') {
      const render = async () => {
        try {
          const html = await marked.parse(post.content || '');
          if (isMounted) setPreviewHtml(html);
        } catch (e) {
          if (isMounted)
            setPreviewHtml(
              '<p class="text-red-500 dark:text-red-400">Error rendering markdown.</p>'
            );
        }
      };
      render();
    }
    return () => {
      isMounted = false;
    };
  }, [post?.content, editorMode]);

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-black p-6 md:p-12 overflow-y-auto animate-in fade-in duration-300">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-4">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M15 19l-7-7 7-7" strokeWidth={2} />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={onSave}
              disabled={isSaving}
              className="bg-black dark:bg-white text-white dark:text-black px-6 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setEditorMode('write')}
                className={`px-4 py-1 text-sm rounded-md transition-all ${
                  editorMode === 'write'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Write
              </button>
              <button
                onClick={() => setEditorMode('preview')}
                className={`px-4 py-1 text-sm rounded-md transition-all ${
                  editorMode === 'preview'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Preview
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input
              className="text-3xl font-bold bg-transparent w-full focus:outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              value={post.title}
              onChange={(e) => onUpdate(post.id, { title: e.target.value })}
              placeholder="Post Title"
            />
            <div className="flex gap-4">
              <input
                className="bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                value={post.date}
                onChange={(e) => onUpdate(post.id, { date: e.target.value })}
                placeholder="Date"
              />
              <input
                className="bg-transparent text-sm text-gray-600 dark:text-gray-400 focus:outline-none border-b border-transparent focus:border-gray-200 dark:focus:border-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                value={post.duration}
                onChange={(e) => onUpdate(post.id, { duration: e.target.value })}
                placeholder="Read duration"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold tracking-widest">
              Categories (comma separated)
            </label>
            <input
              type="text"
              className="w-full bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-lg text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              value={post.categories?.join(', ') || ''}
              onChange={(e) => {
                const inputValue = e.target.value;
                // Split by comma and clean up
                const categoriesArray = inputValue
                  .split(',')
                  .map((cat) => cat.trim())
                  .filter((cat) => cat.length > 0);

                onUpdate(post.id, { categories: categoriesArray });
              }}
              onKeyDown={(e) => {
                // Allow comma key
                if (e.key === ',') {
                  e.stopPropagation();
                }
              }}
              placeholder="tech, css, tooling"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Separate with commas: "tech, css, react"
            </p>
          </div>
        </div>

        <div className="min-h-[600px] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-gray-50/30 dark:bg-gray-900/10">
          {editorMode === 'write' ? (
            <textarea
              className="w-full h-full min-h-[600px] bg-transparent p-6 font-mono text-sm leading-relaxed focus:outline-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Write in Markdown..."
              value={post.content || ''}
              onChange={(e) => onUpdate(post.id, { content: e.target.value })}
            />
          ) : (
            <div
              className="p-6 prose dark:prose-invert max-w-none min-h-[600px] bg-white dark:bg-black/20"
              dangerouslySetInnerHTML={{
                __html:
                  previewHtml ||
                  '<p class="opacity-30 italic">Nothing to preview...</p>',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
