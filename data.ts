import {
  Project,
  Post,
  Talk,
  MediaItem,
  HomeData,
  Photo,
  ToolSection,
} from "./types";

export const INITIAL_HOME_DATA: HomeData = {
  name: "Abdiel John Wilson",
  bioTitle:
    "Hey there. I’m Abdiel,  an open source aficionado and a software engineer",
  affiliations: [
    { id: "1", label: "RkyConsults", href: "https://nuxtlabs.com" },
    // { id: "2", label: "Vercel", href: "https://vercel.com" },
  ],
  coreTeam: [
    { id: "1", label: "Softsuite Academy", href: "#" },
    { id: "2", label: "Notion Uniuyo", href: "#" },
    // { id: "3", label: "Vite", href: "#" },
  ],
  creatorOf: [
    // { id: "1", label: "Shiki", href: "#" },
    // { id: "2", label: "Twoslash", href: "#" },
    {
      id: "3",
      label: "laravel-stubber",
      href: "https://packagist.org/packages/wilsn/laravel-stubber",
    },
  ],
  createdProjects: [
    {
      id: "1",
      label: "laravel-stubber",
      href: "https://packagist.org/packages/wilsn/laravel-stubber",
    },
    // { id: "2", label: "Slidev", href: "https://sli.dev" },
    // { id: "3", label: "VueUse", href: "https://vueuse.org" },
    // { id: "4", label: "UnoCSS", href: "https://unocss.dev" },
    // { id: "5", label: "Elk", href: "https://elk.zone" },
  ],
  experiences: [
    {
      id: "1",
      role: "Backend Developer",
      company: "HiTechSecurity",
      href: "#",
      location: "Uyo, Nigeria (Contract)",
      period: "May 2025 – June 2025",
      description:
        "Engineered a security alert system using Laravel and built a Node.js WebSocket server for real-time communication between mobile apps and IoT security devices.",
    },
    {
      id: "2",
      role: "Junior Full-Stack Developer",
      company: "Medinfocard (iCardServices)",
      href: "https://medinfocard.org/",
      location: "Uyo, Nigeria (Part-time)",
      period: "February 2025 – May 2025",
      description:
        "Developed a patient information management system using Vue.js and Laravel. Introduced unit and feature tests to legacy codebase and refactored components to align with SOLID principles.",
    },
    {
      id: "3",
      role: "Full-stack Developer",
      company: "Nosufer",
      href: "https://nosufer.com/",
      location: "Uyo, Nigeria (Freelance)",
      period: "September 2024 – August 2025",
      description:
        "Developed backend architecture for four applications using Laravel and built frontend interfaces for two applications using Vue.js. Managed VPS deployment and server configuration.",
    },
    {
      id: "4",
      role: "Web Developer",
      company: "AnHourWithAManager",
      href: "https://www.anhourwithamanager.com/",
      location: "Lagos, Nigeria (Contract)",
      period: "October 2024 – December 2024",
      description:
        "Built and integrated new features into a podcast website using PHP, HTML, and Bootstrap. Designed and deployed a no-code landing page for user registration.",
    },
    {
      id: "5",
      role: "Backend Intern",
      company: "HNG Internship",
      href: "#",
      location: "Remote",
      period: "July 2024 – August 2024",
      description:
        "Collaborated in Agile teams to deliver two MVPs. Designed and implemented backend features and RESTful APIs using Laravel with PostgreSQL. Gained experience in system design, CI/CD pipelines, and unit testing.",
    },
    {
      id: "6",
      role: "Academy Lead",
      company: "Softsuite.ng",
      href: "https://softsuite.ng/",
      location: "Uyo, Nigeria",
      period: "January 2025 – Present",
      description:
        "Oversee day-to-day operations of the tech academy. Manage and coordinate a team of tutors. Collaborate with marketing teams to develop promotional strategies and increase enrollment.",
    },
    {
      id: "7",
      role: "Web Developer",
      company: "Softsuite.ng",
      href: "https://softsuite.ng/",
      location: "Uyo, Nigeria (Zero-Hours)",
      period: "July 2022 – Present",
      description:
        "Contributed to client-facing web applications. Trained 26+ students in HTML, CSS, and JavaScript. Mentored 6 interns in Vue.js and Laravel development through real projects and code reviews.",
    },
    {
      id: "8",
      role: "Freelance Developer",
      company: "Self-Employed",
      location: "Remote",
      period: "2016 – Present",
      description:
        "Worked on various freelance web development projects, building websites and web applications for clients across different industries.",
    },
    {
      id: "9",
      role: "Learning & Development",
      company: "Self-Study",
      location: "Nigeria",
      period: "2012 – Present",
      description:
        "Self-taught programming journey, learning web development fundamentals including HTML, CSS, JavaScript, and exploring various programming languages and frameworks.",
    },
  ],

  certifications: [
    // Engineering
    {
      id: "1",
      name: "Responsive Web Design",
      issuer: "FreeCodeCamp",
      date: "Issued 2022",
      description: "Designed and built responsive web projects.",
      credentialLink: "https://www.freecodecamp.org/certification/wilsonabdiel/responsive-web-design",
      stack: "engineering",
    },
    {
      id: "2",
      name: "Introduction to Computer Science",
      issuer: "HarvardX",
      date: "Issued 2022",
      description: "Foundational computer science principles and programming.",
      credentialLink: "https://certificates.cs50.io/6f25f207-48b3-4a06-844c-91eb20e30053.pdf?size=letter",
      stack: "engineering",
    },
    {
      id: "3",
      name: "HNG Finalist Certificate",
      issuer: "HNG Internship",
      date: "Issued 2024",
      description: "Completed intensive software engineering internship program.",
      credentialLink: "https://certgo.app/c-230b1235",
      stack: "engineering",
    },
    {
      id: "4",
      name: "HNG Certificate of Proficiency in Backend Development",
      issuer: "HNG Internship",
      date: "Issued 2024",
      description: "Demonstrated proficiency in backend development with Laravel and PostgreSQL.",
      credentialLink: "https://certgo.app/c-1c98a45e",
      stack: "engineering",
    },
  ],
};

