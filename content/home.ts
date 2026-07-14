// Homepage copy — from the approved homepage refinement brief (tightened
// revision). Edit only against an approved copy revision.

export const hero = {
  // Three intentional lines on wide desktop; wraps naturally on mobile.
  headlineLines: ["Shared operational", "clarity for ground", "engineering."],
  subhead:
    "Set the project up once, capture the work where it happens, and produce a confirmed record your engineer can trust.",
  tagline: "No chasing. No re-keying. No closeout reconstruction.",
  ctaPrimary: "Arrange a demonstration",
  ctaSecondary: "See the workflow",
};

export const proofStrip = {
  label: "Running now, on real work.",
  points: [
    "In production on drilling and anchoring projects",
    "Operating across sites in New Zealand and Samoa",
    "Developed with ground engineering contractors",
    "Used from field capture through to engineering closeout",
  ],
};

export const problem = {
  eyebrow: "The problem",
  // Two intentional lines on wide desktop; wraps naturally below.
  headerLines: ["The record breaks", "at the handover."],
  body: [
    "Logbooks, sign-on sheets, safety records and field notes begin at the workface, then get re-keyed and reinterpreted at every link in the chain. By the time the record reaches the project manager or engineer, it is often late, incomplete or difficult to verify.",
    "When the variation, claim or closeout arrives, the evidence needed was never captured clearly at source.",
  ],
  stages: [
    { key: "workface", name: "Workface", status: "Captured" },
    { key: "office", name: "Site office", status: "Re-keyed" },
    { key: "pm", name: "Project manager", status: "Delayed" },
    { key: "engineer", name: "Engineer", status: "Hard to verify" },
  ],
  callout: "Paper does not just slow the work. It puts your margin at risk.",
  after:
    "Most digital tools fail at the point of use. When crews fall back to the logbook, the information chain breaks exactly where the work happens.",
};

export const workflow = {
  eyebrow: "The workflow",
  header: "Configure. Capture. Confirm.",
  subheader: "One connected workflow from project setup to a confirmed record.",
  phases: [
    {
      key: "configure",
      title: "Configure",
      descriptor: "Set the project up once.",
      role: "Project Manager",
      copy: "The project manager defines the layout, work sequence, testing standards and evidence required before work reaches the field.",
      items: [
        "Project layout and work areas",
        "Work plan and sequence",
        "Testing and evidence rules",
      ],
      outcome: "Everyone begins with the same definition of what must be delivered.",
      image: {
        src: "photo-configure-pm.webp",
        alt: "Project manager at a desktop in the office, setting up a work plan of anchors and zones over a site photograph in TacEdge",
      },
    },
    {
      key: "capture",
      title: "Capture",
      descriptor: "Record the work where it happens.",
      role: "Operator",
      copy: "Operators capture field activity through simple, task-specific workflows with the project context already in place.",
      items: [
        "Offline-first field capture",
        "Simple controls for crews",
        "Photos, evidence and exceptions",
      ],
      outcome: "The operator records once. The project manager sees it live.",
      image: {
        src: "photo-capture-abseil.webp",
        alt: "Operator on ropes at a coastal rock face recording a drill log on a phone in TacEdge, drill rig visible behind",
      },
    },
    {
      key: "confirm",
      title: "Confirm",
      descriptor: "Verify and release.",
      role: "Project Manager / Engineer",
      copy: "Submitted records enter a controlled QA workflow before being released to the engineer or client.",
      items: [
        "QA review and checks",
        "Evidence and test verification",
        "Controlled release",
      ],
      outcome: "The client receives a confirmed record, not unchecked raw submissions.",
      image: {
        src: "photo-confirm-engineer.webp",
        alt: "Engineer at a desk reviewing a passed TacEdge anchor test report on a desktop monitor",
      },
    },
  ],
};

// Concluding panel beneath the workflow cards. Release stays an action
// within Confirm; it is never a fourth stage.
export const record = {
  header: "One work item. One connected record.",
  body: "Its setup, field evidence, QA status and release history remain connected from the workface through to closeout.",
  stages: [
    { key: "configured", label: "Configured" },
    { key: "captured", label: "Captured" },
    { key: "confirmed", label: "Confirmed" },
  ],
};

export const workTypes = {
  eyebrow: "Work types",
  header: "One workflow. Configured to the work.",
  support:
    "TACEDGE is being proven on anchoring and drilling projects, with the same connected record adaptable to adjacent ground-engineering workflows.",
  focusLabel: "Current focus",
  focus: [
    {
      name: "Anchoring",
      copy: "Hole drilling, bolt installation, grouting and proof testing.",
    },
    {
      name: "Drilling",
      copy: "Drill progress, depth tracking and lithology logging.",
    },
  ],
  adjacentLabel: "Adaptable to adjacent workflows",
  adjacent: ["Shotcrete", "Rockfall Protection", "Drainage", "Piling & Retaining"],
};

export const origin = {
  eyebrow: "Our story",
  // Two intentional lines on wide desktop; wraps naturally below.
  headerLines: ["Born from a real", "coordination gap."],
  body: [
    "The idea for TACEDGE emerged during the 2019 Whakaari / White Island recovery operation, when a complex multi-agency plan had to be drawn on a whiteboard and condensed into a single PowerPoint slide.",
    "The people involved were experienced. What was missing was a shared digital workspace where everyone could work from the same current picture—a coordination problem that also exists across complex field operations and ground-engineering delivery.",
  ],
  conclusion: "TACEDGE exists to make shared clarity the normal way of working.",
  button: "Read our story",
  image: {
    src: "photo-whakaari-island.webp",
    alt: "Whakaari / White Island viewed from the water in 2019, with the TACEDGE brandmark peaks in front",
    caption: "Whakaari / White Island, 2019",
  },
};

export const closing = {
  header: "See it on a live project.",
  body: "Bring a current project, work type or reporting problem. In fifteen minutes, we'll show how TacEdge would structure it.",
  support: "Bring your engineer if useful.",
  button: "Arrange a demonstration",
};
