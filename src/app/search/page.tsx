import type { Metadata } from "next";
import { buildSearchIndex } from "@/lib/search";
import { SearchExplorer } from "@/components/SearchExplorer";
import { Kicker } from "@/components/ui";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the entire Beyond Syllabus public record — sessions, voices, transcripts, topics, ideas, prototypes and recommendations.",
};

export default function SearchPage() {
  const index = buildSearchIndex();
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <Kicker>Global search</Kicker>
      <h1 className="display mt-4 text-6xl sm:text-8xl">
        Find it<span className="text-purple">.</span>
      </h1>
      <div className="mt-10">
        <SearchExplorer index={index} />
      </div>
    </div>
  );
}
