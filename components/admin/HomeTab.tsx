import React from 'react';
import BadgeEditor from './BadgeEditor';
import { HomeData } from '../../types';

interface HomeTabProps {
  homeData: HomeData;
  setHomeData: (data: HomeData) => void;
  onSave: () => Promise<void>;
  onSeedDatabase: () => Promise<void>;
  isSaving: boolean;
}

const HomeTab: React.FC<HomeTabProps> = ({
  homeData,
  setHomeData,
  onSave,
  onSeedDatabase,
  isSaving,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-3">
        <button
          onClick={onSeedDatabase}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          Reset to Defaults
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          Save Changes
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">
            Site Display Name
          </label>
          <input
            value={homeData.name}
            onChange={(e) => setHomeData({ ...homeData, name: e.target.value })}
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-gray-500 dark:text-gray-400 font-bold">
            Bio Intro Text
          </label>
          <textarea
            value={homeData.bioTitle}
            onChange={(e) =>
              setHomeData({ ...homeData, bioTitle: e.target.value })
            }
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg px-4 py-2 h-24 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
      </div>
      <BadgeEditor
        title="Affiliations"
        items={homeData.affiliations}
        onUpdate={(items) => setHomeData({ ...homeData, affiliations: items })}
      />
      <BadgeEditor
        title="Core Team"
        items={homeData.coreTeam}
        onUpdate={(items) => setHomeData({ ...homeData, coreTeam: items })}
      />
      <BadgeEditor
        title="Maintaining"
        items={homeData.maintaining}
        onUpdate={(items) => setHomeData({ ...homeData, maintaining: items })}
      />
      <BadgeEditor
        title="Home Badge Collection"
        items={homeData.createdProjects}
        onUpdate={(items) =>
          setHomeData({ ...homeData, createdProjects: items })
        }
      />
    </div>
  );
};

export default HomeTab;
