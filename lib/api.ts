// apps/web/lib/api.ts - Updated client to call Commerce backend instead of Strapi directly

const COMMERCE_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Fetch from Commerce Backend (which handles CMS + Commerce)
 */
export async function fetchAPI<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${COMMERCE_API}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 60 }, // ISR - revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error(`API error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API fetch error:', error);
    return null;
  }
}

/**
 * ========== CMS Endpoints (via Commerce Backend) ==========
 */

export async function getPages() {
  return fetchAPI('/cms/pages');
}

export async function getPageBySlug(slug: string) {
  return fetchAPI(`/cms/pages/${slug}`);
}

export async function getBlogPosts() {
  return fetchAPI('/cms/blog');
}

export async function getBlogPostBySlug(slug: string) {
  return fetchAPI(`/cms/blog/${slug}`);
}

export async function getSiteSettings() {
  return fetchAPI('/cms/settings');
}

/**
 * ========== Commerce Endpoints ==========
 */

export async function getProducts() {
  return fetchAPI('/products');
}

export async function getProductById(id: number) {
  return fetchAPI(`/products/${id}`);
}

export async function getUserCart(userId: number) {
  return fetchAPI(`/cart/${userId}`);
}

export async function getUserOrders(userId: number) {
  return fetchAPI(`/orders/${userId}`);
}
