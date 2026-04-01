"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useCart } from "@/components/cart-provider";
import type { Dictionary } from "@/lib/i18n/messages";
import type { CheckoutPaymentMethod, OrderModel } from "@/types/order";

interface CheckoutPageClientProps {
  readonly dictionary: Dictionary;
  readonly locale: string;
}

interface OrderApiEnvelope<T> {
  success?: boolean;
  data?: T;
  error?: string;
}

interface RazorpayProcessPayload {
  provider: "razorpay";
  keyId: string;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  checkoutToken: string;
  merchantName: string;
  description: string;
  prefill: {
    name: string;
    contact: string;
  };
}

interface RazorpayHandlerResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayCheckoutInstance {
  open: () => void;
}

interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  handler: (response: RazorpayHandlerResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  prefill?: {
    name?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckoutInstance;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function ensureRazorpayCheckoutLoaded(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Razorpay checkout is only available in the browser."));
  }

  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout="true"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Unable to load Razorpay checkout.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.razorpayCheckout = "true";
    script.onload = () => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      reject(new Error("Razorpay checkout did not initialize correctly."));
    };
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout."));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
}

export function CheckoutPageClient({ dictionary, locale }: Readonly<CheckoutPageClientProps>) {
  const { cart, initialized: cartReady, refreshCart } = useCart();
  const { initialized: authReady, guestToken, sessionToken } = useAuth();
  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [placedOrder, setPlacedOrder] = useState<OrderModel | null>(null);
  const razorpayEnabled = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: (razorpayEnabled ? "razorpay" : "mock") as CheckoutPaymentMethod,
    saveAddress: true,
  });

  function buildCheckoutHeaders(): HeadersInit {
    return {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...(guestToken ? { "X-Guest-Token": guestToken } : {}),
    };
  }

  function buildOrderRequestBody() {
    return {
      address: {
        fullName: form.fullName,
        mobile: form.mobile,
        line1: form.line1,
        line2: form.line2 || undefined,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
        country: form.country,
      },
      paymentMethod: form.paymentMethod === "razorpay" ? "razorpay" : "mock",
      saveAddress: form.saveAddress,
    };
  }

  async function openRazorpayCheckout(session: RazorpayProcessPayload) {
    await ensureRazorpayCheckoutLoaded();

    const RazorpayCheckout = window.Razorpay;
    if (!RazorpayCheckout) {
      throw new Error("Razorpay checkout is unavailable.");
    }

    return new Promise<RazorpayHandlerResponse>((resolve, reject) => {
      const instance = new RazorpayCheckout({
        key: session.keyId,
        amount: session.amount,
        currency: session.currency,
        order_id: session.razorpayOrderId,
        name: session.merchantName,
        description: session.description,
        prefill: session.prefill,
        theme: {
          color: "#1b5e3f",
        },
        handler: (response) => resolve(response),
        modal: {
          ondismiss: () => reject(new Error(dictionary.checkout.paymentCancelled)),
        },
      });

      instance.open();
    });
  }

  async function handlePlaceOrder() {
    setBusy(true);
    setErrorMessage(null);

    try {
      if (form.paymentMethod === "razorpay") {
        const processResponse = await fetch(`/api/payment/process?locale=${locale}`, {
          method: "POST",
          headers: buildCheckoutHeaders(),
          body: JSON.stringify(buildOrderRequestBody()),
        });

        const processPayload = (await processResponse.json()) as OrderApiEnvelope<RazorpayProcessPayload>;
        if (!processResponse.ok || !processPayload.success || !processPayload.data) {
          throw new Error(processPayload.error ?? `Payment start failed with status ${processResponse.status}`);
        }

        const razorpayResponse = await openRazorpayCheckout(processPayload.data);
        const verifyResponse = await fetch("/api/payment/verify", {
          method: "POST",
          headers: buildCheckoutHeaders(),
          body: JSON.stringify({
            checkoutToken: processPayload.data.checkoutToken,
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
          }),
        });

        const verifyPayload = (await verifyResponse.json()) as OrderApiEnvelope<OrderModel>;
        if (!verifyResponse.ok || !verifyPayload.success || !verifyPayload.data) {
          throw new Error(verifyPayload.error ?? `Payment verification failed with status ${verifyResponse.status}`);
        }

        setPlacedOrder(verifyPayload.data);
        await refreshCart();
        return;
      }

      const response = await fetch(`/api/orders?locale=${locale}`, {
        method: "POST",
        headers: buildCheckoutHeaders(),
        body: JSON.stringify(buildOrderRequestBody()),
      });

      const payload = (await response.json()) as OrderApiEnvelope<OrderModel>;
      if (!response.ok || !payload.success || !payload.data) {
        throw new Error(payload.error ?? `Checkout failed with status ${response.status}`);
      }

      setPlacedOrder(payload.data);
      await refreshCart();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to place order.");
    } finally {
      setBusy(false);
    }
  }

  if (!authReady || !cartReady) {
    return <div className="glass-panel fade-up rounded-3xl p-8 text-center text-muted">{dictionary.auth.loading}</div>;
  }

  if (placedOrder) {
    return (
      <div className="fade-up space-y-6 rounded-[2rem] border border-primary/15 bg-card/80 p-6 shadow-[0_10px_30px_rgba(15,35,24,0.06)] sm:p-8">
        <div className="space-y-3">
          <p className="inline-flex rounded-full border border-primary/20 bg-surface/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-strong">
            {dictionary.checkout.orderPlaced}
          </p>
          <h1 className="text-3xl text-ink">{dictionary.checkout.title}</h1>
          <p className="text-muted">
            {dictionary.checkout.orderNumber}: <span className="font-semibold text-ink">{placedOrder.orderNumber}</span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-white/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {dictionary.cart.subtotal}
            </p>
            <p className="mt-2 text-3xl font-semibold text-ink">Rs {placedOrder.totalAmount.toFixed(0)}</p>
          </div>

          <div className="rounded-2xl border border-primary/10 bg-surface/80 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              {dictionary.orders.payment}
            </p>
            <p className="mt-2 text-lg font-semibold capitalize text-primary">{placedOrder.paymentStatus}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary-strong"
            href={`/${locale}/orders`}
          >
            {dictionary.checkout.viewOrders}
          </Link>
          <Link
            className="inline-flex items-center justify-center rounded-full border border-primary/25 bg-white/80 px-5 py-3 text-sm font-semibold text-primary-strong transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-white"
            href={`/${locale}/products`}
          >
            {dictionary.checkout.continueShopping}
          </Link>
        </div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="fade-up space-y-4 rounded-[2rem] border border-primary/15 bg-card/80 p-8 text-center shadow-[0_10px_30px_rgba(15,35,24,0.06)]">
        <h1 className="text-3xl text-ink">{dictionary.checkout.title}</h1>
        <p className="text-muted">{dictionary.checkout.empty}</p>
        <Link
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
          href={`/${locale}/products`}
        >
          {dictionary.checkout.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="fade-up space-y-6 rounded-[2rem] border border-primary/15 bg-card/80 p-6 shadow-[0_10px_30px_rgba(15,35,24,0.06)] sm:p-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-strong">Delivery details</p>
          <h1 className="text-3xl text-ink">{dictionary.checkout.title}</h1>
          <p className="text-muted">{dictionary.checkout.subtitle}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["fullName", dictionary.checkout.fullName],
            ["mobile", dictionary.checkout.mobile],
            ["line1", dictionary.checkout.line1],
            ["line2", dictionary.checkout.line2],
            ["city", dictionary.checkout.city],
            ["state", dictionary.checkout.state],
            ["postalCode", dictionary.checkout.postalCode],
            ["country", dictionary.checkout.country],
          ].map(([key, label], index) => (
            <label
              className={`fade-up space-y-2 ${key === "line1" || key === "line2" ? "sm:col-span-2" : ""} ${
                index === 1
                  ? "stagger-1"
                  : index === 2
                    ? "stagger-2"
                    : index === 3
                      ? "stagger-3"
                      : index >= 4
                        ? "stagger-4"
                        : ""
              }`}
              key={key}
            >
              <span className="text-sm font-medium text-ink">{label}</span>
              <input
                className="w-full rounded-2xl border border-primary/20 bg-white/85 px-4 py-3 text-sm text-ink outline-none transition focus:border-primary"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                value={form[key as keyof typeof form] as string}
              />
            </label>
          ))}
        </div>

        <div className="fade-up stagger-3 space-y-4 rounded-2xl border border-primary/10 bg-surface/70 p-5">
          <p className="text-sm font-medium text-ink">{dictionary.checkout.paymentTitle}</p>
          <div className="flex flex-wrap items-center gap-3">
            {razorpayEnabled ? (
              <>
                <button
                  className={
                    form.paymentMethod === "razorpay"
                      ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary-strong"
                  }
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      paymentMethod: "razorpay",
                    }))
                  }
                  type="button"
                >
                  {dictionary.checkout.razorpay}
                </button>
                <button
                  className={
                    form.paymentMethod === "mock"
                      ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                      : "rounded-full border border-primary/20 bg-white px-4 py-2 text-sm font-semibold text-primary-strong"
                  }
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      paymentMethod: "mock",
                    }))
                  }
                  type="button"
                >
                  {dictionary.checkout.mock}
                </button>
              </>
            ) : (
              <div className="rounded-full border border-emerald-600/30 bg-emerald-100/70 px-4 py-2 text-sm font-semibold text-emerald-900">
                {dictionary.checkout.mock}
              </div>
            )}
            <p className="text-sm text-muted">
              {form.paymentMethod === "razorpay"
                ? "Uses Razorpay test mode with no real money charged."
                : "Instant demo confirmation with paid status."}
            </p>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-muted">
            <input
              checked={form.saveAddress}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  saveAddress: event.target.checked,
                }))
              }
              type="checkbox"
            />
            {dictionary.checkout.saveAddress}
          </label>
        </div>

        {errorMessage ? (
          <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </p>
        ) : null}

        <button
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(27,94,63,0.22)] transition hover:-translate-y-0.5 hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-60"
          disabled={busy}
          onClick={() => void handlePlaceOrder()}
          type="button"
        >
          {busy
            ? form.paymentMethod === "razorpay"
              ? dictionary.checkout.processingPayment
              : dictionary.checkout.placingOrder
            : form.paymentMethod === "razorpay"
              ? dictionary.checkout.payNow
              : dictionary.checkout.placeOrder}
        </button>
      </section>

      <aside className="fade-up delay-1 space-y-5 rounded-[2rem] border border-primary/15 bg-card/80 p-6 shadow-[0_10px_30px_rgba(15,35,24,0.06)] sm:p-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-strong">Order snapshot</p>
            <h2 className="mt-3 text-2xl text-ink">Review items</h2>
          </div>
          <div className="rounded-full border border-primary/15 bg-surface/80 px-3 py-1 text-xs font-semibold text-primary-strong">
            {cart.items.length} items
          </div>
        </div>

        {cart.items.map((item, index) => (
          <div
            className={`fade-up flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-surface/80 p-4 ${
              index === 1 ? "stagger-1" : index === 2 ? "stagger-2" : index >= 3 ? "stagger-3" : ""
            }`}
            key={item.id}
          >
            <div>
              <p className="font-semibold text-ink">{item.productName}</p>
              <p className="text-sm text-muted">{item.variantLabel}</p>
              <p className="text-xs text-muted">
                {dictionary.cart.quantity}: {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-primary">Rs {item.lineTotal.toFixed(0)}</p>
          </div>
        ))}

        <div className="space-y-3 rounded-2xl border border-primary/10 bg-white/80 p-5 text-sm">
          <div className="flex items-center justify-between text-muted">
            <span>{dictionary.cart.subtotal}</span>
            <span>Rs {cart.subtotal.toFixed(0)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-ink">
            <span>{form.paymentMethod === "razorpay" ? dictionary.checkout.payNow : dictionary.checkout.placeOrder}</span>
            <span>Rs {cart.subtotal.toFixed(0)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
