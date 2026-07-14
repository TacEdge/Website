import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { basePath } from "@/lib/base-path";

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
    <html lang="en-NZ">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Be+Vietnam+Pro:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
