import type { Metadata } from "next";
import ContourMotif from "@/components/ContourMotif";

export const metadata: Metadata = {
  title: "Style reference · TacEdge",
  robots: { index: false, follow: false },
};

const brand = [
  ["--forest", "#2B4721", "Primary. Headers, primary buttons, dark sections"],
  ["--forest-2", "#36592A", "Hover / secondary green"],
  ["--olive", "#6E7D5C", "Working mid-tone"],
  ["--olive-edge", "#AEB89C", "Green hairline / selected edge"],
  ["--sage", "#B2B594", "Quiet surface, labels on dark"],
  ["--sage-tint", "#E6EBD9", "Soft green fill, chips, tinted panels"],
];

const neutrals = [
  ["--cream", "#F7F5EC", "Page background, the brand paper"],
  ["--card", "#FFFFFF", "Card / surface"],
  ["--tint", "#EFF1E4", "Faint green-grey fill"],
  ["--stage", "#DDE3D2", "App-frame backdrop"],
  ["--ink", "#242A1F", "Primary text"],
  ["--ink-60", "#5B6253", "Secondary text"],
  ["--ink-40", "#8A8F80", "Tertiary / captions"],
];

const semantic = [
  ["--ochre", "#B07D2B", "Caution: ageing, submitted, variance"],
  ["--brick", "#9E3B2E", "Alert: issue, test-fail, incident, stale"],
];

function Swatch({ name, hex, note }: { name: string; hex: string; note: string }) {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div style={{ height: 72, background: `var(${name})` }} />
      <div style={{ padding: "12px 16px" }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: "var(--fs-sm)",
            fontWeight: 500,
          }}
        >
          {name} · {hex}
        </div>
        <div style={{ fontSize: "var(--fs-sm)", color: "var(--ink-60)", marginTop: 4 }}>
          {note}
        </div>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="section--tight" style={{ borderTop: "1px solid var(--line)" }}>
      <div className="container">
        <span className="eyebrow eyebrow--forest">{title}</span>
        {children}
      </div>
    </section>
  );
}

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: 16,
};

