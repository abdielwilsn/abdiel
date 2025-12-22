
import React from 'react';
import { useData } from '../App';

const Projects: React.FC = () => {
  const { projects } = useData();

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Projects</h1>
        <p className="opacity-50 dark:opacity-70">Collection of tools and libraries I have built.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <a
            key={project.id}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600  transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{project.name}</h3>
              {project.github && (
                <span className="text-xs opacity-30 dark:opacity-50 group-hover:opacity-60 dark:group-hover:opacity-80 transition-opacity">
                  {project.github.includes('/') ? project.github.split('/')[1] : project.github}
                </span>
              )}
            </div>
            <p className="text-sm opacity-50 dark:opacity-70 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </a>
        ))}
      </div>

      <section className="pt-12 text-center opacity-40 dark:opacity-60 italic text-sm">
        <p>And many more experiments on my GitHub...</p>
      </section>
    </div>
  );
};

export default Projects;
