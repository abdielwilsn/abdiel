import { Post } from "../types";

// Every markdown file in content/posts is one blog post; the filename is its slug.
const files = import.meta.glob<string>("../content/posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parsePost(path: string, raw: string): Post {
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  const match = raw.match(FRONTMATTER);

  const meta: Record<string, string> = {};
  for (const line of (match ? match[1] : "").split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator > 0) {
      const value = line.slice(separator + 1).trim();
      meta[line.slice(0, separator).trim()] = value.replace(/^(["'])(.*)\1$/, "$2");
    }
  }

  return {
    id: meta.id || slug,
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    duration: meta.duration || "",
    categories: (meta.categories || "")
      .split(",")
      .map((category) => category.trim())
      .filter(Boolean),
    content: (match ? match[2] : raw).trim(),
  };
}

const timestamp = (post: Post) => Date.parse(post.date) || 0;

// Newest first
export const POSTS: Post[] = Object.entries(files)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => timestamp(b) - timestamp(a));
