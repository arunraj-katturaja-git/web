"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import type { Dictionary } from "@/lib/i18n/messages";
import type { OrderModel } from "@/types/order";

interface OrdersPageClientProps {
  readonly dictionary: Dictionary;
  readonly locale: string;
}

export function OrdersPageClient({ dictionary, locale }: Readonly<OrdersPageClientProps>) {
  const { initialized: authReady, guestToken, sessionToken } = useAuth();
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [loading, setLoading] = useState(true);

  function formatPlacedAt(value?: string) {
    if (!value) {
      return null;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return new Intl.DateTimeFormat(locale === "ta" ? "ta-IN" : "en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsed);
  }

  useEffect(() => {
    if (!authReady) {
      return;
    }

    async function loadOrders() {
      try {
        const response = await fetch(`/api/orders?locale=${locale}`, {
          headers: {
            Accept: "application/json",
            ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
            ...(guestToken ? { "X-Guest-Token": guestToken } : {}),
          },
          cache: "no-store",
        });

        const payload = (await response.json().catch(() => null)) as
          | { success?: boolean; data?: OrderModel[] }
          | null;

        if (!response.ok || !payload?.success || !payload.data) {
          setOrders([]);
          return;
        }

        setOrders(payload.data);
      } finally {
        setLoading(false);
      }
    }

    void loadOrders();
  }, [authReady, guestToken, sessionToken, locale]);

  if (loading) {
    return <div className="glass-panel fade-up rounded-3xl p-8 text-center text-muted">{dictionary.auth.loading}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="fade-up space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-strong">Order journal</p>
        <h1 className="text-3xl text-ink">{dictionary.orders.title}</h1>
        <p className="text-muted">{dictionary.orders.subtitle}</p>
      </div>

      {orders.length === 0 ? (
        <div className="fade-up rounded-[2rem] border border-primary/15 bg-card/80 p-8 text-center text-muted shadow-[0_10px_30px_rgba(15,35,24,0.06)]">
          {dictionary.orders.empty}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <section
              className={`fade-up rounded-[2rem] border border-primary/15 bg-card/80 p-6 shadow-[0_10px_30px_rgba(15,35,24,0.06)] ${
                index === 1 ? "stagger-1" : index === 2 ? "stagger-2" : index >= 3 ? "stagger-3" : ""
              }`}
              key={order.id}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-primary/10 pb-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-strong">
                    {order.orderNumber}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/15 bg-surface/80 px-3 py-1 text-xs font-semibold capitalize text-primary-strong">
                      {order.status}
                    </span>
                    <span className="rounded-full border border-emerald-600/30 bg-emerald-100/70 px-3 py-1 text-xs font-semibold capitalize text-emerald-900">
                      {order.paymentStatus}
                    </span>
                  </div>
                  {formatPlacedAt(order.placedAt) ? (
                    <p className="mt-3 text-sm text-muted">{formatPlacedAt(order.placedAt)}</p>
                  ) : null}
                </div>

                <div className="text-right">
                  <p className="text-sm text-muted">
                    {order.items.length} {dictionary.orders.items}
                  </p>
                  <p className="text-lg font-semibold text-primary">Rs {order.totalAmount.toFixed(0)}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                {order.items.map((item) => (
                  <div className="flex items-center justify-between gap-3 rounded-2xl border border-primary/10 bg-surface/80 px-4 py-3" key={item.id}>
                    <div>
                      <p className="font-semibold text-ink">{item.productName}</p>
                      <p className="text-sm text-muted">
                        {item.variantLabel} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-primary">Rs {item.lineTotal.toFixed(0)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl border border-primary/10 bg-white/80 p-4 text-sm text-muted">
                <p className="font-medium text-ink">{order.address.fullName}</p>
                <p className="mt-1">{order.address.line1}</p>
                <p>
                  {[order.address.city, order.address.state, order.address.postalCode].filter(Boolean).join(", ")}
                </p>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
