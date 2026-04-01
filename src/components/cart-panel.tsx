"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import type { Dictionary } from "@/lib/i18n/messages";
import { getMediaSrc, isRemoteMediaUrl } from "@/lib/media";

interface CartPanelProps {
  readonly dictionary: Dictionary;
  readonly locale: string;
}

export function CartPanel({ dictionary, locale }: Readonly<CartPanelProps>) {
  const { cart, initialized, updateQuantity, removeItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [busyItemId, setBusyItemId] = useState<string | null>(null);

  async function handleQuantity(itemId: string, quantity: number) {
    setBusyItemId(itemId);

    try {
      await updateQuantity(itemId, quantity);
    } finally {
      setBusyItemId(null);
    }
  }

  async function handleRemove(itemId: string) {
    setBusyItemId(itemId);

    try {
      await removeItem(itemId);
    } finally {
      setBusyItemId(null);
    }
  }

  return (
    <div className="relative">
      <button
        className="relative rounded-full border border-primary/30 bg-white px-4 py-2 text-sm font-semibold text-primary-strong shadow-sm transition hover:border-primary hover:bg-surface"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {dictionary.cart.viewCart}
        <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
          {initialized ? cart.totalQuantity : 0}
        </span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-40 mt-3 w-[22rem] rounded-3xl border border-primary/15 bg-white p-5 shadow-2xl sm:w-[26rem]">
          <div className="flex items-center justify-between gap-4 border-b border-primary/10 pb-4">
            <div>
              <p className="text-lg font-semibold text-ink">{dictionary.cart.title}</p>
              <p className="text-sm text-muted">
                {cart.totalQuantity} {dictionary.cart.itemCount}
              </p>
            </div>
            <p className="text-sm font-semibold text-primary">
              {dictionary.cart.subtotal} Rs {cart.subtotal.toFixed(0)}
            </p>
          </div>

          {cart.items.length === 0 ? (
            <p className="py-8 text-sm text-muted">{dictionary.cart.empty}</p>
          ) : (
            <div className="space-y-4 py-4">
              <div className="max-h-[24rem] space-y-4 overflow-y-auto">
                {cart.items.map((item) => {
                  const imageSrc = getMediaSrc(item.imageUrl);
                  const isRemoteImage = isRemoteMediaUrl(item.imageUrl);
                  const isAtMaxStock = item.stockQuantity > 0 && item.quantity >= item.stockQuantity;

                  return (
                    <div className="flex gap-3 rounded-2xl border border-primary/10 bg-surface/70 p-3" key={item.id}>
                      <Link
                        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-primary/10 bg-white"
                        href={`/${locale}/products/${item.productSlug}`}
                        onClick={() => setIsOpen(false)}
                      >
                        {imageSrc ? (
                          <Image
                            alt={item.productName}
                            className="object-cover"
                            fill
                            sizes="80px"
                            src={imageSrc}
                            unoptimized={isRemoteImage}
                          />
                        ) : null}
                      </Link>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div>
                          <Link
                            className="line-clamp-1 text-sm font-semibold text-ink hover:text-primary"
                            href={`/${locale}/products/${item.productSlug}`}
                            onClick={() => setIsOpen(false)}
                          >
                            {item.productName}
                          </Link>
                          <p className="text-xs text-muted">{item.variantLabel}</p>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white px-2 py-1">
                              <button
                                className="h-7 w-7 rounded-full text-sm font-bold text-primary hover:bg-surface disabled:opacity-50"
                                disabled={busyItemId === item.id || item.quantity <= 1}
                                onClick={() => void handleQuantity(item.id, item.quantity - 1)}
                                type="button"
                              >
                                -
                              </button>
                              <span className="min-w-6 text-center text-sm font-semibold text-ink">{item.quantity}</span>
                              <button
                                className="h-7 w-7 rounded-full text-sm font-bold text-primary hover:bg-surface disabled:opacity-50"
                                disabled={busyItemId === item.id || isAtMaxStock}
                                onClick={() => void handleQuantity(item.id, item.quantity + 1)}
                                type="button"
                              >
                                +
                              </button>
                            </div>
                            {isAtMaxStock ? (
                              <p className="text-xs font-medium text-amber-700">
                                {dictionary.cart.maxStockReached}
                              </p>
                            ) : item.stockQuantity > 0 ? (
                              <p className="text-xs text-muted">
                                {dictionary.cart.onlyLeft} {item.stockQuantity}
                              </p>
                            ) : null}
                          </div>

                          <div className="space-y-2 text-right">
                            <p className="text-sm font-semibold text-primary">Rs {item.lineTotal.toFixed(0)}</p>
                            <button
                              aria-label={dictionary.cart.remove}
                              className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={busyItemId === item.id}
                              onClick={() => void handleRemove(item.id)}
                              type="button"
                            >
                              <svg
                                aria-hidden="true"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12M10 11v5m4-5v5"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.8"
                                />
                              </svg>
                              <span className="sr-only">{dictionary.cart.remove}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
                href={`/${locale}/checkout`}
                onClick={() => setIsOpen(false)}
              >
                {dictionary.cart.checkout}
              </Link>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
