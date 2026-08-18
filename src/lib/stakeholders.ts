import type { StakeholderGroup } from "@/lib/types";

/*
 * Single source of truth for stakeholder groups. The labels record drives
 * everything else — the canonical list and the runtime guard are derived
 * from it, so adding a group is a one-line change here (plus the type
 * union in types.ts, which the compiler will point at).
 *
 * Deliberately dependency-free: safe to import from client components
 * without dragging any content data into the bundle.
 */
export const stakeholderLabels: Record<StakeholderGroup, string> = {
  students: "Students",
  educators: "Educators",
  researchers: "Researchers",
  industry: "Industry",
  policymakers: "Policymakers",
  community: "Community Leaders",
  global: "Global Voices",
};

/** Singular forms, for labelling one person ("Student", not "Students"). */
export const stakeholderSingular: Record<StakeholderGroup, string> = {
  students: "Student",
  educators: "Educator",
  researchers: "Researcher",
  industry: "Industry",
  policymakers: "Policymaker",
  community: "Community Leader",
  global: "Global Voice",
};

export const STAKEHOLDER_GROUPS = Object.keys(stakeholderLabels) as StakeholderGroup[];

export function isStakeholderGroup(value: unknown): value is StakeholderGroup {
  return typeof value === "string" && value in stakeholderLabels;
}
