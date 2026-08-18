import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { ParticipatePaths } from "@/components/ParticipatePaths";
import { JoinTheConversation } from "@/components/JoinTheConversation";

export const metadata: Metadata = {
  title: "Participate",
  description:
    "Join the Beyond Syllabus conversation: answer the movement's three questions, share your voice in public, and get your badge. Plus every other way to contribute, from research to prototypes.",
};

export default function ParticipatePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="The most important contribution"
        title="Join the conversation"
        lede="The record is built from voices. Answer the three questions every stakeholder group is answering, add your name, and become part of the public conversation. Share it forward and bring one more person in."
        className="mb-10"
      />
      <JoinTheConversation />

      <SectionHeading
        kicker="More ways to contribute"
        title="Pick your path"
        lede="This process is only as good as the people in it. Pick who you are, and see exactly how you can contribute."
        className="mb-14 mt-24"
      />
      <ParticipatePaths />
    </div>
  );
}
