// Homepage copy — from the approved homepage refinement brief (tightened
// revision). Edit only against an approved copy revision.

export const hero = {
  // The brand promise: two intentional lines on wide desktop.
  headlineLines: ["Shared", "Clarity."],
  category: "For ground-engineering delivery.",
  subhead:
    "Set the project up once. Capture the work where it happens. Give your engineer a confirmed report they can trust.",
  tagline: "No chasing. No re-keying. No rebuilding the report.",
  ctaPrimary: "Arrange a demonstration",
  ctaSecondary: "See the workflow",
};

export const problem = {
  eyebrow: "The problem",
  // Two intentional lines on wide desktop; wraps naturally below.
  headerLines: ["The project manager", "has to rebuild the record."],
  points: [
    {
      key: "sources",
      copy: "Field information arrives through paper, apps, calls, texts and photos—not as one live record.",
    },
    {
      key: "rekey",
      copy: "The project manager chases, reconciles and re-keys it into logs, spreadsheets and reports.",
    },
    {
      key: "late",
      copy: "By the time the engineer receives it, the information is already late.",
    },
  ],
  stages: [
    {
      key: "workface",
      name: "Workface",
      status: "Fragmented capture",
      meta: "Paper · apps · calls · texts · photos",
    },
    {
      key: "rekey",
      name: "Project manager",
      status: "Chased, re-keyed, compiled",
      meta: "Logs · spreadsheets · reports",
    },
    {
      key: "engineer",
      name: "Engineer",
      status: "Delayed report",
      meta: "Incomplete · hard to verify",
    },
  ],
  callout: "Project managers should check the work—not rebuild the report.",
  after:
    "Information should arrive structured, leaving the PM to review exceptions and release a trusted report.",
  cost: {
    title: "The cost of the current way",
    items: [
      "Hours lost re-keying",
      "Late, incomplete reports",
      "Higher risk, lower margins",
    ],
  },
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
        alt: "Project manager at a desktop in the office, setting up a work plan of anchors and zones over a site photograph in TACEDGE",
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
        alt: "Operator on ropes at a coastal rock face recording a drill log on a phone in TACEDGE, drill rig visible behind",
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
        alt: "Engineer at a desk reviewing a passed TACEDGE anchor test report on a desktop monitor",
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
  image: {
    src: "photo-whakaari-peaks.webp",
    alt: "Whakaari / White Island viewed from the water in 2019, with the TACEDGE brandmark peaks in front",
    caption: "Whakaari / White Island, 2019",
  },
};

export const closing = {
  header: "See TACEDGE on your project.",
  body: "Bring a current project, work type or reporting problem. In fifteen minutes, we'll show how TACEDGE would structure it.",
  support: "Bring your engineer if useful.",
  button: "Arrange a demonstration",
};
