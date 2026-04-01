"use client";

import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import type { Dictionary } from "@/lib/i18n/messages";

interface AddToCartButtonProps {
  readonly dictionary: Dictionary;
  readonly productId: string;
  readonly variantId?: string;
  readonly disabled?: boolean;
  readonly quantity?: number;
  readonly className?: string;
}

export function AddToCartButton({
  dictionary,
  productId,
  variantId,
  disabled = false,
  quantity = 1,
  className,
}: Readonly<AddToCartButtonProps>) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  async function handleAddToCart() {
    if (!variantId || disabled) {
      return;
    }

    setIsAdding(true);
    setStatusText(null);

    try {
      await addItem(productId, variantId, quantity);
      setStatusText(dictionary.cart.added);
      window.setTimeout(() => setStatusText(null), 1800);
    } catch (error) {
      setStatusText(error instanceof Error ? error.message : "Unable to add item.");
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <button
      className={
        className ??
        "inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
      }
      disabled={disabled || !variantId || isAdding}
      onClick={() => void handleAddToCart()}
      type="button"
    >
      {isAdding ? dictionary.auth.loading : statusText ?? dictionary.cart.add}
    </button>
  );
}
