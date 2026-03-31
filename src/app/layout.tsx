import type { Metadata, Viewport } from "next";
import { Outfit, Prata } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-body-sans",
  subsets: ["latin"],
});

const prata = Prata({
  variable: "--font-heading-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: {
    default: "Sri Selliyamman Oil and Flour Mills | AI-Powered eCommerce",
    template: "%s | Sri Selliyamman Oil and Flour Mills",
  },
  description:
    "AI-powered bilingual eCommerce for fresh oils and flour. Shop mill-fresh products in English & Tamil with fast delivery across Tamil Nadu.",
};

export const viewport: Viewport = {
  themeColor: "#0e7a45",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${prata.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-base text-ink">{children}</body>
    </html>
  );
}
