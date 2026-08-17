import { Reveal } from "@/components/Reveal";

const stages = [
  { label: "What we heard", detail: "Every conversation documented — questions, agreements, disagreements.", href: "/conversations" },
  { label: "What we learned", detail: "Evidence and themes organised in the Capability Commons.", href: "/commons" },
  { label: "What we built", detail: "Ideas advanced into working prototypes in the lab.", href: "/prototypes" },
  { label: "What we recommend", detail: "Documentation and working prototypes, handed to the decision makers of every stakeholder group on Republic Day.", href: "/outcomes" },
];

export function OutcomePipeline() {
  return (
    <ol className="mt-12 space-y-0">
      {stages.map((stage, i) => (
        <Reveal as="li" key={stage.label} delay={i * 100}>
          <div className="grid gap-2 border-t-2 border-ink py-6 sm:grid-cols-[3rem_1fr_1.2fr] sm:items-baseline sm:gap-8">
            <span className="condensed text-sm font-semibold tracking-[0.2em] text-purple">
              0{i + 1}
            </span>
            <h3 className="display text-3xl text-ink sm:text-4xl">{stage.label}</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{stage.detail}</p>
          </div>
          {i < stages.length - 1 && (
            <div aria-hidden className="condensed pb-2 pl-1 text-2xl text-purple">↓</div>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
