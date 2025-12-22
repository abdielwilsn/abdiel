import { supabase } from "./supabase";
import {
  INITIAL_HOME_DATA,
  INITIAL_POSTS,
  INITIAL_PROJECTS,
  INITIAL_TALKS,
  INITIAL_MEDIA,
  INITIAL_PHOTOS,
  INITIAL_USE_SECTIONS,
} from "../data";

const CACHE_KEY = "ajw_portfolio_cache_v1";
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

interface CachedData {
  timestamp: number;
  data: any;
}

export const DataService = {
  /**
   * Helper to get data with Stale-While-Revalidate pattern
   */
  async getAllData(forceRefresh = false) {
    const cached = this.getCache();

    // If we have cache and it's not a force refresh, return it immediately
    // but still trigger a background fetch to update the cache for next time.
    if (cached && !forceRefresh) {
      // Trigger background update silently
      this.fetchAndCache();
      return cached.data;
    }

    return this.fetchAndCache();
  },

  async fetchAndCache() {
    try {
      const [
        homeRes,
        postsRes,
        projectsRes,
        talksRes,
        mediaRes,
        photosRes,
        toolsRes,
      ] = await Promise.all([
        supabase.from("site_config").select("*").limit(1).single(),
        supabase
          .from("posts")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase.from("talks").select("*").order("date", { ascending: false }),
        supabase.from("media").select("*"),
        supabase.from("photos").select("*"),
        supabase.from("tool_sections").select("*"),
      ]);

      const formattedData = {
        homeData: homeRes.data
          ? {
              name: homeRes.data.name,
              bioTitle: homeRes.data.bio_title,
              affiliations: homeRes.data.affiliations || [],
              coreTeam: homeRes.data.core_team || [],
              creatorOf: homeRes.data.creatorOf || [],
              createdProjects: homeRes.data.created_projects || [],
            }
          : INITIAL_HOME_DATA,
        posts:
          postsRes.data && postsRes.data.length > 0
            ? postsRes.data
            : INITIAL_POSTS,
        projects:
          projectsRes.data && projectsRes.data.length > 0
            ? projectsRes.data
            : INITIAL_PROJECTS,
        talks:
          talksRes.data && talksRes.data.length > 0
            ? talksRes.data
            : INITIAL_TALKS,
        media:
          mediaRes.data && mediaRes.data.length > 0
            ? mediaRes.data
            : INITIAL_MEDIA,
        photos:
          photosRes.data && photosRes.data.length > 0
            ? photosRes.data
            : INITIAL_PHOTOS,
        useSections:
          toolsRes.data && toolsRes.data.length > 0
            ? toolsRes.data
            : INITIAL_USE_SECTIONS,
      };

      this.setCache(formattedData);
      return formattedData;
    } catch (error) {
      console.error("DataService Fetch Error:", error);
      // Fallback to cache or initial defaults if everything fails
      const cached = this.getCache();
      return cached
        ? cached.data
        : {
            homeData: INITIAL_HOME_DATA,
            posts: INITIAL_POSTS,
            projects: INITIAL_PROJECTS,
            talks: INITIAL_TALKS,
            media: INITIAL_MEDIA,
            photos: INITIAL_PHOTOS,
            useSections: INITIAL_USE_SECTIONS,
          };
    }
  },

  getCache(): CachedData | null {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp > CACHE_TTL) return null;
      return parsed;
    } catch (e) {
      return null;
    }
  },

  setCache(data: any) {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  },

  invalidateCache() {
    localStorage.removeItem(CACHE_KEY);
  },
};
