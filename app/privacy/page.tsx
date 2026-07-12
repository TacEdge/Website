import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Privacy · TacEdge" };

export default function Privacy() {
  return <StubPage eyebrow="Privacy" title="Privacy policy." />;
}