export const INITIAL_PROJECTS: Project[] = [
  
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "why-i-moved-to-tokyo",
    slug: "why-i-moved-to-tokyo",
    title: "Why I moved to Tokyo",
    date: "Oct 12, 2024",
    duration: "12 min",
    categories: ["life", "travel"],
    content:
      "# Moving to Tokyo\n\nMoving to Tokyo was one of the biggest decisions of my life. The energy here is different. \n\n### The Vibe\nIt's a blend of **high-tech efficiency** and deep-rooted traditions. Every street corner has a story to tell, and every neighborhood feels like a different world.\n\n- Exploring local coffee shops\n- Vibrant tech community\n- Quiet parks and shrines\n\nThere's something inspiring about working in a city that never stops moving, yet respects the silence of its parks.",
  },
  {
    id: "reimagining-atomic-css",
    slug: "reimagining-atomic-css",
    title: "Reimagining Atomic CSS",
    date: "Aug 24, 2024",
    duration: "25 min",
    categories: ["tech", "css", "tooling"],
    content:
      "# Reimagining Atomic CSS\n\nAtomic CSS has changed how we think about styling. With **UnoCSS**, we're taking it to the next level.\n\n> Performance is key.\n\nBy generating styles on-demand, we can reduce the size of our CSS bundles significantly. But it's not just about size; it's about the developer experience. Having the full power of CSS at your fingertips without the overhead of creatorOf huge stylesheets is a game changer.\n\n```css\n.u-btn {\n  @apply px-4 py-2 bg-blue-500 text-white rounded;\n}\n```",
  },
];

export const INITIAL_TALKS: Talk[] = [
  {
    id: "1",
    title: "Data Made Simple: Notion Database for Non-Techies",
    event: "Notion Uniuyo workshops 2024",
    date: "April 8th, 2025",
    link: "#",
    location: "Google Meet",
  },
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: "1",
    title: "Exploring the future of Vue with Abdiel John Wilson",
    link: "#",
    type: "podcast",
  },
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
    caption: "Tokyo Streets",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1590254350314-e6962f27521a?auto=format&fit=crop&q=80&w=800",
    caption: "Osaka After Rain",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800",
    caption: "Workspace V2",
  },
];

export const INITIAL_USE_SECTIONS: ToolSection[] = [
  {
    id: "1",
    title: "Environment",
    items: [
      "Editor: VS Code",
      "Theme: Vitesse",
      "Font: Iosevka Abdiel",
      "Terminal: Warp",
    ],
  },
  {
    id: "2",
    title: "Hardware",
    items: [
      'MacBook Pro 14" M3 Max',
      "HHKB Professional HYBRID Type-S",
      "Logitech MX Master 3S",
    ],
  },
];
