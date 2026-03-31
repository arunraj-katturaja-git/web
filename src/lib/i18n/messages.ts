import type { AppLocale } from "@/lib/i18n/config";

export interface Dictionary {
  siteName: string;
  tagline: string;
  navigation: {
    home: string;
    products: string;
    support: string;
  };
  language: {
    label: string;
    english: string;
    tamil: string;
  };
  home: {
    eyebrow: string;
    title: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    featuredTitle: string;
    featuredSubtitle: string;
    supportTitle: string;
    supportBody: string;
  };
  products: {
    title: string;
    subtitle: string;
    empty: string;
    faqTitle: string;
    faqSubtitle: string;
    viewDetails: string;
    detailBack: string;
    detailVariantsTitle: string;
    detailAboutTitle: string;
  };
  common: {
    startingAt: string;
    outOfStock: string;
    inStock: string;
    availablePacks: string;
    moreVariants: string;
    noVariants: string;
    compareAt: string;
  };
}

const dictionaries: Record<AppLocale, Dictionary> = {
  en: {
    siteName: "Sri Selliyamman Oil and Flour Mills",
    tagline: "Traditional oils, rice and bran, modern shopping",
    navigation: {
      home: "Home",
      products: "Products",
      support: "Support",
    },
    language: {
      label: "Language",
      english: "English",
      tamil: "Tamil",
    },
    home: {
      eyebrow: "Freshly milled. Honest quality. Delivered across Tamil Nadu.",
      title: "Sri Selliyamman Oil and Flour Mills",
      subtitle:
        "A unique bilingual eCommerce experience for coconut oil, groundnut oil, sesame oil, castor oil, rice and bran.",
      primaryCta: "Shop Products",
      secondaryCta: "Explore Catalog",
      featuredTitle: "Featured Products",
      featuredSubtitle: "Handpicked from our current fresh stock",
      supportTitle: "Need help with your order?",
      supportBody:
        "Call our team for quick support in English or Tamil. We help with product choice, packs, and delivery updates.",
    },
    products: {
      title: "All Products",
      subtitle: "Live variant availability from our latest stock",
      empty: "Products will appear here once Strapi content is synced.",
      faqTitle: "Product FAQs",
      faqSubtitle: "Answers managed in Strapi and shown live in the storefront.",
      viewDetails: "View details",
      detailBack: "Back to products",
      detailVariantsTitle: "Available variants",
      detailAboutTitle: "About this product",
    },
    common: {
      startingAt: "Starting at",
      outOfStock: "Out of stock",
      inStock: "In stock",
      availablePacks: "Available packs",
      moreVariants: "more packs",
      noVariants: "Variant details will appear once they are added in Strapi.",
      compareAt: "MRP",
    },
  },
  ta: {
    siteName: "ஸ்ரீ செல்லியம்மன் எண்ணெய் மற்றும் மாவு மில்ஸ்",
    tagline: "பாரம்பரிய எண்ணெய், அரிசி மற்றும் பிரான், நவீன ஆன்லைன் வாங்கல்",
    navigation: {
      home: "முகப்பு",
      products: "பொருட்கள்",
      support: "ஆதரவு",
    },
    language: {
      label: "மொழி",
      english: "ஆங்கிலம்",
      tamil: "தமிழ்",
    },
    home: {
      eyebrow: "புதிய அரைப்பு, தரமான பொருட்கள், தமிழ்நாடு முழுவதும் டெலிவரி",
      title: "ஸ்ரீ செல்லியம்மன் எண்ணெய் மற்றும் மாவு மில்ஸ்",
      subtitle:
        "தேங்காய், நிலக்கடலை, எள், ஆமணக்கு எண்ணெய், அரிசி மற்றும் பிரான் தயாரிப்புகளுக்கான இருமொழி ஆன்லைன் தளம்.",
      primaryCta: "பொருட்கள் வாங்க",
      secondaryCta: "பட்டியல் பார்க்க",
      featuredTitle: "சிறப்பு பொருட்கள்",
      featuredSubtitle: "எங்களின் புதிய பங்கு இருப்பிலிருந்து தேர்ந்தெடுக்கப்பட்டவை",
      supportTitle: "ஆர்டர் உதவி வேண்டுமா?",
      supportBody:
        "எங்கள் குழுவை அழைக்கவும். தமிழ் மற்றும் ஆங்கிலத்தில் விரைவான உதவி கிடைக்கும்.",
    },
    products: {
      title: "அனைத்து பொருட்கள்",
      subtitle: "வேரியண்ட் அடிப்படையிலான நேரடி பங்கு தகவல்",
      empty: "Strapi உள்ளடக்கம் ஒத்திசைக்கப்பட்டவுடன் பொருட்கள் இங்கே தோன்றும்.",
      faqTitle: "பொருள் கேள்விகள்",
      faqSubtitle: "Strapi இல் நிர்வகிக்கப்படும் பதில்கள் இங்கே நேரடியாக காட்டப்படும்.",
      viewDetails: "விவரங்கள் பார்க்க",
      detailBack: "பொருட்களுக்குத் திரும்ப",
      detailVariantsTitle: "கிடைக்கும் வேரியண்ட்கள்",
      detailAboutTitle: "இந்த பொருள் பற்றி",
    },
    common: {
      startingAt: "தொடக்க விலை",
      outOfStock: "கிடைக்கவில்லை",
      inStock: "கிடைக்கிறது",
      availablePacks: "கிடைக்கும் பேக்குகள்",
      moreVariants: "மேலும் பேக்குகள்",
      noVariants: "Strapi இல் சேர்த்தவுடன் வேரியண்ட் தகவல்கள் இங்கே தோன்றும்.",
      compareAt: "எம்ஆர்பி",
    },
  },
};

export function getDictionary(locale: AppLocale): Dictionary {
  return dictionaries[locale];
}
