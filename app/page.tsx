import Link from "next/link";
import ContourMotif from "@/components/ContourMotif";
import WorkTypeIcon from "@/components/WorkTypeIcon";
import { cta } from "@/content/site";
import { basePath } from "@/lib/base-path";
import {
  hero,
  problem,
  workflow,
  record,
  workTypes,
  origin,
  closing,
} from "@/content/home";

const product = (file: string) => `${basePath}/product/${file}`;

/* Outline icons for the problem section, matching the site's
   single-stroke icon language. Decorative: meaning is in the labels. */
const PROCESS_ICONS: Record<string, React.ReactNode> = {
  // Hard hat
  workface: (
    <>
      <path d="M4.5 15.5a7.5 7.5 0 0 1 15 0" />
      <path d="M3.5 15.5h17M10 8.5V6h4v2.5" />
    </>
  ),
  // Overlapping pages / fragmented records
  fragmented: (
    <>
      <rect x="8.5" y="8" width="11" height="12.5" rx="1.5" />
      <path d="M6 16.5V5.2A1.7 1.7 0 0 1 7.7 3.5H15" />
      <path d="M11.5 12.5h5M11.5 16h5" />
    </>
  ),
  // Spreadsheet grid
  rekey: (
    <>
      <rect x="4.5" y="5" width="15" height="14.5" rx="1.5" />
      <path d="M4.5 10h15M9.7 10v9.5M14.9 10v9.5" />
    </>
  ),
  // Clock
  late: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3 2.2" />
    </>
  ),
  // Person
  pm: (
    <>
      <circle cx="12" cy="8.4" r="3.4" />
      <path d="M5.5 20c.8-3.6 3.4-5.4 6.5-5.4s5.7 1.8 6.5 5.4" />
    </>
  ),
  // Person in a hard hat
  engineer: (
    <>
      <path d="M8.1 7.9a3.9 3.9 0 0 1 7.8 0v.5H8.1z" />
      <path d="M9.2 10.6a2.9 2.9 0 0 0 5.6 0" />
      <path d="M5.5 20c.8-3.4 3.4-5.2 6.5-5.2s5.7 1.8 6.5 5.2" />
    </>
  ),
  // Calendar
  calendar: (
    <>
      <rect x="4.5" y="6" width="15" height="14" rx="1.6" />
      <path d="M4.5 10.5h15M8.5 6V4M15.5 6V4" />
    </>
  ),
  // Cross in circle
  xcirc: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" />
    </>
  ),
  // Warning triangle
  warn: (
    <>
      <path d="M12 4.6 20.4 19H3.6z" />
      <path d="M12 10.2v3.8M12 16.6v.4" />
    </>
  ),
  // Clipboard with a single check
  clipcheck: (
    <>
      <rect x="6" y="4.5" width="12" height="16" rx="1.6" />
      <path d="M9.5 4.5V3h5v1.5" />
      <path d="m9 12.5 2 2 4-4.3" />
    </>
  ),
  // Dollar coin
  cost: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2v9.6M14.6 9.4c-.6-.9-1.6-1.4-2.6-1.4-1.4 0-2.4.8-2.4 1.9s.9 1.6 2.4 1.9 2.6.8 2.6 2-1.1 2-2.6 2c-1 0-2-.5-2.6-1.4" />
    </>
  ),
  // Shield with check
  record: (
    <>
      <path d="M12 3.2 19 5.8v5.3c0 4.3-2.9 7.7-7 9.6-4.1-1.9-7-5.3-7-9.6V5.8z" />
      <path d="m8.8 11.8 2.1 2.1 4.3-4.6" />
    </>
  ),
};

function ProcessIcon({ type }: { type: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PROCESS_ICONS[type]}
    </svg>
  );
}

/* Stage icons for the connected-record panel. Decorative: the labels
   carry the meaning. */
const RECORD_STAGE_ICONS: Record<string, React.ReactNode> = {
  // Plan grid
  configured: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  // Crosshair / capture target
  captured: (
    <>
      <circle cx="12" cy="12" r="5.6" />
      <circle cx="12" cy="12" r="1.4" />
      <path d="M12 3.8V6.4M12 17.6v2.6M3.8 12H6.4M17.6 12h2.6" />
    </>
  ),
  // Shield with check
  confirmed: (
    <>
      <path d="M12 3.2 19 5.8v5.3c0 4.3-2.9 7.7-7 9.6-4.1-1.9-7-5.3-7-9.6V5.8z" />
      <path d="m8.8 11.8 2.1 2.1 4.3-4.6" />
    </>
  ),
  // Circular refinement loop
  compounded: (
    <>
      <path d="M21.4 4.8v5h-5" />
      <path d="M19.8 14.6a8 8 0 1 1-1.9-8.4L21.4 9.8" />
    </>
  ),
};

