import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isSupportedLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/messages";
import { getSiteSettingsContent } from "@/lib/strapi/site-content";

interface LocaleLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{
    lang: string;
  }>;
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LocaleLayout({ children, params }: Readonly<LocaleLayoutProps>) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const dictionary = getDictionary(lang);
  const siteSettings = await getSiteSettingsContent(lang);
  const supportPhone = siteSettings?.supportPhone?.trim();
  const mobile = siteSettings?.mobile?.trim() || supportPhone;
  const supportPhoneHref = supportPhone
    ? supportPhone.startsWith("+")
      ? supportPhone
      : `+91${supportPhone}`
    : null;
  const mobileHref = mobile
    ? mobile.startsWith("+")
      ? mobile
      : `+91${mobile}`
    : null;
  const addressLines = siteSettings?.addressLines ?? [];
  const labels =
    lang === "ta"
      ? {
          quick: "விரைவு இணைப்புகள்",
          support: "ஆதரவு",
          address: "முகவரி",
          about: "எங்களை பற்றி",
          contact: "தொடர்பு",
          faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
          shipping: "டெலிவரி",
          returns: "ரிட்டர்ன்ஸ்",
          privacy: "தனியுரிமை",
          mobile: "மொபைல்",
          call: "அழைக்கவும்",
          rights: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை",
        }
      : {
          quick: "Quick Links",
          support: "Support",
          address: "Address",
          about: "About Us",
          contact: "Contact",
          faq: "FAQ",
          shipping: "Shipping",
          returns: "Returns",
          privacy: "Privacy",
          mobile: "Mobile",
          call: "Call",
          rights: "All rights reserved.",
        };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader
        dictionary={dictionary}
        locale={lang}
        logoUrl={siteSettings?.logoUrl}
        siteName={siteSettings?.siteName}
        supportPhone={supportPhone}
        tagline={siteSettings?.tagline}
      />
      <main className="flex-1">{children}</main>

      <footer className="mt-16 border-t border-primary/15 bg-card/60 backdrop-blur-md">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-ink">{siteSettings?.siteName ?? dictionary.siteName}</h3>
            <p className="text-sm leading-relaxed text-muted">{siteSettings?.tagline ?? dictionary.tagline}</p>
            {supportPhoneHref ? (
              <a
                className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
                href={`tel:${supportPhoneHref}`}
              >
                {labels.call}
              </a>
            ) : null}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-ink">{labels.quick}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link className="transition hover:text-primary" href={`/${lang}`}>
                  {dictionary.navigation.home}
                </Link>
              </li>
              <li>
                <Link className="transition hover:text-primary" href={`/${lang}/products`}>
                  {dictionary.navigation.products}
                </Link>
              </li>
              <li>
                <span>{labels.about}</span>
              </li>
              <li>
                {supportPhoneHref ? (
                  <a className="transition hover:text-primary" href={`tel:${supportPhoneHref}`}>
                    {labels.contact}
                  </a>
                ) : (
                  <span>{labels.contact}</span>
                )}
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-ink">{labels.support}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link className="transition hover:text-primary" href={`/${lang}/products#product-faqs`}>
                  {labels.faq}
                </Link>
              </li>
              <li>{labels.shipping}</li>
              <li>{labels.returns}</li>
              <li>{labels.privacy}</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-ink">{labels.address}</h4>
            <div className="space-y-1 text-sm leading-relaxed text-muted">
              {addressLines.map((line, index) => (
                <p key={`${line}-${index}`}>{line}</p>
              ))}
              {mobile && mobileHref ? (
                <p>
                  {labels.mobile}:{" "}
                  <a className="font-medium text-primary-strong hover:text-primary" href={`tel:${mobileHref}`}>
                    {mobile}
                  </a>
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs text-muted sm:px-6 lg:px-8">
            <p>
              &copy; 2026 {siteSettings?.siteName ?? dictionary.siteName}. {labels.rights}
            </p>
            {siteSettings?.footerNote ? <p>{siteSettings.footerNote}</p> : null}
          </div>
        </div>
      </footer>
    </div>
  );
}
