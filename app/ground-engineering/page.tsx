import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Ground Engineering · TAC-EDGE" };

export default function GroundEngineering() {
  return <StubPage eyebrow="Ground Engineering" title="Drilling and anchoring, on real work." />;
}
