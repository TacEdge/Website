import type { Metadata } from "next";
import { footer } from "@/content/site";

export const metadata: Metadata = { title: "Contact · TacEdge" };

export default function Contact() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Contact</span>
        <h1 className="heading-lg">Arrange a demonstration.</h1>
        <p className="sub">
          Fifteen minutes, on real work, with your work types. Bring your
          engineer if you like.
        </p>
        <p className="sub" style={{ marginTop: 24 }}>
          <a href={`mailto:${footer.email}`} className="btn btn--primary">
            Email {footer.email}
          </a>
        </p>
      </div>
    </section>
  );
}
