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
      role: "Software Engineer",
      company: "RkyConsults",
      href: "https://rkyconsults.com",
      location: "Remote / Nigeria",
      period: "2023 – Present",
      description:
        "Full-stack development, open-source tooling, and mentoring.",
    },
    {
      id: "2",
      role: "Software Engineer & Academy Lead",
      company: "Softsuite Solutions",
      href: "https://softsuite.com",
      location: "Uyo, Nigeria",
      period: "2021 – 2025",
      description:
        "Built modern web applications with Vue.js, Nuxt, Nextjs, Laravel and Django.",
    },
    {
      id: "3",
      role: "Web Developer",
      company: "Freelance",
      period: "2019 – 2021",
    },
  ],

  certifications: [
    // Cloud
    {
      id: "1",
      name: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "Issued Sep 2023",
      description:
        "Built and deployed serverless applications using AWS best practices.",
      credentialLink: "https://www.credly.com/badges/aws-dev",
      stack: "cloud",
    },
    {
      id: "2",
      name: "Google Professional Cloud Architect",
      issuer: "Google Cloud",
      date: "Issued Mar 2024",
      description:
        "Architected dynamic, secure solutions on Google Cloud Platform.",
      credentialLink: "https://www.credly.com/badges/gcp-architect",
      stack: "cloud",
    },
    {
      id: "3",
      name: "Microsoft Certified: Azure Fundamentals",
      issuer: "Microsoft",
      date: "Issued Oct 2022",
      description:
        "Cloud fundamentals and Azure services architecture knowledge.",
      stack: "cloud",
    },

    // DevOps
    {
      id: "4",
      name: "Certified Kubernetes Administrator (CKA)",
      issuer: "Cloud Native Computing Foundation",
      date: "Issued Nov 2023",
      description:
        "Deployed, managed, and troubleshot production Kubernetes clusters.",
      credentialLink: "https://www.credly.com/badges/cka",
      stack: "devops",
    },
    {
      id: "5",
      name: "Terraform Associate",
      issuer: "HashiCorp",
      date: "Issued Apr 2024",
      description:
        "Infrastructure as Code expert using Terraform across multi-cloud.",
      credentialLink: "https://www.credly.com/badges/terraform",
      stack: "devops",
    },
    {
      id: "6",
      name: "Docker Certified Associate",
      issuer: "Docker",
      date: "Issued Jan 2023",
      description:
        "Containerization expert across Docker ecosystem and orchestration.",
      stack: "devops",
    },

    // Security
    {
      id: "7",
      name: "CompTIA Security+",
      issuer: "CompTIA",
      date: "Issued Dec 2021",
      description:
        "Foundational cybersecurity knowledge and risk management best practices.",
      credentialLink: "https://www.credly.com/badges/security-plus",
      stack: "security",
    },
    {
      id: "8",
      name: "Certified Ethical Hacker (CEH)",
      issuer: "EC-Council",
      date: "Issued May 2023",
      description:
        "Penetration testing and vulnerability assessment expertise.",
      stack: "security",
    },

    // Engineering
    {
      id: "9",
      name: "Legacy Responsive Web Design",
      issuer: "FreeCodeCamp",
      date: "Issued Sep 2022",
      description: "Designed and built web projects.",
      credentialLink:
        "https://www.freecodecamp.org/certification/wilsonabdiel/responsive-web-design",
      stack: "engineering",
    },
    {
      id: "10",
      name: "JavaScript Algorithms and Data Structures",
      issuer: "FreeCodeCamp",
      date: "Issued Jan 2023",
      description: "Mastered algorithms and data structures in JavaScript.",
      stack: "engineering",
    },

    // Data & AI
    {
      id: "11",
      name: "Google Professional Data Engineer",
      issuer: "Google Cloud",
      date: "Issued Jul 2024",
      description:
        "Big data pipelines and ML model deployment on Google Cloud.",
      credentialLink: "https://www.credly.com/badges/gcp-data",
      stack: "data",
    },
    {
      id: "12",
      name: "AWS Certified Machine Learning – Specialty",
      issuer: "Amazon Web Services",
      date: "Issued Aug 2024",
      description: "Machine learning models design and deployment on AWS.",
      stack: "data",
    },
    {
      id: "13",
      name: "TensorFlow Developer Certificate",
      issuer: "Google",
      date: "Issued Jun 2024",
      description: "Deep learning and neural networks with TensorFlow.",
      stack: "data",
    },

    // Programming
    {
      id: "14",
      name: "Oracle Certified Professional: Java SE",
      issuer: "Oracle",
      date: "Issued Mar 2023",
      description: "Advanced Java programming and object-oriented principles.",
      stack: "programming",
    },
    {
      id: "15",
      name: "Python Institute PCEP",
      issuer: "Python Institute",
      date: "Issued Nov 2022",
      description: "Python programming fundamentals and best practices.",
      stack: "programming",
    },

    // Database
    {
      id: "16",
      name: "MongoDB Certified Developer",
      issuer: "MongoDB Inc.",
      date: "Issued Apr 2023",
      description: "NoSQL database design and query optimization.",
      stack: "database",
    },
    {
      id: "17",
      name: "PostgreSQL 14 Associate Certification",
      issuer: "PostgreSQL",
      date: "Issued Feb 2024",
      description: "Relational database management and SQL optimization.",
      stack: "database",
    },
  ],
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Vitest",
    description: "A blazing fast unit test framework powered by Vite.",
    link: "https://vitest.dev",
    github: "vitest-dev/vitest",
  },
  {
    id: "2",
    name: "Slidev",
    description: "Presentation slides for developers.",
    link: "https://sli.dev",
    github: "slidevjs/slidev",
  },
  {
    id: "3",
    name: "VueUse",
    description: "Collection of essential Vue Composition Utilities.",
    link: "https://vueuse.org",
    github: "vueuse/vueuse",
  },
  {
    id: "4",
    name: "UnoCSS",
    description: "Instant on-demand atomic CSS engine.",
    link: "https://unocss.dev",
    github: "unocss/unocss",
  },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: "why-i-moved-to-tokyo",
    title: "Why I moved to Tokyo",
    date: "Oct 12, 2024",
    duration: "12 min",
    categories: ["life", "travel"],
    content:
      "# Moving to Tokyo\n\nMoving to Tokyo was one of the biggest decisions of my life. The energy here is different. \n\n### The Vibe\nIt's a blend of **high-tech efficiency** and deep-rooted traditions. Every street corner has a story to tell, and every neighborhood feels like a different world.\n\n- Exploring local coffee shops\n- Vibrant tech community\n- Quiet parks and shrines\n\nThere's something inspiring about working in a city that never stops moving, yet respects the silence of its parks.",
  },
  {
    id: "reimagining-atomic-css",
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
    title: "The Future of Web Tooling",
    event: "ViteConf 2024",
    date: "Oct 2024",
    link: "#",
    location: "Online",
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
