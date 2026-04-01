import { notFound } from "next/navigation";
import { OrdersPageClient } from "@/components/orders-page-client";
import { isSupportedLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/messages";

interface OrdersPageProps {
  readonly params: Promise<{
    lang: string;
  }>;
}

export default async function OrdersPage({ params }: Readonly<OrdersPageProps>) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  return <OrdersPageClient dictionary={getDictionary(lang)} locale={lang} />;
}
