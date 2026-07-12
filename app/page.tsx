import Link from "next/link";
import ContourMotif from "@/components/ContourMotif";
import { cta } from "@/content/site";
import {
  hero,
  problem,
  spine,
  operator,
  offline,
  engineer,
  proof,
  platform,
  closing,
} from "@/content/home";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section--dark">
        <ContourMotif />
        <div className="container section">
          <h1
            className="heading-xl"
            style={{
              fontSize: "clamp(40px, 5.4vw, 68px)",
              maxWidth: "16ch",
              color: "var(--cream)",
            }}
          >
            {hero.headline}
          </h1>
          <p className="sub" style={{ maxWidth: "56ch" }}>{hero.subhead}</p>
          <div style={{ marginTop: 40 }}>
            <Link href={cta.href} className="btn btn--primary-inverse">
              {hero.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* The problem */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{problem.eyebrow}</span>
          <h2 className="heading-lg">{problem.header}</h2>
          <div className="prose" style={{ marginTop: 24 }}>
            {problem.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <blockquote
            className="pullquote"
            style={{ margin: "56px 0", padding: 0 }}
          >
            {problem.pullquote}
          </blockquote>
          <div className="prose">
            <p>{problem.after}</p>
          </div>
        </div>
      </section>

      {/* The spine */}
      <section className="section section--tint">
        <div className="container">
          <span className="eyebrow">{spine.eyebrow}</span>
          <h2 className="heading-lg">{spine.header}</h2>
          <p className="sub">{spine.intro}</p>
          <div className="steps" style={{ marginTop: 48 }}>
            {spine.steps.map((step, i) => (
              <div key={step.key} className={`step--${step.key}`}>
                <div className="step-marker">
                  <span className="step-marker__num">{i + 1}</span>
                  <span className="step-marker__line" />
                </div>
                <div className="card step-card">
                  <h3>{step.name}</h3>
                  <span className="step-card__tag">{step.tag}</span>
                  {step.body.map((p) => (
                    <p key={p.slice(0, 24)}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The operator */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{operator.eyebrow}</span>
          <h2 className="heading-lg">{operator.header}</h2>
          <div className="prose" style={{ marginTop: 24 }}>
            {operator.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <p className="standout" style={{ marginTop: 48 }}>
            {operator.standout}
          </p>
        </div>
      </section>

      {/* Offline */}
      <section className="section section--tint">
        <div className="container">
          <span className="eyebrow">{offline.eyebrow}</span>
          <h2 className="heading-lg">{offline.header}</h2>
          <div className="prose" style={{ marginTop: 24 }}>
            {offline.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <p>
              <strong>{offline.lead}</strong> {offline.after}
            </p>
          </div>
          <p className="standout" style={{ marginTop: 48 }}>
            {offline.standout}
          </p>
        </div>
      </section>

      {/* The engineer */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{engineer.eyebrow}</span>
          <h2 className="heading-lg">{engineer.header}</h2>
          <div className="prose" style={{ marginTop: 24 }}>
            {engineer.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="section section--tint">
        <div className="container">
          <span className="eyebrow">{proof.eyebrow}</span>
          <h2 className="heading-lg">{proof.header}</h2>
          <div className="prose" style={{ marginTop: 24 }}>
            <p>{proof.body}</p>
          </div>
          {proof.quote && (
            <figure
              className="card"
              style={{ marginTop: 32, padding: 32, maxWidth: 720 }}
            >
              <blockquote
                style={{
                  margin: 0,
                  fontSize: "var(--fs-lg)",
                  color: "var(--ink)",
                }}
              >
                {proof.quote.text}
              </blockquote>
              <figcaption className="eyebrow" style={{ marginTop: 16, marginBottom: 0 }}>
                {proof.quote.attribution}
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      {/* The platform */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{platform.eyebrow}</span>
          <h2 className="heading-lg">{platform.header}</h2>
          <div className="prose" style={{ marginTop: 24 }}>
            {platform.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section--dark">
        <ContourMotif />
        <div className="container section--tight" style={{ textAlign: "center" }}>
          <h2 className="heading-lg" style={{ color: "var(--cream)" }}>
            {closing.header}
          </h2>
          <p
            className="sub"
            style={{ marginInline: "auto", maxWidth: "40ch" }}
          >
            {closing.body}
          </p>
          <div style={{ marginTop: 36 }}>
            <Link href={cta.href} className="btn btn--primary-inverse">
              {closing.button}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
