import { FaqList } from "@/components/faq-list";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { isSupportedLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/messages";
import { getAllProducts } from "@/lib/strapi/products";
import { getFaqsContent } from "@/lib/strapi/site-content";

interface ProductsPageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const dictionary = getDictionary(lang);
  const [products, faqs] = await Promise.all([
    getAllProducts(lang),
    getFaqsContent(lang, "product"),
  ]);
  const bannerImage = products[0]?.imageUrl;
  const previewProducts = products.filter((product) => product.imageUrl).slice(1, 3);
  const isRemoteBannerImage = bannerImage?.startsWith("http://") || bannerImage?.startsWith("https://");

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <section className="fade-up relative overflow-hidden rounded-[2rem] border border-primary/15 p-6 sm:p-8">
        {bannerImage ? (
          <Image alt="Products banner" className="object-cover" fill src={bannerImage} unoptimized={isRemoteBannerImage} />
        ) : null}
        <div className="absolute inset-0 bg-white/86" />
        <div className="absolute -right-16 -top-20 h-40 w-40 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -left-16 -bottom-20 h-40 w-40 rounded-full bg-accent/25 blur-3xl" />

        <div className="relative grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="space-y-3">
            <h1 className="text-3xl text-ink sm:text-4xl">{dictionary.products.title}</h1>
            <p className="max-w-2xl text-sm text-muted sm:text-base">{dictionary.products.subtitle}</p>
          </div>

          {previewProducts.length > 0 ? (
            <div className="hidden gap-3 sm:flex">
              {previewProducts.map((product) => (
                <div className="media-tile relative h-20 w-24" key={product.id}>
                  {product.imageUrl ? (
                    <Image
                      alt={product.name}
                      className="object-cover"
                      fill
                      src={product.imageUrl}
                      unoptimized={product.imageUrl.startsWith("http://") || product.imageUrl.startsWith("https://")}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {products.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-muted">{dictionary.products.empty}</div>
      ) : (
        <section className="fade-up delay-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard dictionary={dictionary} key={product.id} locale={lang} product={product} />
          ))}
        </section>
      )}

      <FaqList dictionary={dictionary} faqs={faqs} />
    </div>
  );
}
