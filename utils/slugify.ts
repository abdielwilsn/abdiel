/**
 * Generate a URL-friendly slug from a title
 * @param title - The title to convert to a slug
 * @returns A URL-friendly slug
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get the slug for a post, either from the slug field or generate from title
 * @param post - The post object
 * @returns The slug to use for the post
 */
export function getPostSlug(post: { slug?: string; title: string; id: string }): string {
  return post.slug || slugify(post.title) || post.id;
}
