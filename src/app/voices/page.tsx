import type { Metadata } from "next";
import { VoicesExplorer } from "@/components/VoicesExplorer";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Voices",
  description:
    "The speakers and contributors of Beyond Syllabus: students, educators, researchers, industry, policymakers, community leaders and global voices. Ideas over status.",
};

export default function VoicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="Voices · speakers & contributors"
        title="Ideas over status"
        lede="The people speaking into Beyond Syllabus, and more importantly what they bring. Every voice is documented with their contribution, their sessions, and where their ideas travel next."
        className="mb-14"
      />
      <VoicesExplorer />
    </div>
  );
}
