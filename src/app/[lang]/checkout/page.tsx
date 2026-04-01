import { notFound } from "next/navigation";
import { CheckoutPageClient } from "@/components/checkout-page-client";
import { isSupportedLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/messages";

interface CheckoutPageProps {
  readonly params: Promise<{
    lang: string;
  }>;
}

export default async function CheckoutPage({ params }: Readonly<CheckoutPageProps>) {
  const { lang } = await params;

  if (!isSupportedLocale(lang)) {
    notFound();
  }

  return <CheckoutPageClient dictionary={getDictionary(lang)} locale={lang} />;
}
