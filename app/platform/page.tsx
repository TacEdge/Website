import type { Metadata } from "next";
import StubPage from "@/components/StubPage";

export const metadata: Metadata = { title: "Platform · TACEDGE" };

export default function Platform() {
  return <StubPage eyebrow="Platform" title="One workflow, from setup to release." />;
}
