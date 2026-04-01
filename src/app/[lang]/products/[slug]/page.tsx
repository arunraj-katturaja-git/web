import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { FaqList } from "@/components/faq-list";
import { isSupportedLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/messages";
import { getMediaSrc, isRemoteMediaUrl } from "@/lib/media";
import { getProductByIdentifier } from "@/lib/strapi/products";
import { getFaqsContent } from "@/lib/strapi/site-content";

interface ProductDetailPageProps {
  readonly params: Promise<{
    lang: string;
    slug: string;
  }>;
}

export default async function ProductDetailPage({ params }: Readonly<ProductDetailPageProps>) {
  const { lang, slug } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  const dictionary = getDictionary(lang);
  const [product, faqs] = await Promise.all([
    getProductByIdentifier(lang, slug),
    getFaqsContent(lang, "product"),
  ]);

  if (!product) {
    notFound();
  }

  const imageSrc = getMediaSrc(product.imageUrl);
  const isRemoteImage = isRemoteMediaUrl(product.imageUrl);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Link
        className="inline-flex w-fit items-center rounded-full border border-primary/20 px-4 py-2 text-sm font-semibold text-primary-strong transition hover:border-primary hover:bg-primary hover:text-white"
        href={`/${lang}/products`}
      >
        {dictionary.products.detailBack}
      </Link>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-gradient-to-br from-primary/10 via-white to-accent/10">
          <div className="relative aspect-[4/3]">
            {imageSrc ? (
              <Image
                alt={product.name}
                className="object-cover"
                fill
                priority
                src={imageSrc}
                unoptimized={isRemoteImage}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-muted">{product.name}</div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-[2rem] border border-primary/15 bg-card/80 p-6 shadow-[0_10px_30px_rgba(15,35,24,0.06)] sm:p-8">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-strong">
              {product.inStock ? dictionary.common.inStock : dictionary.common.outOfStock}
            </p>
            <h1 className="text-3xl text-ink sm:text-4xl">{product.name}</h1>
            <p className="text-base leading-relaxed text-muted">{product.description}</p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-surface/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
              {dictionary.common.startingAt}
            </p>
            <p className="mt-1 text-3xl font-bold text-primary">Rs {product.startingPrice.toFixed(0)}</p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-ink">{dictionary.products.detailVariantsTitle}</h2>
            {product.variants.length > 0 ? (
              <div className="space-y-3">
                {product.variants.map((variant) => {
                  const variantInStock = variant.stockQuantity > 0;

                  return (
                    <div
                      className="flex items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-white/80 px-4 py-3"
                      key={variant.id}
                    >
                      <div>
                        <p className="text-base font-semibold text-ink">{variant.label}</p>
                        <p className={`text-sm ${variantInStock ? "text-emerald-700" : "text-rose-700"}`}>
                          {variantInStock ? dictionary.common.inStock : dictionary.common.outOfStock}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-primary">Rs {variant.price.toFixed(0)}</p>
                        {variant.compareAtPrice ? (
                          <p className="text-xs text-muted line-through">
                            {dictionary.common.compareAt} Rs {variant.compareAtPrice.toFixed(0)}
                          </p>
                        ) : null}
                        <div className="mt-3">
                          <AddToCartButton
                            dictionary={dictionary}
                            disabled={!variantInStock}
                            productId={product.id}
                            variantId={variant.id}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted">{dictionary.common.noVariants}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-primary/15 bg-card/70 p-6 shadow-[0_10px_30px_rgba(15,35,24,0.06)] sm:p-8">
        <div className="space-y-3">
          <h2 className="text-2xl text-ink sm:text-3xl">{dictionary.products.detailAboutTitle}</h2>
          <div
            className="prose prose-sm max-w-none text-muted prose-p:my-3 prose-strong:text-ink sm:prose-base"
            dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}
          />
        </div>
      </section>

      <FaqList dictionary={dictionary} faqs={faqs} />
    </div>
  );
}
