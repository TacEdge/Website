// Homepage copy — from the approved homepage refinement brief.
// Edit only against an approved copy revision.

export const hero = {
  label: "TACEDGE | GROUND ENGINEERING",
  headline: "Shared operational clarity for ground engineering.",
  subhead:
    "Set the project up once, capture the work where it happens, and release a confirmed record your engineer can trust.",
  tagline: "No chasing. No re-keying. No closeout reconstruction.",
  ctaPrimary: "Arrange a demonstration",
  ctaSecondary: "See the workflow",
};

export const proofStrip = {
  label: "Running now, on real work.",
  points: [
    "In production on drilling and anchoring projects",
    "Operating across sites in New Zealand and Samoa",
    "Developed with Rock Control as a ground-engineering field partner",
    "Shaped with field crews and project managers",
  ],
};

export const problem = {
  eyebrow: "The problem",
  header: "The record breaks at the handoff.",
  body: [
    "Logbooks, sign-on sheets, safety records and field notes begin at the workface, then get re-keyed and reinterpreted at every link in the chain. By the time the record reaches the project manager or engineer, it is late, incomplete or difficult to verify.",
    "Then comes the variation, the claim or project closeout, and the evidence needed was never captured cleanly at source.",
  ],
  pullquote:
    "Paper does not just slow the work. It weakens your commercial position.",
  after:
    "Most digital tools designed to replace paper are too complex at the point of use. When the crew returns to the logbook, the information chain breaks exactly where the work happens.",
};

export const workflow = {
  header: "Configure. Capture. Confirm.",
  subheader: "One connected workflow from project setup to verified delivery.",
  phases: [
    {
      key: "configure",
      title: "Configure",
      descriptor: "Set the project up once.",
      role: "Project Manager",
      copy: "The project manager defines the layout, work items, sequence, testing standards, evidence requirements and QA rules before the work reaches the field.",
      items: [
        "Project layout and work items",
        "Work plan and sequence",
        "Testing standards",
        "Evidence requirements",
        "QA and approval rules",
      ],
      outcome:
        "Everyone begins with the same definition of what must be delivered and what proof is required.",
      images: [
        {
          src: "configure-layout.webp",
          alt: "TacEdge project setup screen: operational zones drawn over a site photograph of a dam spillway, with a zone list panel alongside",
          frame: "panel" as const,
        },
      ],
    },
    {
      key: "capture",
      title: "Capture",
      descriptor: "Record the work where it happens.",
      role: "Operator",
      copy: "Operators capture field activity through simple, task-specific workflows. The configured project context is already present, so they record only what changed or what happened.",
      pmLine: "The operator records. The project manager sees.",
      items: [
        "Offline-first capture",
        "Simple task-specific forms",
        "Photos and evidence",
        "Live progress visibility",
        "Attention and exceptions",
      ],
      outcome: "The field record and management picture develop together.",
      images: [
        {
          src: "phone-drill-log.webp",
          alt: "TacEdge operator phone screen: drill log for anchor B12 with large depth entry buttons and lithology selection",
          frame: "phone" as const,
        },
        {
          src: "capture-board.webp",
          alt: "TacEdge project manager status board: anchors grouped by zone with drilled, tested and attention states visible live",
          frame: "panel" as const,
        },
      ],
    },
    {
      key: "confirm",
      title: "Confirm",
      descriptor: "Verify and release.",
      role: "Project Manager / Engineer",
      copy: "Submitted records enter the project manager's QA queue. Evidence, testing and completeness are checked before the record is confirmed and released to the engineer or client.",
      items: [
        "QA review and checks",
        "Evidence verification",
        "Testing review",
        "Confirm or return",
        "Controlled release",
        "Reporting and closeout",
      ],
      outcome:
        "The client sees a controlled record of verified delivery, not a collection of unchecked raw submissions.",
      images: [
        {
          src: "confirm-qa.webp",
          alt: "TacEdge QA queue: submitted anchor records ready to confirm, with anchor B17's evidence requirements all met and an approve action",
          frame: "panel" as const,
        },
      ],
    },
  ],
};

// One work item followed through the workflow. Data mirrors anchor B01 in the
// linked V2 prototype: configured to GA-17S, captured at 17.6 m, confirmed
// with 5 of 5 evidence, released in Release 003.
export const record = {
  header: "One work item. One connected record.",
  lines: [
    "What is configured becomes what is captured.",
    "What is captured becomes what is confirmed.",
  ],
  itemId: "Anchor B01",
  stages: [
    { name: "Configured", detail: "GA-17S · 17.5 m design" },
    { name: "Captured", detail: "17.6 m · J. Smith" },
    { name: "Confirmed", detail: "5 of 5 evidence · Pass" },
    { name: "Released", detail: "Engineer · Release 003" },
  ],
};

export const principles = {
  cards: [
    {
      key: "field",
      title: "Built for the field",
      header: "If the crew will not use it, nothing else matters.",
      copy: "TacEdge is designed around the person closest to the work: high contrast, large tap targets, clear labels and task-specific capture.",
      support:
        "A first-time operator should be able to begin capturing in seconds, without formal training.",
      image: {
        src: "phone-grout-log.webp",
        alt: "TacEdge operator phone screen: grout log with oversized add-bag buttons and a within-allowance usage check",
      },
    },
    {
      key: "offline",
      title: "Works offline",
      header: "The signal drops. The work does not.",
      copy: "A full shift can be captured on the device without connectivity. Records sync when the signal returns, and the project manager can always see how current the information is.",
      support: "Yesterday's information should never quietly present itself as live.",
      image: null,
    },
    {
      key: "engineers",
      title: "Trusted by engineers",
      header: "Confirmed before it reaches the engineer.",
      copy: "Engineers receive a controlled, read-only view of confirmed work. Status is visible at a glance, with evidence one click below.",
      support: "Reporting quality that supports variations, closeout and future work.",
      image: {
        src: "engineer-summary.webp",
        alt: "TacEdge engineer view: 14 of 54 anchors confirmed and released, with progress by zone and every released record confirmed",
      },
    },
    {
      key: "configured",
      title: "Configured for the work",
      header: "One workflow. Multiple work types.",
      copy: "TacEdge uses one common delivery spine, configured around the requirements of each type of ground-engineering work.",
      support: null,
      image: null,
    },
  ],
};

export const workTypes = {
  eyebrow: "Work types",
  header: "Configured for ground-engineering work.",
  support:
    "One configurable workflow, adapted to the information, evidence and quality requirements of each work type.",
  types: [
    "Anchoring",
    "Drilling",
    "Shotcrete",
    "Rockfall Protection",
    "Drainage",
    "Piling and Retaining",
  ],
};

export const origin = {
  eyebrow: "Our story",
  header: "Born from a real coordination gap.",
  body: [
    "TacEdge began during the Whakaari / White Island recovery operation in 2019, when a complex multi-agency plan had to be drawn on a whiteboard and transferred to a single PowerPoint slide.",
    "Experienced people delivered the operation, but there was no shared digital workspace through which everyone could see and maintain the same current picture.",
    "TacEdge exists to make shared clarity the normal way of working.",
  ],
  button: "Read our story",
};

export const closing = {
  header: "See it on a live project.",
  body: "Bring a current project, work type or reporting problem. In fifteen minutes, we will show you how TacEdge would structure it.",
  support: "Bring your engineer if useful.",
  button: "Arrange a demonstration",
};
