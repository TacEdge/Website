// Homepage copy — from the approved homepage refinement brief (tightened
// revision). Edit only against an approved copy revision.

export const hero = {
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
    "Developed with ground engineering field partners",
    "Shaped with field crews and project managers",
  ],
};

export const problem = {
  eyebrow: "The problem",
  header: "The record breaks at the handoff.",
  body: [
    "Logbooks, sign-on sheets, safety records and field notes begin at the workface, then get re-keyed and reinterpreted at every link in the chain.",
    "By the time the record reaches the project manager or engineer, it is late, incomplete or difficult to verify.",
    "Then comes the variation, the claim or project closeout, and the evidence needed was never captured clearly at source.",
  ],
  pullquote:
    "Paper does not just slow the work. It weakens your commercial position.",
  after:
    "Most digital tools are too complex at the point of use. When the crew returns to the logbook, the information chain breaks exactly where the work happens.",
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
      copy: "The project manager defines the layout, work items, sequence, testing standards and evidence requirements before work reaches the field.",
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
      copy: "Operators capture field activity through simple, task-specific workflows. The configured project context is already in place.",
      items: [
        "Offline-first capture",
        "Large, simple field controls",
        "Photos, evidence and exceptions",
        "Live progress visibility",
      ],
      outcome: "The operator records. The project manager sees.",
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
      copy: "Submitted records enter the project manager's QA queue before release to the engineer or client.",
      items: [
        "QA review and checks",
        "Evidence verification",
        "Test review",
        "Controlled release",
      ],
      outcome: "The client sees a confirmed record, not unchecked raw submissions.",
      image: {
        src: "photo-confirm-engineer.webp",
        alt: "Engineer at a desk reviewing a passed TacEdge anchor test report on a desktop monitor",
      },
    },
  ],
};

export const record = {
  header: "One work item. One connected record.",
  body: "One planned item carries its setup, field capture, QA state and release history through the job.",
  itemId: "Anchor B01",
  stages: ["Configured", "Captured", "Confirmed", "Released"],
};

export const workTypes = {
  eyebrow: "Work types",
  header: "Configured for ground engineering work.",
  support:
    "One workflow, adapted to the information, evidence and quality requirements of each work type.",
  types: [
    "Anchoring",
    "Drilling",
    "Shotcrete",
    "Rockfall Protection",
    "Drainage",
    "Piling & Retaining",
  ],
};

export const origin = {
  eyebrow: "Our story",
  header: "Born from a real coordination gap.",
  body: [
    "TacEdge began during the Whakaari / White Island recovery operation in 2019, when a complex multi-agency plan had to be drawn on a whiteboard and transferred to a single PowerPoint slide.",
    "Experienced people delivered the operation, but there was no shared digital workspace where everyone could maintain the same current picture.",
    "TacEdge exists to make shared clarity the normal way of working.",
  ],
  button: "Read our story",
  image: {
    src: "photo-whakaari.webp",
    alt: "Whakaari / White Island steaming across the water, with the TacEdge brandmark peaks in front",
  },
};

export const closing = {
  header: "See it on a live project.",
  body: "Bring a current project, work type or reporting problem. In fifteen minutes, we'll show how TacEdge would structure it.",
  support: "Bring your engineer if useful.",
  button: "Arrange a demonstration",
};
