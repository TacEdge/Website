import Link from "next/link";
import { cta } from "@/content/site";

/**
 * Temporary placeholder while the remaining pages are built (build stage 5).
 * Uses only approved components.
 */
export default function StubPage({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="heading-lg">{title}</h1>
        <p className="sub">This page is being built.</p>
        <div style={{ marginTop: 36 }}>
          <Link href={cta.href} className="btn btn--primary">
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
