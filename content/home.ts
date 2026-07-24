// Homepage copy — from the approved homepage refinement brief (tightened
// revision). Edit only against an approved copy revision.

export const hero = {
  // The brand promise: two intentional lines on wide desktop.
  headlineLines: ["Shared", "Clarity."],
  category: "For ground-engineering delivery.",
  subhead:
    "One connected workflow from project setup to a smarter next project.",
  ctaPrimary: "Arrange a demonstration",
  ctaSecondary: "See the workflow",
};

export const problem = {
  eyebrow: "The problem",
  // Two intentional lines on wide desktop; wraps naturally below.
  headerLines: ["Field data becomes", "project overhead."],
  points: [
    {
      key: "fragmented",
      copy: "Field records arrive fragmented—or go missing.",
    },
    {
      key: "rekey",
      copy: "Project managers spend hours chasing, entering and reconciling the data into reports.",
    },
    {
      key: "late",
      copy: "Engineers receive delayed, reconstructed reports that are hard to verify.",
    },
  ],
  stages: [
    {
      key: "workface",
      name: "Workface",
      status: "Fragmented data",
      meta: "Paper · forms · apps · calls · photos",
    },
    {
      key: "pm",
      name: "Project manager",
      status: "Entered and compiled",
      meta: "Logs · spreadsheets · reports",
    },
    {
      key: "engineer",
      name: "Engineer",
      status: "Reconstructed report",
      meta: "Delayed · incomplete · hard to verify",
    },
  ],
  callout: "Project managers should assure the work—not assemble the report.",
  after:
    "Live, structured field data leaves the PM to review exceptions and release a trusted report.",
  cost: {
    title: "The cost of the current way",
    items: [
      { key: "late", label: "Hours or days of data entry" },
      { key: "xcirc", label: "Missing evidence" },
      { key: "calendar", label: "Delayed reports" },
      { key: "warn", label: "Higher risk. Lower margin." },
    ],
  },
};

export const workflow = {
  eyebrow: "The workflow",
  header: "Configure. Capture. Confirm. Compound.",
  subheader: "One connected workflow from project setup to a smarter next project.",
  phases: [
    {
      key: "configure",
      title: "Configure",
      descriptor: "Set the project up once.",
      role: "Project Manager",
      copy: "Define layout, sequence, testing and evidence before work reaches the field.",
      items: ["Project layout", "Work plan", "Testing rules"],
      outcome: "Everyone starts from the same definition.",
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
      copy: "Capture field activity in simple workflows with the project context already in place.",
      items: ["Offline-first capture", "Simple crew controls", "Photos and exceptions"],
      outcome: "The operator records once. The PM sees it live.",
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
      copy: "Submitted records enter QA before release to the engineer or client.",
      items: ["QA review", "Evidence verification", "Controlled release"],
      outcome: "The client receives a confirmed report.",
      image: {
        src: "photo-confirm-engineer.webp",
        alt: "Engineer at a desk reviewing a passed TACEDGE anchor test report on a desktop monitor",
      },
    },
    {
      key: "compound",
      title: "Compound",
      descriptor: "Start the next project smarter.",
      role: "Project Manager",
      copy: "Confirmed records improve future project layouts, checks and recommendations.",
      items: [
        "Lessons automatically carried forward",
        "Risks and evidence requirements surfaced earlier",
        "Templates continuously refined",
      ],
      outcome: "Every confirmed record improves what comes next.",
      image: {
        src: "tacedge-compound-recommendations.webp",
        alt: "TACEDGE recommending a configuration for the next project from confirmed records, with proposed anchor layout, testing and evidence changes ready to review and apply",
      },
    },
  ],
};

// Concluding panel beneath the workflow cards. Release stays an action
// within Confirm; Compound closes the loop back into configuration.
export const record = {
  header: "One work item. One connected record.",
  stages: [
    { key: "configured", label: "Configured" },
    { key: "captured", label: "Captured" },
    { key: "confirmed", label: "Confirmed" },
    { key: "compounded", label: "Compounded" },
  ],
};

export const workTypes = {
  eyebrow: "Work types",
  header: "One workflow. Configured to the work.",
  support:
    "Built first for anchoring and drilling. Adaptable to adjacent ground-engineering work.",
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
  headerLines: ["The plan existed.", "Shared clarity did not."],
  body: [
    "The idea for TACEDGE emerged during the 2019 Whakaari / White Island recovery operation.",
    "A complex multi-agency plan was drawn on a whiteboard and condensed into a single PowerPoint slide.",
  ],
  missing:
    "What was missing was one shared system to configure the plan, capture field activity as it happened, and confirm a trusted record.",
  missionLabel: "Mission",
  mission: "To bring shared clarity to the tactical edge.",
  builtLabel: "That’s why we built TACEDGE",
  // Same stages, same icons as the connected-record strip above.
  built: [
    { key: "configured", label: "Configure the plan." },
    { key: "captured", label: "Capture the activity." },
    { key: "confirmed", label: "Confirm the record." },
    { key: "compounded", label: "Compound the learning." },
  ],
  image: {
    src: "photo-whakaari-peaks.webp",
    alt: "Whakaari / White Island viewed from the water in 2019, with the TACEDGE brandmark peaks in front",
    caption: "Whakaari / White Island, 2019",
  },
};

export const closing = {
  header: "See TACEDGE on your project.",
  body: "Bring a current project or reporting problem. In 15 minutes, we’ll show how TACEDGE would structure the workflow.",
  support: "Bring your engineer if useful.",
  button: "Arrange a demonstration",
};
