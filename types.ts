
export interface Project {
  id: string;
  name: string;
  description: string;
  link: string;
  github?: string;
  icon?: string;
}

export interface Post {
  id: string;
  title: string;
  date: string;
  duration: string;
  categories: string[];
  content?: string;
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  link: string;
  location?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  link: string;
  type: 'video' | 'podcast' | 'article';
}

export interface BadgeItem {
  id: string;
  label: string;
  href: string;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
}

export interface ToolSection {
  id: string;
  title: string;
  items: string[];
}

export interface HomeData {
  name: string;
  bioTitle: string;
  affiliations: BadgeItem[];
  coreTeam: BadgeItem[];
  maintaining: BadgeItem[];
  createdProjects: BadgeItem[];
}
