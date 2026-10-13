import React, { useState, useEffect, createContext, useContext } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import {
  HomeData,
  Post,
  Project,
  Talk,
  MediaItem,
  Photo,
  ToolSection,
} from "./types";
import {
  INITIAL_HOME_DATA,
  INITIAL_PROJECTS,
  INITIAL_TALKS,
  INITIAL_MEDIA,
  INITIAL_PHOTOS,
  INITIAL_USE_SECTIONS,
} from "./data";
import { POSTS } from "./utils/posts";
import { SpeedInsights } from "@vercel/speed-insights/react";

interface DataContextType {
  homeData: HomeData;
  posts: Post[];
  projects: Project[];
  talks: Talk[];
  media: MediaItem[];
  photos: Photo[];
  useSections: ToolSection[];
}

const siteData: DataContextType = {
  homeData: INITIAL_HOME_DATA,
  posts: POSTS,
  projects: INITIAL_PROJECTS,
  talks: INITIAL_TALKS,
  media: INITIAL_MEDIA,
  photos: INITIAL_PHOTOS,
  useSections: INITIAL_USE_SECTIONS,
};

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

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <DataContext.Provider value={siteData}>
      <Router>
        <div
          className={`min-h-screen transition-colors duration-300 ${
            isDark ? "dark" : "light"
          } relative flex flex-col`}
        >
          <TreeBackground />
          <Navbar isDark={isDark} toggleTheme={toggleTheme} />

          <div className="max-w-3xl mx-auto px-6 pb-12 md:pb-24 w-full relative z-10 flex-grow">
            <main className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                <Route path="*" element={<NotFound />} />
              </Routes>
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