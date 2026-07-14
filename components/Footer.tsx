import Link from "next/link";
import { nav, footer } from "@/content/site";
import { basePath } from "@/lib/base-path";

/**
 * Three-column footer mirroring the simplified navigation:
 * brand, pages (plus privacy), contact.
 */
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__col site-footer__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/brand/tacedge-lockup-cream.svg`}
              alt="TACEDGE"
              width={162}
              height={32}
            />
            <p style={{ marginTop: 16, maxWidth: "30ch" }}>{footer.line}</p>
          </div>
          <div className="site-footer__col">
            <h3>Pages</h3>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/privacy">Privacy</Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <h3>Contact</h3>
            <ul>
              <li>
                <a href={`mailto:${footer.email}`}>{footer.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="site-footer__base">
          <span>{footer.copyright}</span>
          <span>{footer.location}</span>
        </div>
      </div>
    </footer>
  );
}
