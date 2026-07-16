"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";
import { basePath } from "@/lib/base-path";

const normalise = (p: string) => p.replace(/\/+$/, "") || "/";

/**
 * Forest top bar. Simplified navigation: Home, About, Contact. The hero
 * carries the demonstration CTA, so the header stays open and calm.
 * The active item carries a fine sage underline plus aria-current.
 */
export default function Header() {
  const pathname = normalise(usePathname() ?? "/");

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="TACEDGE home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/brand/tacedge-lockup-cream.svg`}
            alt="TACEDGE"
            width={187}
            height={37}
          />
        </Link>
        <nav className="site-nav" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={normalise(item.href) === pathname ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
