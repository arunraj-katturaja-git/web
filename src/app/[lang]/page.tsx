import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { isSupportedLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/messages";
import { getFeaturedProducts } from "@/lib/strapi/products";
import { getBannersContent, getHomePageStaticContent, getSiteSettingsContent } from "@/lib/strapi/site-content";

interface HomePageProps {
  readonly params: Promise<Readonly<{
    lang: string;
  }>>;
}

export default async function HomePage({ params }: Readonly<HomePageProps>) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const dictionary = getDictionary(lang);
  const [products, banners, homeStatic, siteSettings] = await Promise.all([
    getFeaturedProducts(lang),
    getBannersContent(lang),
    getHomePageStaticContent(lang),
    getSiteSettingsContent(lang),
  ]);

  const primaryBanner = banners[0];

  const home = homeStatic?.home;
  const homeEyebrow = home?.eyebrow?.trim();
  const homeTitle = primaryBanner?.title?.trim() || home?.title?.trim();
  const homeSubtitle = primaryBanner?.subtitle?.trim() || home?.subtitle?.trim();
  const primaryCta = primaryBanner?.ctaText?.trim() || home?.primaryCta?.trim();
  const primaryCtaLink = primaryBanner?.ctaLink?.trim() || `/${lang}/products`;
  const secondaryCta = home?.secondaryCta?.trim();
  const featuredTitle = home?.featuredTitle?.trim();
  const featuredSubtitle = home?.featuredSubtitle?.trim();
  const supportTitle = home?.supportTitle?.trim();
  const supportBody = home?.supportBody?.trim();

  const supportPhone = siteSettings?.supportPhone?.trim();
  const supportPhoneHref = supportPhone
    ? supportPhone.startsWith("+")
      ? supportPhone
      : `+91${supportPhone}`
    : null;

  const qualityPoints = homeStatic?.qualityPoints ?? [];
  const showcaseProducts = products.slice(0, 6);
  const storyboardTitle = homeStatic?.storyboardTitle?.trim();
  const storyboardSubtitle = homeStatic?.storyboardSubtitle?.trim();

  const heroBannerImage = primaryBanner?.imageUrl || homeStatic?.heroBannerImageUrl;
  const featuredBackgroundImage = homeStatic?.featuredBackgroundImageUrl;
  const supportBackgroundImage = homeStatic?.supportBackgroundImageUrl;
  const isRemoteHeroImage = heroBannerImage?.startsWith("http://") || heroBannerImage?.startsWith("https://");
  const isRemoteFeaturedBackground =
    featuredBackgroundImage?.startsWith("http://") || featuredBackgroundImage?.startsWith("https://");
  const isRemoteSupportBackground =
    supportBackgroundImage?.startsWith("http://") || supportBackgroundImage?.startsWith("https://");
  const showHero = Boolean(homeTitle || homeSubtitle || homeEyebrow || heroBannerImage);
  const showStoryboard = showcaseProducts.length > 0;
  const showSupportSection = Boolean(supportTitle || supportBody || supportPhone);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-20 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {showHero ? (
        <section className="relative overflow-hidden rounded-[2.2rem] border border-primary/20 shadow-[0_22px_60px_rgba(15,35,24,0.16)]">
          <div className="relative min-h-[460px] bg-gradient-to-r from-[#143d2d] via-[#205840] to-[#4c7a4a] sm:min-h-[520px]">
            {heroBannerImage ? (
              <Image
                alt="Main banner"
                className="object-cover"
                fill
                priority
                src={heroBannerImage}
                unoptimized={isRemoteHeroImage}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/15" />

            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center justify-start px-5 py-10 sm:px-8 lg:px-10">
              <div className="fade-up mr-auto max-w-3xl space-y-5 rounded-3xl border border-white/25 bg-black/25 p-5 text-left backdrop-blur-md sm:max-w-2xl sm:p-7 lg:ml-0">
                {homeEyebrow ? (
                  <p className="inline-flex rounded-full border border-white/35 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.12em] text-white uppercase">
                    {homeEyebrow}
                  </p>
                ) : null}

                {homeTitle ? <h1 className="text-3xl leading-tight text-white sm:text-5xl">{homeTitle}</h1> : null}
                {homeSubtitle ? (
                  <p className="max-w-2xl text-sm leading-relaxed text-white/90 sm:text-lg">{homeSubtitle}</p>
                ) : null}

                {primaryCta || secondaryCta ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {primaryCta ? (
                      <Link
                        className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-strong"
                        href={primaryCtaLink}
                      >
                        {primaryCta}
                      </Link>
                    ) : null}
                    {secondaryCta ? (
                      <Link
                        className="rounded-full border border-white/80 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                        href={`/${lang}/products`}
                      >
                        {secondaryCta}
                      </Link>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            {qualityPoints.length > 0 ? (
              <div className="absolute bottom-4 left-4 right-4 hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
                {qualityPoints.map((point) => (
                  <div
                    className="rounded-xl border border-white/25 bg-black/25 px-3 py-2 text-xs text-white/95 backdrop-blur-md"
                    key={point}
                  >
                    {point}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {showStoryboard ? (
        <section className="space-y-6">
          {storyboardTitle || storyboardSubtitle ? (
            <div className="fade-up text-center">
              {storyboardTitle ? <h2 className="text-3xl text-ink sm:text-4xl">{storyboardTitle}</h2> : null}
              {storyboardSubtitle ? <p className="mx-auto mt-3 max-w-2xl text-muted">{storyboardSubtitle}</p> : null}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {showcaseProducts.map((product, idx) => (
              <article
                className="media-tile fade-up relative h-[260px] overflow-hidden bg-gradient-to-br from-primary/15 via-white to-accent/10"
                key={product.id}
              >
                {product.imageUrl ? (
                  <Image
                    alt={product.name}
                    className="object-cover"
                    fill
                    src={product.imageUrl}
                    unoptimized={product.imageUrl.startsWith("http://") || product.imageUrl.startsWith("https://")}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-4 text-white">
                  <p className="text-xs font-semibold tracking-wide text-white/85">0{idx + 1}</p>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-xs text-white/90">{product.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 py-14">
        {featuredBackgroundImage ? (
          <Image
            alt="Featured products background"
            className="object-cover"
            fill
            src={featuredBackgroundImage}
            unoptimized={isRemoteFeaturedBackground}
          />
        ) : null}
        <div className="absolute inset-0 bg-white/88" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              {featuredTitle ? <h2 className="text-3xl text-ink sm:text-4xl">{featuredTitle}</h2> : null}
              {featuredSubtitle ? <p className="mt-2 text-sm text-muted">{featuredSubtitle}</p> : null}
            </div>
            <Link className="text-sm font-semibold text-primary-strong" href={`/${lang}/products`}>
              {dictionary.navigation.products}
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard dictionary={dictionary} key={product.id} locale={lang} product={product} showVariants={false} />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 text-center text-muted">{dictionary.products.empty}</div>
          )}
        </div>
      </section>

      {showSupportSection ? (
        <section className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-gradient-to-r from-primary to-primary-strong p-7 text-white sm:p-10">
          {supportBackgroundImage ? (
            <div className="absolute right-0 top-0 h-full w-[42%] opacity-30">
              <Image
                alt="Support visual"
                className="object-cover"
                fill
                src={supportBackgroundImage}
                unoptimized={isRemoteSupportBackground}
              />
            </div>
          ) : null}
          <div className="relative max-w-2xl space-y-4">
            {supportTitle ? <h3 className="text-3xl">{supportTitle}</h3> : null}
            {supportBody ? <p className="text-sm leading-relaxed text-white/90 sm:text-base">{supportBody}</p> : null}
            {supportPhoneHref || primaryCta ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {supportPhoneHref && supportPhone ? (
                  <a
                    className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary-strong transition hover:bg-white/90"
                    href={`tel:${supportPhoneHref}`}
                  >
                    {supportPhone}
                  </a>
                ) : null}
                {primaryCta ? (
                  <Link
                    className="rounded-full border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                    href={`/${lang}/products`}
                  >
                    {primaryCta}
                  </Link>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}
