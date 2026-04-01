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
  auth: {
    login: string;
    logout: string;
    guest: string;
    mobileLabel: string;
    mobilePlaceholder: string;
    requestOtp: string;
    otpLabel: string;
    otpPlaceholder: string;
    verifyOtp: string;
    changeMobile: string;
    loading: string;
    demoOtp: string;
    sessionReady: string;
  };
  cart: {
    title: string;
    empty: string;
    add: string;
    added: string;
    viewCart: string;
    subtotal: string;
    quantity: string;
    remove: string;
    itemCount: string;
    maxStockReached: string;
    onlyLeft: string;
    checkout: string;
  };
  checkout: {
    title: string;
    subtitle: string;
    empty: string;
    fullName: string;
    mobile: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    paymentTitle: string;
    cod: string;
    mock: string;
    razorpay: string;
    saveAddress: string;
    placeOrder: string;
    payNow: string;
    placingOrder: string;
    processingPayment: string;
    orderPlaced: string;
    orderNumber: string;
    continueShopping: string;
    viewOrders: string;
    paymentCancelled: string;
  };
  orders: {
    title: string;
    subtitle: string;
    empty: string;
    status: string;
    payment: string;
    items: string;
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
    auth: {
      login: "Login",
      logout: "Logout",
      guest: "Guest",
      mobileLabel: "Mobile number",
      mobilePlaceholder: "9876543210",
      requestOtp: "Send OTP",
      otpLabel: "Enter OTP",
      otpPlaceholder: "1234",
      verifyOtp: "Verify OTP",
      changeMobile: "Change number",
      loading: "Please wait...",
      demoOtp: "Demo OTP",
      sessionReady: "Logged in",
    },
    cart: {
      title: "Cart",
      empty: "Your cart is empty.",
      add: "Add to cart",
      added: "Added",
      viewCart: "Cart",
      subtotal: "Subtotal",
      quantity: "Qty",
      remove: "Remove",
      itemCount: "items",
      maxStockReached: "Max stock reached",
      onlyLeft: "Only",
      checkout: "Checkout",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Review your cart, add delivery details, and place the order.",
      empty: "Add products to your cart before checkout.",
      fullName: "Full name",
      mobile: "Mobile number",
      line1: "Address line 1",
      line2: "Address line 2",
      city: "City",
      state: "State",
      postalCode: "Postal code",
      country: "Country",
      paymentTitle: "Payment method",
      cod: "Cash on delivery",
      mock: "Mock paid order",
      razorpay: "Razorpay / UPI / Cards",
      saveAddress: "Save this address to my account",
      placeOrder: "Place order",
      payNow: "Pay now",
      placingOrder: "Placing order...",
      processingPayment: "Processing payment...",
      orderPlaced: "Order placed successfully.",
      orderNumber: "Order number",
      continueShopping: "Continue shopping",
      viewOrders: "View orders",
      paymentCancelled: "Payment was cancelled before completion.",
    },
    orders: {
      title: "My Orders",
      subtitle: "Track the orders created from your current commerce flow.",
      empty: "No orders yet.",
      status: "Status",
      payment: "Payment",
      items: "items",
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
    auth: {
      login: "உள்நுழை",
      logout: "வெளியேறு",
      guest: "விருந்தினர்",
      mobileLabel: "மொபைல் எண்",
      mobilePlaceholder: "9876543210",
      requestOtp: "OTP அனுப்பு",
      otpLabel: "OTP உள்ளிடவும்",
      otpPlaceholder: "1234",
      verifyOtp: "OTP சரிபார்",
      changeMobile: "எண்ணை மாற்று",
      loading: "காத்திருக்கவும்...",
      demoOtp: "டெமோ OTP",
      sessionReady: "உள்நுழைந்துள்ளீர்கள்",
    },
    cart: {
      title: "கார்ட்",
      empty: "உங்கள் கார்ட் காலியாக உள்ளது.",
      add: "கார்டில் சேர்",
      added: "சேர்க்கப்பட்டது",
      viewCart: "கார்ட்",
      subtotal: "கூட்டுத்தொகை",
      quantity: "அளவு",
      remove: "நீக்கு",
      itemCount: "பொருட்கள்",
      maxStockReached: "அதிகபட்ச இருப்பு எட்டியது",
      onlyLeft: "மீதம்",
      checkout: "செக்அவுட்",
    },
    checkout: {
      title: "செக்அவுட்",
      subtitle: "கார்டை சரிபார்த்து, டெலிவரி விவரங்களை சேர்த்து, ஆர்டர் செய்யுங்கள்.",
      empty: "செக்அவுட் செய்ய முன் கார்டில் பொருட்களை சேர்க்கவும்.",
      fullName: "முழு பெயர்",
      mobile: "மொபைல் எண்",
      line1: "முகவரி வரி 1",
      line2: "முகவரி வரி 2",
      city: "நகரம்",
      state: "மாநிலம்",
      postalCode: "அஞ்சல் குறியீடு",
      country: "நாடு",
      paymentTitle: "பணம் செலுத்தும் முறை",
      cod: "டெலிவரியில் பணம்",
      mock: "டெமோ பணம் செலுத்திய ஆர்டர்",
      razorpay: "Razorpay / UPI / கார்டுகள்",
      saveAddress: "இந்த முகவரியை என் கணக்கில் சேமி",
      placeOrder: "ஆர்டர் இடு",
      payNow: "இப்போது பணம் செலுத்து",
      placingOrder: "ஆர்டர் இடப்படுகிறது...",
      processingPayment: "பணம் செயலாக்கப்படுகிறது...",
      orderPlaced: "ஆர்டர் வெற்றிகரமாக இடப்பட்டது.",
      orderNumber: "ஆர்டர் எண்",
      continueShopping: "ஷாப்பிங் தொடர",
      viewOrders: "ஆர்டர்களை பார்க்க",
      paymentCancelled: "பணம் செலுத்துதல் நிறைவு பெறும் முன் ரத்து செய்யப்பட்டது.",
    },
    orders: {
      title: "என் ஆர்டர்கள்",
      subtitle: "தற்போதைய காமர்ஸ் பாய்ச்சலில் உருவாக்கப்பட்ட ஆர்டர்களை பார்க்கவும்.",
      empty: "இன்னும் ஆர்டர்கள் இல்லை.",
      status: "நிலை",
      payment: "பணம்",
      items: "பொருட்கள்",
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
