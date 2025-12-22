import React from 'react';
import { Project } from '../../types';

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

interface ProjectsTabProps {
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  onSave: (table: string, data: any) => Promise<void>;
  onDelete: (table: string, id: string, list: any[], setter: Function) => Promise<void>;
  isSaving: boolean;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  projects,
  setProjects,
  onSave,
  onDelete,
  isSaving,
}) => {
  const handleCreateNewProject = () => {
    const newProj = {
      id: generateUUID(),
      name: 'New Project',
      description: '',
      link: '',
      github: '',
    };
    setProjects([newProj, ...projects]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const handleSave = async (project: Project) => {
    await onSave('projects', project);
    alert('Project saved!');
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleCreateNewProject}
        className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-xl text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-700 transition-all font-medium"
      >
        + Add Project
      </button>
      <div className="space-y-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-6 bg-gray-50 dark:bg-gray-900/40 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4 relative group"
          >
            <div className="grid grid-cols-2 gap-4">
              <input
                value={proj.name}
                onChange={(e) => updateProject(proj.id, { name: e.target.value })}
                className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-black dark:focus:border-white font-bold text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="Project Name"
              />
              <input
                value={proj.github}
                onChange={(e) =>
                  updateProject(proj.id, { github: e.target.value })
                }
                className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none focus:border-black dark:focus:border-white text-sm text-gray-600 dark:text-gray-400 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="GitHub user/repo"
              />
            </div>
            <textarea
              value={proj.description}
              onChange={(e) =>
                updateProject(proj.id, { description: e.target.value })
              }
              className="w-full bg-transparent text-sm focus:outline-none border border-transparent focus:border-gray-200 dark:focus:border-gray-700 p-2 rounded-md text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
              placeholder="Project description..."
            />
            <div className="flex justify-between items-center">
              <input
                value={proj.link}
                onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                className="bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none text-xs w-1/2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
                placeholder="Website Link"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave(proj)}
                  className="bg-black dark:bg-white text-white dark:text-black px-4 py-1 rounded text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => onDelete('projects', proj.id, projects, setProjects)}
                  className="text-red-400 dark:text-red-500 p-1 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsTab;
