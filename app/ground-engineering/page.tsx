import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Ground Engineering · TacEdge" };

export default function GroundEngineering() {
  return <StubPage eyebrow="Ground Engineering" title="Drilling and anchoring, on real work." />;
}