function RecordStageIcon({ type, size = 18 }: { type: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {RECORD_STAGE_ICONS[type]}
    </svg>
  );
}

/* The one arrow used everywhere: buttons, process strips, card
   transitions and the record strip. One head, one stroke. */
function Arrow({
  size = 16,
  direction = "right",
  className,
}: {
  size?: number;
  direction?: "right" | "down";
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={direction === "down" ? { transform: "rotate(90deg)" } : undefined}
    >
      <path d="M4.5 12h15M13 5.5 19.5 12 13 18.5" />
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
            <h1 className="heading-xl hero__headline">
              {hero.headlineLines.map((line) => (
                <span className="hero__line" key={line}>
                  {line}{" "}
                </span>
              ))}
            </h1>
            <p className="hero__category">{hero.category}</p>
            <p className="sub">{hero.subhead}</p>
            <div className="hero__actions">
              <Link href={cta.href} className="btn btn--primary-inverse">
                {hero.ctaPrimary}
                <Arrow />
              </Link>
              <a href="#workflow" className="btn btn--outline-inverse">
                {hero.ctaSecondary}
                <Arrow direction="down" />
              </a>
            </div>
          </div>

          <figure
            className="hero__visual"
            aria-label="TACEDGE field capture feeding a desktop QA workflow where project records, evidence and test results can be reviewed and approved"
          >
            <div className="device-monitor hero__qa">
              <div className="device-monitor__screen">
                <span className="device-monitor__camera" aria-hidden="true" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product("tacedge-qa-queue-desktop-v2.webp")}
                  alt=""
                  width={1200}
                  height={872}
                />
              </div>
              <span className="device-monitor__neck" aria-hidden="true" />
              <span className="device-monitor__base" aria-hidden="true" />
            </div>
            <div className="device-phone hero__phone">
              <span className="device-phone__speaker" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product("tacedge-field-capture-b12-v3.webp")}
                alt=""
                width={720}
                height={1549}
              />
            </div>
          </figure>
        </div>
      </section>

      {/* The problem */}
      <section className="section--tight">
        <div className="container">
          <span className="eyebrow">{problem.eyebrow}</span>
          <div className="problem">
          <div className="problem__main">
            <h2 className="heading-lg problem__heading">
              {problem.headerLines.map((line) => (
                <span className="problem__hline" key={line}>
                  {line}{" "}
                </span>
              ))}
            </h2>
            <ul className="problem-points">
              {problem.points.map((point) => (
                <li key={point.key}>
                  <span className="problem-points__icon" aria-hidden="true">
                    <ProcessIcon type={point.key} />
                  </span>
                  <p>{point.copy}</p>
                </li>
              ))}
            </ul>
            <ol className="process">
              {problem.stages.map((stage, i) => (
                <li key={stage.key}>
                  <span className="process__icon">
                    <ProcessIcon type={stage.key} />
                  </span>
                  <span className="process__text">
                    <b>{stage.name}</b>
                    <small>{stage.status}</small>
                    <span className="process__meta">{stage.meta}</span>
                  </span>
                  {i < problem.stages.length - 1 && (
                    <Arrow className="process__arrow" size={22} />
                  )}
                </li>
              ))}
            </ol>
          </div>
          <div className="problem__aside">
            <h3 className="problem__callout">{problem.callout}</h3>
            <p className="problem__after">{problem.after}</p>
            <div className="cost">
              <div className="cost__head">
                <span className="cost__icon" aria-hidden="true">
                  <ProcessIcon type="cost" />
                </span>
                <b>{problem.cost.title}</b>
              </div>
              <ul className="cost__items">
                {problem.cost.items.map((item) => (
                  <li key={item.key}>
                    <span className="cost__ic" aria-hidden="true">
                      <ProcessIcon type={item.key} />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Configure. Capture. Confirm. */}
      <section className="section section--tint" id="workflow">
        <div className="container">
          <span className="eyebrow eyebrow--forest">{workflow.eyebrow}</span>
          <h2 className="heading-lg">{workflow.header}</h2>

          <ol className="phases">
            {workflow.phases.map((phase, i) => (
              <li className="phase-track" key={phase.key}>
                <article className={`phase phase--${phase.key}`}>
                  <div className="phase__head">
                    <span className="phase__glyph" aria-hidden="true">
                      <RecordStageIcon type={record.stages[i].key} size={30} />
                    </span>
                    <h3 className="phase__title">{phase.title}</h3>
                  </div>
                  <p className="phase__descriptor">{phase.descriptor}</p>
                  <div className="phase__role-slot">
                    <span className="phase__role">{phase.role}</span>
                  </div>
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
                  <p className="phase__outcome">{phase.outcome}</p>
                </article>
                {i < workflow.phases.length - 1 && (
                  <div className="phase-handoff" aria-hidden="true">
                    <Arrow size={28} />
                  </div>
                )}
              </li>
            ))}
          </ol>

          {/* One connected record — the conclusion of the workflow */}
          <aside className="record-panel" aria-label="One connected record">
            <div className="record-panel__intro">
              <h3 className="record-panel__headline">{record.header}</h3>
            </div>
            <ol className="record-panel__stages">
              {record.stages.map((stage, i) => (
                <li key={stage.key}>
                  <span className={`record-stage record-stage--${stage.key}`}>
                    <RecordStageIcon type={stage.key} />
                    <b>{stage.label}</b>
                  </span>
                  {i < record.stages.length - 1 && (
                    <Arrow className="record-panel__arrow" size={20} />
                  )}
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      {/* Work types */}
      <section className="section">
        <div className="container">
          <span className="eyebrow">{workTypes.eyebrow}</span>
          <h2 className="heading-lg">{workTypes.header}</h2>
          <p className="sub">{workTypes.support}</p>

          <ul className="worktypes-grid">
            {workTypes.types.map((t) => (
              <li className="card worktype-focus" key={t.name}>
                <span className="worktype__chip" aria-hidden="true">
                  <WorkTypeIcon type={t.name} />
                </span>
                <div className="worktype-focus__text">
                  <h3>{t.name}</h3>
                  <p>{t.copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Origin */}
      <section className="section--dark">
        <ContourMotif />
        <div className="container section--tight">
          <span className="eyebrow">{origin.eyebrow}</span>
          <div className="origin">
            <div className="origin__copy">
              <h2 className="heading-lg origin__heading">
                {origin.headerLines.map((line) => (
                  <span className="origin__hline" key={line}>
                    {line}{" "}
                  </span>
                ))}
              </h2>
              <div className="prose prose--dark" style={{ marginTop: 24 }}>
                {origin.body.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <p className="origin__missing">{origin.missing}</p>
            </div>
            <figure className="origin__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product(origin.image.src)}
                alt={origin.image.alt}
                loading="lazy"
                width={960}
                height={623}
              />
              <figcaption>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/brand/tacedge-brandmark-sage.svg`}
                  alt=""
                  width={16}
                  height={15}
                />
                {origin.image.caption}
              </figcaption>
            </figure>

            {/* That's why we built TACEDGE */}
            <div className="origin-built">
              <span className="origin-built__label">{origin.builtLabel}</span>
              <ol className="origin-built__row">
                {origin.built.map((item, i) => (
                  <li key={item.key}>
                    <span className="origin-built__icon" aria-hidden="true">
                      <RecordStageIcon type={item.key} size={30} />
                    </span>
                    <span className="origin-built__text">{item.label}</span>
                    {i < origin.built.length - 1 && (
                      <Arrow className="origin-built__arrow" size={22} />
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {/* The section finishes on the mission */}
            <div className="origin__mission-block">
              <span className="eyebrow origin__mission-label">
                {origin.missionLabel}
              </span>
              <div className="origin__mission">
                <span className="origin__mission-icon" aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${basePath}/brand/tacedge-brandmark-sage.svg`}
                    alt=""
                    width={44}
                    height={41}
                  />
                </span>
                <b>{origin.mission}</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demonstration CTA */}
      <section className="section--tight">
        <div className="container">
          <div className="cta-panel">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="cta-panel__photo"
              src={product("photo-capture-abseil.webp")}
              alt=""
              loading="lazy"
              aria-hidden="true"
            />
            <ContourMotif />
            <h2 className="heading-lg">{closing.header}</h2>
            <p className="sub" style={{ marginInline: "auto" }}>
              {closing.body}
            </p>
            <p className="cta-panel__support">{closing.support}</p>
            <div style={{ marginTop: 32 }}>
              <Link href={cta.href} className="btn btn--primary">
                {closing.button}
                <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
