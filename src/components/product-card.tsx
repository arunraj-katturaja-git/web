import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Dictionary } from "@/lib/i18n/messages";
import { getMediaSrc, isRemoteMediaUrl } from "@/lib/media";
import type { ProductCardModel } from "@/types/product";

interface ProductCardProps {
  readonly dictionary: Dictionary;
  readonly locale?: string;
  readonly product: ProductCardModel;
  readonly showVariants?: boolean;
}

const gradients = [
  "from-emerald-200/40 via-lime-100/30 to-white",
  "from-amber-200/40 via-orange-100/30 to-white",
  "from-teal-200/40 via-cyan-100/30 to-white",
  "from-rose-200/30 via-pink-100/30 to-white",
];

function pickGradient(productId: string): string {
  const total = productId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return gradients[total % gradients.length];
}

export function ProductCard({
  dictionary,
  locale,
  product,
  showVariants = true,
}: Readonly<ProductCardProps>) {
  const imageSrc = getMediaSrc(product.imageUrl);
  const isRemoteImage = isRemoteMediaUrl(product.imageUrl);
  const statusText = product.inStock ? dictionary.common.inStock : dictionary.common.outOfStock;
  const statusClass = product.inStock
    ? "border-emerald-600/30 bg-emerald-100/70 text-emerald-900"
    : "border-rose-600/30 bg-rose-100/70 text-rose-900";
  const visibleVariants = product.variants.slice(0, 3);
  const hiddenVariantCount = Math.max(product.variants.length - visibleVariants.length, 0);
  const productHref = locale ? `/${locale}/products/${product.slug}` : undefined;

  return (
    <article className="group overflow-hidden rounded-2xl border border-primary/15 bg-card shadow-[0_10px_30px_rgba(15,35,24,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(15,35,24,0.14)]">
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${pickGradient(product.id)}`}>
        {imageSrc ? (
          <Image
            alt={product.name}
            className="object-cover transition duration-500 group-hover:scale-105"
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            src={imageSrc}
            unoptimized={isRemoteImage}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-muted">
            {product.name}
          </div>
        )}

        <div
          className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${statusClass}`}
        >
          {statusText}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="text-lg font-semibold leading-snug text-ink transition group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{product.description}</p>

        <div className="flex items-end justify-between gap-3 border-b border-primary/10 pb-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">{dictionary.common.startingAt}</p>
            <p className="text-xl font-bold text-primary">Rs {product.startingPrice.toFixed(0)}</p>
          </div>
        </div>

        {showVariants ? (
          visibleVariants.length > 0 ? (
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                {dictionary.common.availablePacks}
              </p>

              {visibleVariants.map((variant) => {
                const variantInStock = variant.stockQuantity > 0;

                return (
                  <div
                    className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-surface/80 px-3 py-3"
                    key={variant.id}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{variant.label}</p>
                      <p className={`text-xs ${variantInStock ? "text-emerald-700" : "text-rose-700"}`}>
                        {variantInStock ? dictionary.common.inStock : dictionary.common.outOfStock}
                      </p>
                    </div>

                    <div className="space-y-2 text-right">
                      <p className="text-sm font-semibold text-primary">Rs {variant.price.toFixed(0)}</p>
                      {variant.compareAtPrice ? (
                        <p className="text-[11px] text-muted line-through">
                          {dictionary.common.compareAt} Rs {variant.compareAtPrice.toFixed(0)}
                        </p>
                      ) : null}
                      <AddToCartButton
                        className="inline-flex items-center justify-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
                        dictionary={dictionary}
                        disabled={!variantInStock}
                        productId={product.id}
                        variantId={variant.id}
                      />
                    </div>
                  </div>
                );
              })}

              {hiddenVariantCount > 0 ? (
                <p className="text-xs text-muted">
                  +{hiddenVariantCount} {dictionary.common.moreVariants}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted">{dictionary.common.noVariants}</p>
          )
        ) : null}

        {productHref ? (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex items-center justify-center rounded-full border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-strong transition hover:border-primary hover:bg-primary hover:text-white"
              href={productHref}
            >
              {dictionary.products.viewDetails}
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
