import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { basePath } from "@/lib/base-path";

/* Brand fonts, self-hosted so the site does not depend on a third-party
   CDN and renders identically everywhere. */
const play = localFont({
  src: [
    { path: "./fonts/play-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/play-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const beVietnamPro = localFont({
  src: [
    { path: "./fonts/be-vietnam-pro-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/be-vietnam-pro-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/be-vietnam-pro-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/be-vietnam-pro-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ui",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "./fonts/jetbrains-mono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/jetbrains-mono-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/jetbrains-mono-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TACEDGE · Field platform for ground engineering delivery",
  description:
    "Set the project up once, capture the work where it happens, and produce a confirmed record your engineer can trust. In production across New Zealand and Samoa.",
  icons: {
    icon: `${basePath}/brand/favicon.svg`,
    apple: `${basePath}/brand/apple-touch-icon.png`,
  },
  manifest: `${basePath}/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-NZ"
      className={`${play.variable} ${beVietnamPro.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
