import type { AppLocale } from "@/lib/i18n/config";
import { fetchBackend } from "@/lib/strapi/client";
import type { ProductCardModel } from "@/types/product";

async function fetchProducts(limit: number, locale: AppLocale, featured = false): Promise<ProductCardModel[]> {
  try {
    const params = new URLSearchParams({
      locale,
      limit: String(limit),
    });

    if (featured) {
      params.set("featured", "true");
    }

    const response = await fetchBackend<ProductCardModel[]>(`/products?${params.toString()}`);
    return response.data ?? [];
  } catch {
    return [];
  }
}

export function getFeaturedProducts(locale: AppLocale): Promise<ProductCardModel[]> {
  return fetchProducts(6, locale, true);
}

export function getAllProducts(locale: AppLocale): Promise<ProductCardModel[]> {
  return fetchProducts(24, locale);
}

export async function getProductByIdentifier(
  locale: AppLocale,
  identifier: string,
): Promise<ProductCardModel | null> {
  try {
    const response = await fetchBackend<ProductCardModel | null>(`/products/${identifier}?locale=${locale}`);
    return response.data ?? null;
  } catch {
    return null;
  }
}
