import type { Metadata } from "next";
import { ConversationsExplorer } from "@/components/ConversationsExplorer";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Conversations",
  description:
    "The documented record of every major Beyond Syllabus discussion: video, summaries, transcripts, key questions, agreements, disagreements and proposed solutions.",
};

export default function ConversationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        kicker="The public record"
        title="Conversations"
        lede="Every major discussion becomes publicly accessible: what was asked, what was agreed, what was disputed, and what was proposed. Filter by stakeholder, event or topic, or search the record."
        className="mb-14"
      />
      <ConversationsExplorer />
    </div>
  );
}
