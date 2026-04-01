import Image from "next/image";
import Link from "next/link";
import { AuthPanel } from "@/components/auth-panel";
import { CartPanel } from "@/components/cart-panel";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { AppLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/messages";
import { getMediaSrc, isRemoteMediaUrl } from "@/lib/media";

interface SiteHeaderProps {
  readonly locale: AppLocale;
  readonly dictionary: Dictionary;
  readonly siteName?: string;
  readonly tagline?: string;
  readonly supportPhone?: string;
  readonly logoUrl?: string;
}

export function SiteHeader({
  locale,
  dictionary,
  siteName,
  tagline,
  supportPhone,
  logoUrl,
}: Readonly<SiteHeaderProps>) {
  const primaryPhone = supportPhone?.trim();
  const phoneHref = primaryPhone
    ? primaryPhone.startsWith("+")
      ? primaryPhone
      : `+91${primaryPhone}`
    : null;
  const logoSrc = getMediaSrc(logoUrl);
  const isRemoteLogo = isRemoteMediaUrl(logoUrl);
  const resolvedSiteName = siteName?.trim() || dictionary.siteName;
  const resolvedTagline = tagline?.trim() || dictionary.tagline;

  return (
    <header className="sticky top-0 z-30 border-b border-primary/15 bg-surface/75 backdrop-blur-xl supports-[backdrop-filter]:bg-surface/55">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="group flex items-center gap-4" href={`/${locale}`}>
          {logoSrc ? (
            <Image
              alt={`${resolvedSiteName} logo`}
              className="h-16 w-16 object-contain transition group-hover:scale-105 sm:h-20 sm:w-20"
              height={80}
              sizes="(max-width: 640px) 64px, 80px"
              src={logoSrc}
              unoptimized={isRemoteLogo}
              width={80}
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-white text-lg font-semibold text-primary-strong sm:h-20 sm:w-20 sm:text-xl">
              {resolvedSiteName.charAt(0)}
            </div>
          )}
          <div className="hidden sm:block">
            <p className="text-lg font-bold leading-tight text-ink">{resolvedSiteName}</p>
            <p className="text-sm text-muted">{resolvedTagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
          <Link className="text-muted transition-colors duration-200 hover:text-primary" href={`/${locale}`}>
            {dictionary.navigation.home}
          </Link>
          <Link className="text-muted transition-colors duration-200 hover:text-primary" href={`/${locale}/products`}>
            {dictionary.navigation.products}
          </Link>
          {phoneHref ? (
            <a
              className="rounded-full border border-primary/35 bg-white px-5 py-2 font-semibold text-primary-strong transition-all hover:scale-105 hover:bg-primary hover:text-white"
              href={`tel:${phoneHref}`}
            >
              {dictionary.navigation.support}
            </a>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <CartPanel dictionary={dictionary} locale={locale} />
          <AuthPanel dictionary={dictionary} />
          <LanguageSwitcher currentLocale={locale} dictionary={dictionary} />
        </div>
      </div>
    </header>
  );
}
