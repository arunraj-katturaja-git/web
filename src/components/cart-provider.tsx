"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/components/auth-provider";
import type { CartModel } from "@/types/cart";

interface CartContextValue {
  initialized: boolean;
  cart: CartModel;
  refreshCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
}

const emptyCart: CartModel = {
  items: [],
  itemCount: 0,
  totalQuantity: 0,
  subtotal: 0,
  currency: "INR",
};

const CartContext = createContext<CartContextValue | null>(null);

function buildHeaders(sessionToken: string | null, guestToken: string | null): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
    ...(guestToken ? { "X-Guest-Token": guestToken } : {}),
  };
}

async function readCartResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: T; error?: string }
    | null;

  if (!response.ok || !payload?.success || !payload.data) {
    throw new Error(payload?.error ?? `Cart request failed with status ${response.status}`);
  }

  return payload.data;
}

async function fetchCartState(
  locale: string,
  authReady: boolean,
  sessionToken: string | null,
  guestToken: string | null,
): Promise<CartModel> {
  if (!authReady || (!guestToken && !sessionToken)) {
    return emptyCart;
  }

  const response = await fetch(`/api/cart?locale=${locale}`, {
    headers: buildHeaders(sessionToken, guestToken),
    cache: "no-store",
  });

  return readCartResponse<CartModel>(response);
}

export function CartProvider({
  children,
  locale,
}: Readonly<{
  children: ReactNode;
  locale: string;
}>) {
  const { initialized: authReady, guestToken, sessionToken } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [cart, setCart] = useState<CartModel>(emptyCart);

  async function refreshCart() {
    try {
      const nextCart = await fetchCartState(locale, authReady, sessionToken, guestToken);
      setCart(nextCart);
    } catch (error) {
      console.warn("Cart refresh failed, falling back to empty cart.", error);
      setCart(emptyCart);
    } finally {
      setInitialized(true);
    }
  }

  useEffect(() => {
    async function loadCart() {
      try {
        const nextCart = await fetchCartState(locale, authReady, sessionToken, guestToken);
        setCart(nextCart);
      } catch (error) {
        console.warn("Cart refresh failed, falling back to empty cart.", error);
        setCart(emptyCart);
      } finally {
        setInitialized(true);
      }
    }

    void loadCart();
  }, [authReady, guestToken, sessionToken, locale]);

  async function addItem(productId: string, variantId: string, quantity = 1) {
    const response = await fetch(`/api/cart?locale=${locale}`, {
      method: "POST",
      headers: buildHeaders(sessionToken, guestToken),
      body: JSON.stringify({ productId, variantId, quantity }),
    });

    const nextCart = await readCartResponse<CartModel>(response);
    setCart(nextCart);
    setInitialized(true);
  }

  async function updateQuantity(itemId: string, quantity: number) {
    const response = await fetch(`/api/cart/${itemId}?locale=${locale}`, {
      method: "PATCH",
      headers: buildHeaders(sessionToken, guestToken),
      body: JSON.stringify({ quantity }),
    });

    const nextCart = await readCartResponse<CartModel>(response);
    setCart(nextCart);
    setInitialized(true);
  }

  async function removeItem(itemId: string) {
    const response = await fetch(`/api/cart/${itemId}?locale=${locale}`, {
      method: "DELETE",
      headers: buildHeaders(sessionToken, guestToken),
    });

    const nextCart = await readCartResponse<CartModel>(response);
    setCart(nextCart);
    setInitialized(true);
  }

  return (
    <CartContext.Provider
      value={{
        initialized,
        cart,
        refreshCart,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
