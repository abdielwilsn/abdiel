import React, { useState, useEffect, createContext, useContext } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TreeBackground from "./components/TreeBackground";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import Projects from "./pages/Projects";
import Talks from "./pages/Talks";
import Photos from "./pages/Photos";
import Media from "./pages/Media";
import Use from "./pages/Use";
import Now from "./pages/Now";
import Categories from "./pages/Categories";
import CategoryFilter from "./pages/CategoryFilter";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import {
  HomeData,
  Post,
  Project,
  Talk,
  MediaItem,
  Photo,
  ToolSection,
} from "./types";
import { supabase } from "./services/supabase";
import { DataService } from "./services/dataService";
import { INITIAL_HOME_DATA } from "./data";
import { SpeedInsights } from "@vercel/speed-insights/react";

interface DataContextType {
  homeData: HomeData;
  setHomeData: (d: HomeData) => void;
  posts: Post[];
  setPosts: (p: Post[]) => void;
  projects: Project[];
  setProjects: (p: Project[]) => void;
  talks: Talk[];
  setTalks: (t: Talk[]) => void;
  media: MediaItem[];
  setMedia: (m: MediaItem[]) => void;
  photos: Photo[];
  setPhotos: (p: Photo[]) => void;
  useSections: ToolSection[];
  setUseSections: (s: ToolSection[]) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  saveData: (table: string, data: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within DataProvider");
  return context;
};

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [homeData, setHomeData] = useState<HomeData>(INITIAL_HOME_DATA);
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [useSections, setUseSections] = useState<ToolSection[]>([]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    const init = async () => {
      try {
        // 1. Check Auth
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);

        // 2. Load Data (Using Optimized DataService)
        await loadAllContent(false);
      } catch (e) {
        console.warn("Init failed, using fallbacks:", e);
      } finally {
        // Always clear loading screen even if Supabase is unreachable
        setIsLoading(false);
      }
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadAllContent = async (force: boolean) => {
    try {
      const all = await DataService.getAllData(force);
      setHomeData(all.homeData);
      setPosts(all.posts);
      setProjects(all.projects);
      setTalks(all.talks);
      setMedia(all.media);
      setPhotos(all.photos);
      setUseSections(all.useSections);
    } catch (err) {
      console.error("Failed to load content:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (table: string, data: any) => {
    try {
      const { error } = await supabase.from(table).upsert(data);
      if (error) throw error;

      // Clear cache on any save to ensure next visit gets fresh data
      DataService.invalidateCache();

      // Update local state for immediate feedback
      if (table === "site_config") {
        setHomeData({
          name: data.name,
          bioTitle: data.bio_title,
          affiliations: data.affiliations,
          coreTeam: data.core_team,
          creatorOf: data.creatorOf,
          createdProjects: data.created_projects,
        });
      }
    } catch (e) {
      console.error(`Error saving to ${table}:`, e);
      throw e;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    DataService.invalidateCache();
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <DataContext.Provider
      value={{
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
        isAuthenticated,
        isLoading,
        logout,
        saveData,
        refreshData: () => loadAllContent(true),
      }}
    >
      <Router>
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDark ? "dark" : "light"
          } relative flex flex-col`}
        >
          <TreeBackground />
          <Navbar
            isDark={isDark}
            toggleTheme={toggleTheme}
            isAuthenticated={isAuthenticated}
          />

          <div className="max-w-3xl mx-auto px-6 pb-12 md:pb-24 w-full relative z-10 flex-grow">
            <main className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-6 h-6 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs opacity-40 font-mono">
                    Connecting to Cloud...
                  </p>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/posts/:slug" element={<PostDetail />} />
                  <Route path="/now" element={<Now />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route
                    path="/categories/:category"
                    element={<CategoryFilter />}
                  />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/talks" element={<Talks />} />
                  <Route path="/photos" element={<Photos />} />
                  <Route path="/media" element={<Media />} />
                  <Route path="/use" element={<Use />} />
                  <Route path="/kuyik" element={<Login />} />
                  <Route
                    path="/admin"
                    element={
                      isAuthenticated ? <Admin /> : <Navigate to="/login" />
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              )}
            </main>
            <Footer />
          </div>
          <SpeedInsights />
        </div>
      </Router>
    </DataContext.Provider>
  );
};

export default App;



// <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4700530184261512"
//      crossorigin="anonymous"></script>
// <ins class="adsbygoogle"
//      style="display:block"
//      data-ad-format="fluid"
//      data-ad-layout-key="-fb+5w+4e-db+86"
//      data-ad-client="ca-pub-4700530184261512"
//      data-ad-slot="1557802205"></ins>
// <script>
//      (adsbygoogle = window.adsbygoogle || []).push({});
// </script>