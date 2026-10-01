import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "About · TacEdge" };

export default function About() {
  return <StubPage eyebrow="About" title="Who is behind TacEdge." />;
}
