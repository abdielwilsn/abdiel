import React from 'react';
import ItemCard from './ItemCard';
import { Post } from '../../types';

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

interface PostsTabProps {
  posts: Post[];
  setPosts: (posts: Post[]) => void;
  onEditPost: (postId: string) => void;
  onDelete: (table: string, id: string, list: any[], setter: Function) => Promise<void>;
  isSaving: boolean;
}

const PostsTab: React.FC<PostsTabProps> = ({
  posts,
  setPosts,
  onEditPost,
  onDelete,
  isSaving,
}) => {
  const handleCreateNewPost = () => {
    const newId = generateUUID();
    const newPost = {
      id: newId,
      slug: 'untitled-post',
      title: 'Untitled Post',
      date: new Date().toDateString(),
      duration: '5 min',
      categories: [],
      content: '',
    };
    setPosts([newPost, ...posts]);
    onEditPost(newId);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleCreateNewPost}
        className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 transition-all font-medium"
      >
        + Write New Post
      </button>
      <div className="space-y-3">
        {posts.map((post) => (
          <ItemCard
            key={post.id}
            title={post.title}
            subtitle={`${post.date} • ${post.duration}`}
            onEdit={() => onEditPost(post.id)}
            onDelete={() => onDelete('posts', post.id, posts, setPosts)}
            isSaving={isSaving}
          />
        ))}
      </div>
    </div>
  );
};

export default PostsTab;
