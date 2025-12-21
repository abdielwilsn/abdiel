
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="h-96 flex flex-col items-center justify-center text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-6xl font-bold opacity-10">404</h1>
        <p className="text-xl opacity-50">Page not found.</p>
      </div>
      <Link 
        to="/" 
        className="px-6 py-2 rounded-full border border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all text-sm"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
