import type { Dictionary } from "@/lib/i18n/messages";
import type { FaqContent } from "@/lib/strapi/site-content";

interface FaqListProps {
  readonly dictionary: Dictionary;
  readonly faqs: FaqContent[];
}

export function FaqList({ dictionary, faqs }: Readonly<FaqListProps>) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      className="fade-up space-y-6 rounded-[2rem] border border-primary/15 bg-card/70 p-6 shadow-[0_10px_30px_rgba(15,35,24,0.06)] sm:p-8"
      id="product-faqs"
    >
      <div className="space-y-2">
        <h2 className="text-3xl text-ink sm:text-4xl">{dictionary.products.faqTitle}</h2>
        <p className="max-w-2xl text-sm text-muted sm:text-base">{dictionary.products.faqSubtitle}</p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <details
            className="rounded-2xl border border-primary/15 bg-white/80 px-5 py-4 open:border-primary/35 open:shadow-[0_8px_24px_rgba(15,35,24,0.08)]"
            key={faq.id}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 pr-1 text-base font-semibold text-ink marker:hidden">
              <span>{faq.question}</span>
              <span aria-hidden="true" className="text-primary-strong">+</span>
            </summary>
            <div
              className="prose prose-sm mt-3 max-w-none text-muted prose-p:my-2 prose-strong:text-ink"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </details>
        ))}
      </div>
    </section>
  );
}
