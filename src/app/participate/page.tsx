import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";
import { ParticipatePaths } from "@/components/ParticipatePaths";
import { JoinTheConversation } from "@/components/JoinTheConversation";
import { VitruvianMark } from "@/components/VitruvianMark";
import { vitruvian } from "@/lib/vitruvian";

export const metadata: Metadata = {
  title: "Participate",
  description:
    "Join the Beyond Syllabus conversation: answer the movement's three questions, share your voice in public, and get your badge. Plus every other way to contribute, from research to prototypes.",
};

export default function ParticipatePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <div className="mb-10 grid items-center gap-8 lg:grid-cols-[1fr_18rem]">
        <SectionHeading
          kicker="The most important contribution"
          title="Join the conversation"
          lede="The record is built from voices. Answer the three questions every stakeholder group is answering, add your name, and become part of the public conversation. Share it forward and bring one more person in."
        />
        <figure className="hidden lg:block">
          <VitruvianMark
            className="w-full"
            title="The Vitruvian Student: a figure fitting the square of the syllabus while reaching for the circle of potential"
          />
          <figcaption className="mt-2 text-center font-serif text-sm italic text-ink-soft">
            {vitruvian.tagline}
          </figcaption>
        </figure>
      </div>
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
