import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { ParticipatePaths } from "@/components/ParticipatePaths";

export const metadata: Metadata = {
  title: "Participate",
  description:
    "How students, educators, researchers, industry, policymakers and community leaders can contribute to Beyond Syllabus: attend, submit ideas, share research, volunteer, nominate speakers, propose prototypes.",
};

export default function ParticipatePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="Public participation"
        title="Enter the conversation"
        lede="This process is only as good as the people in it. Pick who you are, and see exactly how you can contribute."
        className="mb-14"
      />
      <ParticipatePaths />
    </div>
  );
}
