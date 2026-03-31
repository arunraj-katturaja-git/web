import type { AppLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/messages";
import { fetchBackend } from "@/lib/strapi/client";

export interface SiteSettingsContent {
  siteName?: string;
  tagline?: string;
  supportPhone?: string;
  mobile?: string;
  addressLines?: string[];
  footerNote?: string;
  logoUrl?: string;
}

export interface HomePageStaticContent {
  home: Partial<Dictionary["home"]>;
  qualityPoints?: string[];
  storyboardTitle?: string;
  storyboardSubtitle?: string;
  heroBannerImageUrl?: string;
  featuredBackgroundImageUrl?: string;
  supportBackgroundImageUrl?: string;
}

export interface BannerContent {
  id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl?: string;
  sortOrder: number;
}

export interface FaqContent {
  id: string;
  question: string;
  answer: string;
  topic: string;
  sortOrder: number;
}

export async function getSiteSettingsContent(locale: AppLocale): Promise<SiteSettingsContent | null> {
  try {
    const response = await fetchBackend<SiteSettingsContent | null>(
      `/cms/site-settings?locale=${locale}`,
      { revalidate: 120 },
    );
    return response.data ?? null;
  } catch {
    return null;
  }
}

export async function getHomePageStaticContent(
  locale: AppLocale,
): Promise<HomePageStaticContent | null> {
  try {
    const response = await fetchBackend<HomePageStaticContent | null>(
      `/cms/home-page?locale=${locale}`,
      { revalidate: 120 },
    );
    return response.data ?? null;
  } catch {
    return null;
  }
}

export async function getBannersContent(locale: AppLocale): Promise<BannerContent[]> {
  try {
    const response = await fetchBackend<BannerContent[]>(
      `/cms/banners?locale=${locale}`,
      { revalidate: 120 },
    );
    return response.data ?? [];
  } catch {
    return [];
  }
}

export async function getFaqsContent(locale: AppLocale, topic?: string): Promise<FaqContent[]> {
  try {
    const params = new URLSearchParams({ locale });
    if (topic) {
      params.set("topic", topic);
    }

    const response = await fetchBackend<FaqContent[]>(
      `/cms/faqs?${params.toString()}`,
      { revalidate: 120 },
    );
    return response.data ?? [];
  } catch {
    return [];
  }
}
