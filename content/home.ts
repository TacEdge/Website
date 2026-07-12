// Homepage copy — locked in the master brief (§7). Use verbatim.
// Edit only against an approved copy revision.

export const hero = {
  headline: "Reporting your engineer trusts on sight.",
  subhead:
    "TacEdge is the field platform for geotechnical construction. Set the project up once, capture the work where it happens, and release a confirmed record. No chasing, no re-keying, no reconstruction at closeout.",
  cta: "Arrange a demonstration",
};

export const problem = {
  eyebrow: "The problem",
  header: "Paper doesn't just slow the job.",
  body: [
    "Logbooks. Sign-on sheets. Safety checklists. The record starts on paper at the rig and gets re-keyed at every link in the chain, arriving late, thinned out, and questioned by the time it reaches the engineer.",
    "Then comes the variation. Or the claim. Or closeout. And the evidence you need was never captured cleanly at source.",
  ],
  pullquote:
    "Paper doesn't just slow the work. It weakens your commercial position.",
  after:
    "The digital tools built to fix this are too clunky and overbuilt for the people holding them. So they go unused, and the crew goes back to paper, exactly where the chain breaks.",
};

export const spine = {
  eyebrow: "The spine",
  header: "One workflow, from setup to release.",
  intro:
    "TacEdge runs a project on a single spine. Configure it once. Capture the field as it happens. Confirm it against your standard, and release it to the engineer.",
  steps: [
    {
      key: "configure",
      name: "Configure",
      tag: "Set the project up once.",
      body: [
        "Zones, anchor designs, testing standards, evidence requirements, safety documents. You define what the job is, and what “done” and “passing” mean, before anyone reaches site.",
        "Everything downstream inherits it. Nobody re-enters a specification, ever.",
      ],
    },
    {
      key: "capture",
      name: "Capture",
      tag: "Capture field reality.",
      body: [
        "The operator records the anchor in front of them: depth, lithology, grout, test result. The design context is already on screen, read-only. Variance against design is computed, not worked out by hand. If something went wrong, one action declares it and the PM knows immediately.",
      ],
    },
    {
      key: "release",
      name: "Confirm & Release",
      tag: "By the time the works are finished, so is the record.",
      body: [
        "Submitted work lands in the PM's queue and is checked against the evidence requirements set at Configure. Confirm it, or hand it back. Only confirmed work can be released, so nothing reaches the engineer under-evidenced.",
        "The report assembles from the live record. Closeout is packaged, not reconstructed.",
      ],
    },
  ],
};

export const operator = {
  eyebrow: "The operator",
  header: "If the crew won't use it, nothing else matters.",
  body: [
    "You have probably bought site software before. It had every feature, and the crew were back on the logbook within a fortnight.",
    "The operator is the least incentivised person in the chain and carries all of the switching cost. So TacEdge is built for them first: high contrast, large type, big targets, for gloved hands, a wet screen and direct sun. The capture screen shows only what varies. Everything else is inherited, and quiet.",
  ],
  standout:
    "The bar: a cold operator starts capturing in seconds, with no training, and it beats the logbook it replaces.",
};

export const offline = {
  eyebrow: "Offline",
  header: "The signal drops. The work doesn't.",
  body: [
    "Most field tools stall when the signal goes. The form won't load, the crew reaches for the logbook, and the chain breaks exactly where the work happens.",
    "TacEdge captures a full shift on the device with no connectivity, and syncs when the signal returns. Nothing is lost. Paper is never the fallback.",
  ],
  lead: "And the part most tools get wrong:",
  after:
    "the PM is always told the truth about what they are looking at. Every record carries its freshness, fresh, ageing or stale, and anything captured offline or back-dated is marked as such, so it never reads as live.",
  standout:
    "A status board that quietly shows you yesterday is worse than no status board at all.",
};

export const engineer = {
  eyebrow: "The engineer",
  header: "Trusted on sight.",
  body: [
    "The engineer gets their own read-only view: confirmed work only, curated by you, released when you release it. Status at a glance, evidence one click down.",
    "No chasing. No calls to reconcile the logs. No argument about what was actually done.",
    "That is the commercial edge. Reporting quality that wins work, evidence that holds under a variation, and a closeout that doesn't have to be rebuilt from memory.",
  ],
};

export const proof = {
  eyebrow: "In production",
  header: "Running now, on real work.",
  body: "TacEdge was built with Rock Control as beachhead partner, on live work, not in a workshop. It is in production on drilling and anchoring, across sites in New Zealand and in Samoa.",
  // Rock Control quote to be inserted once supplied in writing.
  // Nothing further about the nature or sector of the work.
  quote: null as null | { text: string; attribution: string },
};

export const platform = {
  eyebrow: "The platform",
  header: "One spine. More work types. More sectors.",
  body: [
    "Geotechnical work spans many work types. TacEdge scales by configuring one shared workflow, not by building a product per type, so new work types onboard as configuration rather than rebuild.",
    "That same spine carries the platform beyond ground engineering. Aviation, forestry and search and rescue follow. Ground engineering first.",
  ],
};

export const closing = {
  header: "See it on a live project.",
  body: "Fifteen minutes, on real work, with your work types. Bring your engineer if you like.",
  button: "Arrange a demonstration",
};
