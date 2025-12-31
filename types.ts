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
  slug?: string; // URL-friendly slug derived from title
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
  type: "video" | "podcast" | "article";
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

export interface Experience {
  id: string;
  role: string;
  company: string;
  href?: string; // optional: company/website link
  location?: string; // optional: city/remote
  period: string; // e.g. "2023 – Present"
  description?: string; // optional short description
}

export interface Certification {
  id: string;
  name: string; // e.g. "AWS Certified Solutions Architect"
  issuer: string; // e.g. "Amazon Web Services"
  issuerHref?: string; // optional link to issuer site
  date: string; // e.g. "Issued Jun 2023"
  credentialId?: string; // optional: e.g. "ABC123XYZ"
  credentialLink?: string; // optional: link to verify (e.g. Credly, LinkedIn)
  logo?: string; // optional: URL to issuer logo (for nicer visuals)
  description: string;
  stack:
    | "cloud"
    | "devops"
    | "security"
    | "engineering"
    | "data"
    | "programming"
    | "database"; // New field
}

export interface HomeData {
  name: string;
  bioTitle: string;
  affiliations: BadgeItem[];
  coreTeam: BadgeItem[];
  creatorOf: BadgeItem[];
  createdProjects: BadgeItem[];
  experiences: Experience[];
  certifications: Certification[];
}
