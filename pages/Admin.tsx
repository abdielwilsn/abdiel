import React, { useState, useMemo } from "react";
import { useData } from "../App";
import { Post } from "../types";
import { supabase } from "../services/supabase";
import { DataService } from "../services/dataService";
import {
  INITIAL_HOME_DATA,
  INITIAL_POSTS,
  INITIAL_PROJECTS,
  INITIAL_TALKS,
  INITIAL_MEDIA,
  INITIAL_PHOTOS,
  INITIAL_USE_SECTIONS,
} from "../data";
import AdminHeader from "../components/admin/AdminHeader";
import TabNavigation, { TabType } from "../components/admin/TabNavigation";
import PostEditor from "../components/admin/PostEditor";
import HomeTab from "../components/admin/HomeTab";
import PostsTab from "../components/admin/PostsTab";
import ProjectsTab from "../components/admin/ProjectsTab";
import TalksTab from "../components/admin/TalksTab";
import MediaTab from "../components/admin/MediaTab";
import PhotosTab from "../components/admin/PhotosTab";
import UseTab from "../components/admin/UseTab";

// Constants
const SITE_CONFIG_ID = "00000000-0000-0000-0000-000000000000";

// Helper to generate valid UUIDs for Supabase compatibility
const generateUUID = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for non-secure contexts
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Admin: React.FC = () => {
  const {
    homeData,
    setHomeData,
    posts,
    setPosts,
    projects,
    setProjects,
    talks,
    setTalks,
    media,
    setMedia,
    photos,
    setPhotos,
    useSections,
    setUseSections,
    logout,
    saveData,
    refreshData,
  } = useData();

  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const editingPost = useMemo(
    () => posts.find((p) => p.id === editingPostId),
    [posts, editingPostId]
  );

  const handleDelete = async (
    table: string,
    id: string,
    list: any[],
    setter: Function
  ) => {
    if (confirm("Are you sure you want to delete this?")) {
      setIsSaving(true);
      try {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
        setter(list.filter((i: any) => i.id !== id));
        DataService.invalidateCache();
      } catch (e: any) {
        alert(e.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const seedDatabase = async () => {
    if (
      !confirm(
        "This will overwrite/reset database content with the default template. Continue?"
      )
    )
      return;
    setIsSaving(true);
    try {
      // Clear existing site config first
      await supabase.from("site_config").delete().neq("id", "0");

      await saveData("site_config", {
        id: SITE_CONFIG_ID,
        name: INITIAL_HOME_DATA.name,
        bio_title: INITIAL_HOME_DATA.bioTitle,
        affiliations: INITIAL_HOME_DATA.affiliations,
        core_team: INITIAL_HOME_DATA.coreTeam,
        creatorOf: INITIAL_HOME_DATA.creatorOf,
        created_projects: INITIAL_HOME_DATA.createdProjects,
      });

      await Promise.all([
        ...INITIAL_POSTS.map((post) =>
          saveData("posts", { ...post, id: generateUUID() })
        ),
        ...INITIAL_PROJECTS.map((project) =>
          saveData("projects", { ...project, id: generateUUID() })
        ),
        ...INITIAL_TALKS.map((talk) =>
          saveData("talks", { ...talk, id: generateUUID() })
        ),
        ...INITIAL_MEDIA.map((m) =>
          saveData("media", { ...m, id: generateUUID() })
        ),
        ...INITIAL_PHOTOS.map((p) =>
          saveData("photos", { ...p, id: generateUUID() })
        ),
        ...INITIAL_USE_SECTIONS.map((section) =>
          saveData("tool_sections", { ...section, id: generateUUID() })
        ),
      ]);

      DataService.invalidateCache();
      alert("Database seeded successfully!");
      await refreshData();
    } catch (e: any) {
      console.error(e);
      alert(`Error seeding database: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updatePostState = (id: string, updates: Partial<Post>) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const saveHomeConfig = async () => {
    setIsSaving(true);
    try {
      await saveData("site_config", {
        id: SITE_CONFIG_ID,
        name: homeData.name,
        bio_title: homeData.bioTitle,
        affiliations: homeData.affiliations,
        core_team: homeData.coreTeam,
        creatorOf: homeData.creatorOf,
        created_projects: homeData.createdProjects,
      });
      alert("Home config saved!");
    } finally {
      setIsSaving(false);
    }
  };

  const saveCurrentPost = async () => {
    if (!editingPost) return;
    setIsSaving(true);
    try {
      const postToSave = { ...editingPost };
      await saveData("posts", postToSave);
      alert("Post saved!");
    } catch (e: any) {
      alert(`Error saving post: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Show post editor when editing
  if (editingPostId && editingPost) {
    return (
      <PostEditor
        post={editingPost}
        onUpdate={updatePostState}
        onBack={() => setEditingPostId(null)}
        onSave={saveCurrentPost}
        isSaving={isSaving}
      />
    );
  }

  // Main admin dashboard
  return (
    <div className="space-y-8 pb-24">
      <AdminHeader isSaving={isSaving} onLogout={logout} />

      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "home" && (
          <HomeTab
            homeData={homeData}
            setHomeData={setHomeData}
            onSave={saveHomeConfig}
            onSeedDatabase={seedDatabase}
            isSaving={isSaving}
          />
        )}

        {activeTab === "posts" && (
          <PostsTab
            posts={posts}
            setPosts={setPosts}
            onEditPost={setEditingPostId}
            onDelete={handleDelete}
            isSaving={isSaving}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            setProjects={setProjects}
            onSave={saveData}
            onDelete={handleDelete}
            isSaving={isSaving}
          />
        )}

        {activeTab === "talks" && (
          <TalksTab
            talks={talks}
            setTalks={setTalks}
            onSave={saveData}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "media" && (
          <MediaTab
            media={media}
            setMedia={setMedia}
            onSave={saveData}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "photos" && (
          <PhotosTab
            photos={photos}
            setPhotos={setPhotos}
            onSave={saveData}
            onDelete={handleDelete}
          />
        )}

        {activeTab === "use" && (
          <UseTab
            useSections={useSections}
            setUseSections={setUseSections}
            onSave={saveData}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Admin;
