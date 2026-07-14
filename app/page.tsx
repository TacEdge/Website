import Link from "next/link";
import ContourMotif from "@/components/ContourMotif";
import WorkTypeIcon from "@/components/WorkTypeIcon";
import { cta } from "@/content/site";
import { basePath } from "@/lib/base-path";
import {
  hero,
  proofStrip,
  problem,
  workflow,
  record,
  workTypes,
  origin,
  closing,
} from "@/content/home";

const product = (file: string) => `${basePath}/product/${file}`;

function PhaseArrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 14h17M15 7l7 7-7 7" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="section--dark">
        <ContourMotif />
        <div className="container section hero">
          <div className="hero__copy">
            <h1 className="heading-xl hero__headline">{hero.headline}</h1>
            <p className="sub">{hero.subhead}</p>
            <p className="hero__tagline">{hero.tagline}</p>
            <div className="hero__actions">
              <Link href={cta.href} className="btn btn--primary-inverse">
                {hero.ctaPrimary}
              </Link>
              <a href="#workflow" className="btn btn--outline-inverse">
                {hero.ctaSecondary}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 4v12M4.5 10.5 10 16l5.5-5.5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="hero__visual">
            <div className="browser-frame hero__map">
              <div className="browser-frame__bar" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product("hero-map.webp")}
                alt="TacEdge project management view: spillway anchors plotted over a site photograph, with status filters and a selected anchor's drill and QA state"
                width={1800}
                height={1125}
              />
            </div>
            <div className="phone-frame hero__phone">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product("phone-drill-log.webp")}
                alt="TacEdge operator phone: drill log capture for anchor B12 with large depth entry controls"
                width={640}
                height={1918}
              />
            </div>
            <div className="float-card hero__record">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product("record-released.webp")}
                alt="TacEdge confirmed work item record: anchor B01 released to the engineer with depth, test result and five of five evidence requirements met"
                width={900}
                height={767}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Production proof strip */}
      <section className="proof-strip" aria-label="In production">
        <div className="container proof-strip__inner">
          <span className="proof-strip__label">{proofStrip.label}</span>
          <ul className="proof-strip__points">
            {proofStrip.points.map((p) => (
              <li key={p}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="10" cy="10" r="8.2" />
                  <path d="m6.4 10.3 2.4 2.4 4.8-5.2" />
                </svg>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The problem */}
      <section className="section">
        <div className="container problem">
          <div className="problem__main">
            <span className="eyebrow">{problem.eyebrow}</span>
            <h2 className="heading-lg">{problem.header}</h2>
            <div className="prose" style={{ marginTop: 24 }}>
              {problem.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </div>
          <div className="problem__aside">
            <blockquote className="pullquote">{problem.pullquote}</blockquote>
            <p className="problem__after">{problem.after}</p>
          </div>
        </div>
      </section>

      {/* Configure. Capture. Confirm. */}
      <section className="section section--tint" id="workflow">
        <div className="container">
          <div className="workflow-head">
            <h2 className="heading-lg">{workflow.header}</h2>
            <p className="sub" style={{ marginInline: "auto" }}>
              {workflow.subheader}
            </p>
          </div>

          <div className="phases">
            {workflow.phases.map((phase, i) => (
              <div className="phase-track" key={phase.key}>
                <article className={`phase phase--${phase.key}`}>
                  <div className="phase__head">
                    <span className="phase__num" aria-hidden="true">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="phase__title">{phase.title}</h3>
                      <p className="phase__descriptor">{phase.descriptor}</p>
                    </div>
                  </div>
                  <span className="phase__role">Role: {phase.role}</span>
                  <div className="phase__photo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product(phase.image.src)}
                      alt={phase.image.alt}
                      loading="lazy"
                      width={1100}
                      height={825}
                    />
                  </div>
                  <p className="phase__copy">{phase.copy}</p>
                  <ul className="phase__items">
                    {phase.items.map((item) => (
                      <li key={item}>
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="m4 10.6 3.8 3.8L16 6" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="phase__outcome">{phase.outcome}</p>
                </article>
                {i < workflow.phases.length - 1 && (
                  <div className="phase-handoff" aria-hidden="true">
                    <PhaseArrow />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* One connected record */}
          <aside className="record-strip card" aria-label="One connected record">
            <div className="record-strip__intro">
              <h3 className="heading-sm">{record.header}</h3>
              <p>{record.body}</p>
            </div>
            <div className="record-strip__flow">
              <span className="record-strip__id">{record.itemId}</span>
              <ol className="record-strip__stages">
                {record.stages.map((stage, i) => (
                  <li key={stage}>
                    <span className={`record-stage record-stage--${i}`}>
                      <b>{stage}</b>
                    </span>
                    {i < record.stages.length - 1 && (
                      <PhaseArrow className="record-strip__arrow" />
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      {/* Work types */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{workTypes.eyebrow}</span>
          <h2 className="heading-lg">{workTypes.header}</h2>
          <p className="sub">{workTypes.support}</p>
          <ul className="worktypes">
            {workTypes.types.map((t) => (
              <li className="card worktype" key={t}>
                <WorkTypeIcon type={t} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Origin */}
      <section className="section--dark">
        <ContourMotif />
        <div className="container section--tight origin">
          <div className="origin__copy">
            <span className="eyebrow">{origin.eyebrow}</span>
            <h2 className="heading-lg" style={{ color: "var(--cream)" }}>
              {origin.header}
            </h2>
            <div className="prose prose--dark" style={{ marginTop: 24 }}>
              {origin.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link href="/about" className="btn btn--primary-inverse">
                {origin.button}
              </Link>
            </div>
          </div>
          <div className="origin__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product(origin.image.src)}
              alt={origin.image.alt}
              loading="lazy"
              width={960}
              height={624}
            />
          </div>
        </div>
      </section>

      {/* Demonstration CTA */}
      <section className="section">
        <div className="container">
          <div className="cta-panel">
            <ContourMotif />
            <h2 className="heading-lg">{closing.header}</h2>
            <p className="sub" style={{ marginInline: "auto" }}>
              {closing.body}
            </p>
            <p className="cta-panel__support">{closing.support}</p>
            <div style={{ marginTop: 32 }}>
              <Link href={cta.href} className="btn btn--primary">
                {closing.button}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
