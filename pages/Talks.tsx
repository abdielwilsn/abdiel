import React from "react";
// Import useData to access the shared state
import { useData } from "../App";

const Talks: React.FC = () => {
  // Access talks from the data context
  const { talks } = useData();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Talks</h1>
        <p className="opacity-50 dark:opacity-70">
          Sharing knowledge on stage and online.
        </p>
      </header>

      <div className="space-y-8">
        {talks.map((talk, idx) => (
          <div
            key={idx}
            className="group border-l-2 border-gray-100  pl-6 py-1 hover:border-black  transition-colors"
          >
            <span className="text-xs font-mono opacity-30 dark:opacity-50 block mb-1">
              {talk.date}
            </span>
            <h3 className="text-xl font-medium mb-1 transition-colors">
              {talk.title}
            </h3>
            <div className="flex items-center gap-2 text-sm opacity-50 dark:opacity-70">
              <span>{talk.event}</span>
              {talk.location && (
                <>
                  <span className="w-1 h-1 bg-current rounded-full"></span>
                  <span>{talk.location}</span>
                </>
              )}
            </div>
            <div className="mt-3 flex gap-4">
              <a
                href={talk.link}
                className="text-xs opacity-40 dark:opacity-60 hover:opacity-100 hover:underline"
              >
                Slides
              </a>
              <a
                href={talk.link}
                className="text-xs opacity-40 dark:opacity-60 hover:opacity-100 hover:underline"
              >
                Video
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Talks;
