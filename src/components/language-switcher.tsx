"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isSupportedLocale, type AppLocale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/messages";

interface LanguageSwitcherProps {
  readonly currentLocale: AppLocale;
  readonly dictionary: Dictionary;
}

function buildPathWithLocale(pathname: string, locale: AppLocale): string {
  if (!pathname || pathname === "/") {
    return `/${locale}`;
  }

  const segments = pathname.split("/");
  const firstSegment = segments[1];

  if (firstSegment && isSupportedLocale(firstSegment)) {
    segments[1] = locale;
    return segments.join("/");
  }

  segments.splice(1, 0, locale);
  return segments.join("/");
}

export function LanguageSwitcher({ currentLocale, dictionary }: Readonly<LanguageSwitcherProps>) {
  const pathname = usePathname();
  const englishHref = buildPathWithLocale(pathname, "en");
  const tamilHref = buildPathWithLocale(pathname, "ta");

  return (
    <div className="glass-panel flex items-center gap-1 rounded-full px-1 py-1 text-xs font-bold text-ink shadow-lg border-primary/30">
      <Link
        className={
          currentLocale === "en"
            ? "gradient-primary rounded-full px-4 py-2 text-white transition-all hover:shadow-lg"
            : "px-4 py-2 text-muted hover:text-ink rounded-full transition-all"
        }
        href={englishHref}
      >
        {dictionary.language.english}
      </Link>
      <Link
        className={
          currentLocale === "ta"
            ? "gradient-accent rounded-full px-4 py-2 text-white transition-all hover:shadow-lg"
            : "px-4 py-2 text-muted hover:text-ink rounded-full transition-all"
        }
        href={tamilHref}
      >
        {dictionary.language.tamil}
      </Link>
    </div>
  );
}
