"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, cta } from "@/content/site";
import { basePath } from "@/lib/base-path";

const normalise = (p: string) => p.replace(/\/+$/, "") || "/";

/**
 * Forest top bar. Wordmark alone — no workspace descriptor lockup.
 * The active nav item carries a fine sage underline; the homepage is the
 * Ground Engineering front door, so it highlights Ground Engineering.
 */
export default function Header() {
  const pathname = normalise(usePathname() ?? "/");
  const active = pathname === "/" ? "/ground-engineering" : pathname;

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="site-header__logo" aria-label="TacEdge home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/brand/tacedge-lockup-cream.svg`}
            alt="TACEDGE"
            width={182}
            height={36}
          />
        </Link>
        <nav className="site-nav" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={normalise(item.href) === active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href={cta.href} className="btn btn--primary-inverse">
            {cta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
