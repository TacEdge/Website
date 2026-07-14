import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Privacy · TACEDGE" };

export default function Privacy() {
  return <StubPage eyebrow="Privacy" title="Privacy policy." />;
}