export default function Styleguide() {
  return (
    <>
      <section className="section--dark section--tight">
        <ContourMotif />
        <div className="container">
          <span className="eyebrow">Internal reference</span>
          <h1 className="heading-lg">Design system</h1>
          <p className="sub">
            Tokens, type and components from the product design system. The
            website's job is to be the same thing as the product. This page is
            not linked from the site.
          </p>
        </div>
      </section>

      <Block title="Brand colour">
        <div style={grid}>
          {brand.map(([n, h, note]) => (
            <Swatch key={n} name={n} hex={h} note={note} />
          ))}
        </div>
      </Block>

      <Block title="Neutrals and ink">
        <div style={grid}>
          {neutrals.map(([n, h, note]) => (
            <Swatch key={n} name={n} hex={h} note={note} />
          ))}
        </div>
      </Block>

      <Block title="Semantic status — never decorative">
        <p className="prose" style={{ marginBottom: 16 }}>
          Ochre and brick carry meaning in the product: caution and alert. They
          appear on the website only inside an authentic product screenshot or
          a faithful UI mock. Never as marketing accents.
        </p>
        <div style={grid}>
          {semantic.map(([n, h, note]) => (
            <Swatch key={n} name={n} hex={h} note={note} />
          ))}
        </div>
      </Block>

      <Block title="Typography">
        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <span className="eyebrow">Play 700 · display</span>
            <h2 className="heading-xl">Reporting your engineer trusts on sight.</h2>
          </div>
          <div>
            <span className="eyebrow">Be Vietnam Pro 400 · body</span>
            <p className="prose">
              The record starts on paper at the rig and gets re-keyed at every
              link in the chain, arriving late, thinned out, and questioned by
              the time it reaches the engineer.
            </p>
          </div>
          <div>
            <span className="eyebrow">JetBrains Mono · eyebrows and labels</span>
            <span className="eyebrow eyebrow--forest" style={{ marginBottom: 0 }}>
              Configure · Capture · Confirm &amp; Release
            </span>
          </div>
        </div>
      </Block>

      <Block title="Buttons">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center" }}>
          <a href="#" className="btn btn--primary">Arrange a demonstration</a>
          <a href="#" className="btn btn--secondary">Secondary action</a>
          <a href="#" className="btn btn--ghost">Ghost action</a>
        </div>
        <div
          style={{
            marginTop: 16,
            padding: 24,
            background: "var(--forest)",
            borderRadius: "var(--r-lg)",
            display: "flex",
            gap: 16,
          }}
        >
          <a href="#" className="btn btn--primary-inverse">On a forest surface</a>
        </div>
      </Block>

      <Block title="Cards and chips">
        <div style={grid}>
          <div className="card card--hover" style={{ padding: 24 }}>
            <span className="eyebrow" style={{ marginBottom: 8 }}>Card</span>
            <h3 className="heading-sm">Hairline border, one soft shadow</h3>
            <p style={{ color: "var(--ink-60)", fontSize: "var(--fs-md)", marginTop: 8 }}>
              Hover lifts one pixel and deepens the shadow one step.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
            <span className="chip">Drilling</span>
            <span className="chip">Anchoring</span>
            <span className="chip">Ground Engineering</span>
          </div>
        </div>
      </Block>

      <Block title="Step indicator — sage → olive → forest">
        <p className="prose" style={{ marginBottom: 24 }}>
          The product's work-phase happy path darkens green: planned, active,
          confirmed. Forest-filled is reserved for terminal-positive states.
        </p>
        <div className="steps">
          {[
            ["configure", "1", "Configure"],
            ["capture", "2", "Capture"],
            ["release", "3", "Confirm & Release"],
          ].map(([key, num, name]) => (
            <div key={key} className={`step--${key}`}>
              <div className="step-marker">
                <span className="step-marker__num">{num}</span>
                <span className="step-marker__line" />
              </div>
              <div className="card step-card">
                <h3>{name}</h3>
                <p>Marker fill follows the phase state the product already uses.</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Logo">
        <div style={grid}>
          <div className="card" style={{ padding: 24, display: "grid", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tacedge-lockup-forest.svg" alt="TACEDGE lockup, forest" width={280} height={55} />
            <span className="eyebrow" style={{ margin: 0 }}>Light sections · forest</span>
          </div>
          <div style={{ background: "var(--forest)", borderRadius: "var(--r-lg)", padding: 24, display: "grid", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tacedge-lockup-cream.svg" alt="TACEDGE lockup, cream" width={280} height={55} />
            <span className="eyebrow" style={{ margin: 0, color: "var(--sage)" }}>Dark sections · cream</span>
          </div>
          <div className="card" style={{ padding: 24, display: "grid", gap: 12 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tacedge-lockup-ink.svg" alt="TACEDGE lockup, ink" width={280} height={55} />
            <span className="eyebrow" style={{ margin: 0 }}>Monochrome · ink</span>
          </div>
          <div className="card" style={{ padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/tacedge-brandmark-sage.svg" alt="TacEdge brandmark" width={64} height={59} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/favicon.svg" alt="TacEdge app icon" width={64} height={59} />
            <span className="eyebrow" style={{ margin: 0 }}>Brandmark · app icon</span>
          </div>
        </div>
      </Block>

      <Block title="Contour motif — dark panels only">
        <div
          className="section--dark"
          style={{ borderRadius: "var(--r-xl)", padding: "64px 40px" }}
        >
          <ContourMotif />
          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="eyebrow">The signature element</span>
            <h2 className="heading-md" style={{ color: "var(--cream)" }}>
              Thin strokes, low opacity, never over body text.
            </h2>
          </div>
        </div>
      </Block>
    </>
  );
}
