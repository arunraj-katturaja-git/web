// lib/strapi.ts - Strapi API Client

const STRAPI_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T[];
  meta?: {
    pagination: {
      page: number;
      pageSize: number;
      total: number;
    };
  };
}

/**
 * Fetch data from Strapi API
 */
export async function fetchStrapi<T>(
  path: string,
  options: RequestInit = {}
): Promise<StrapiResponse<T>> {
  const url = `${STRAPI_URL}/api${path.startsWith('/') ? path : '/' + path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
      next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Strapi fetch error:', error);
    throw error;
  }
}

/**
 * Get all pages
 */
export async function getPages() {
  return fetchStrapi('pages?sort=createdAt:desc');
}

/**
 * Get page by slug
 */
export async function getPageBySlug(slug: string) {
  const data = await fetchStrapi(`pages?filters[slug][$eq]=${slug}`);
  return data.data[0] || null;
}

/**
 * Get all blog posts
 */
export async function getBlogPosts() {
  return fetchStrapi('blog-posts?filters[published][$eq]=true&sort=publishedAt:desc');
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  const data = await fetchStrapi(`blog-posts?filters[slug][$eq]=${slug}`);
  return data.data[0] || null;
}

/**
 * Get all products from CMS
 */
export async function getProducts() {
  return fetchStrapi('products?sort=createdAt:desc');
}

/**
 * Get site settings
 */
export async function getSettings() {
  const data = await fetchStrapi('settings');
  return data.data[0] || null;
}

/**
 * Get menu items
 */
export async function getMenuItems() {
  return fetchStrapi('menus');
}
