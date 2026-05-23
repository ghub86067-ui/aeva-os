import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Users, Globe2, Wand2, Image as ImageIcon, RefreshCw, Sparkles } from "lucide-react";
import { Shell } from "@/components/nexus/Shell";
import { ParticleField } from "@/components/nexus/ParticleField";
import { NeonButton } from "@/components/nexus/NeonButton";
import { SwipeTabs } from "@/components/nexus/SwipeTabs";
import { useIsMobile } from "@/hooks/use-mobile";

export const Route = createFileRoute("/novel")({
  head: () => ({
    meta: [
      { title: "Novel Studio — Nexus" },
      { name: "description", content: "Cinematic AI novel studio with plot tree, focus editor, and prompt core." },
    ],
  }),
  component: NovelPage,
});

const plotNodes = [
  { id: "p1", label: "Cold Open", x: 12, y: 70, kind: "scene" },
  { id: "p2", label: "Inciting Spark", x: 30, y: 38, kind: "beat" },
  { id: "p3", label: "Mirrorhall", x: 52, y: 62, kind: "scene" },
  { id: "p4", label: "Vow of Ash", x: 70, y: 26, kind: "beat" },
  { id: "p5", label: "Final Bloom", x: 86, y: 54, kind: "climax" },
];
const edges: [string, string][] = [["p1","p2"],["p2","p3"],["p3","p4"],["p2","p4"],["p4","p5"]];

const characters = [
  { name: "Vera Coen", role: "Protagonist", arc: 0.62 },
  { name: "Halden", role: "Foil", arc: 0.38 },
  { name: "The Curator", role: "Antagonist", arc: 0.81 },
];

const tones = ["Cinematic", "Lyrical", "Spare", "Baroque", "Hardboiled"];

function NovelPage() {
  const [tone, setTone] = useState("Cinematic");
  const [text, setText] = useState(
    "The hall remembered everyone who had ever walked through it, and tonight it remembered Vera with the slow patience of something that had nowhere else to be.",
  );
  const isMobile = useIsMobile();

  const plotPanel = (
    <aside className="glass relative flex h-full flex-col gap-5 overflow-y-auto rounded-2xl p-4 md:rounded-3xl md:p-5">
      <Section icon={GitBranch} title="Plot tree" sub="act II · revision 4">
        <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-white/5 bg-black/40">
          <ParticleField count={12} />
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {edges.map(([a, b], i) => {
              const A = plotNodes.find((n) => n.id === a)!;
              const B = plotNodes.find((n) => n.id === b)!;
              return (
                <motion.line
                  key={i}
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke="oklch(0.78 0.22 135 / 0.5)" strokeWidth={0.4}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, delay: i * 0.15 }}
                />
              );
            })}
          </svg>
          {plotNodes.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
            >
              <div className={`h-3 w-3 rounded-full ${n.kind === "climax" ? "bg-[oklch(0.78_0.22_135)] shadow-[0_0_14px_oklch(0.78_0.22_135)]" : "bg-[oklch(0.7_0.09_185)] shadow-[0_0_10px_oklch(0.7_0.09_185)]"}`} />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.2em] text-foreground/60">
                {n.label}
              </span>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section icon={Users} title="Characters">
        <div className="space-y-3">
          {characters.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-white/5 bg-black/30 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-medium">{c.name}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/40">{c.role}</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.arc * 100}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[oklch(0.7_0.09_185)] to-[oklch(0.78_0.22_135)]"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section icon={Globe2} title="World nodes">
        <div className="flex flex-wrap gap-2">
          {["Mirrorhall", "Ash Vow", "The Curator", "Lowtide", "Glass Choir"].map((t) => (
            <span key={t} className="rounded-full border border-white/8 bg-black/30 px-2.5 py-1 font-mono text-[10px] text-foreground/60 hover:border-[oklch(0.78_0.22_135_/_0.5)] hover:text-[oklch(0.78_0.22_135)]">
              ◇ {t}
            </span>
          ))}
        </div>
      </Section>
    </aside>
  );

  const editorPanel = (
    <section className="glass relative flex h-full flex-col overflow-hidden rounded-2xl md:rounded-3xl">
      <ParticleField count={18} />
      <div className="relative flex items-center justify-between border-b border-white/5 px-4 py-3 md:px-8 md:py-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.7_0.09_185)]">chapter 04</div>
          <div className="mt-1 font-display text-lg font-light tracking-tight md:text-2xl">The hall that remembered</div>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40 md:gap-3 md:text-[10px] md:tracking-[0.25em]">
          <span>{text.split(/\s+/).length} words</span>
          <span className="hidden text-[oklch(0.78_0.22_135)] sm:inline">● focus</span>
        </div>
      </div>
      <div className="relative flex-1 overflow-y-auto px-5 py-6 md:px-20 md:py-12">
        <motion.textarea
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-full w-full resize-none bg-transparent font-serif text-lg leading-[1.75] text-foreground/90 focus:outline-none md:text-xl md:leading-[1.85]"
          style={{ caretColor: "oklch(0.78 0.22 135)" }}
          placeholder="Begin the scene…"
        />
      </div>
    </section>
  );

  const promptPanel = (
    <aside className="glass relative flex h-full flex-col gap-5 overflow-y-auto rounded-2xl p-4 md:rounded-3xl md:p-5">
      <Section icon={Sparkles} title="Prompt core">
        <textarea
          rows={4}
          defaultValue="Rewrite with tightened sensory detail and a colder narrative distance."
          className="w-full resize-none rounded-xl border border-white/8 bg-black/40 p-3 text-sm text-foreground/80 focus:border-[oklch(0.78_0.22_135_/_0.5)] focus:outline-none"
        />
        <div className="mt-3 flex gap-2">
          <NeonButton size="sm" className="flex-1"><Wand2 className="h-3.5 w-3.5" /> Generate</NeonButton>
          <NeonButton size="sm" variant="titanium"><RefreshCw className="h-3.5 w-3.5" /></NeonButton>
        </div>
      </Section>

      <Section icon={RefreshCw} title="Tone presets">
        <div className="flex flex-wrap gap-2">
          {tones.map((t) => {
            const active = t === tone;
            return (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={
                  "rounded-full border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-all touch-target " +
                  (active
                    ? "border-[oklch(0.78_0.22_135_/_0.6)] bg-[oklch(0.78_0.22_135_/_0.1)] text-[oklch(0.85_0.2_135)] shadow-[0_0_18px_-4px_oklch(0.78_0.22_135_/_0.7)]"
                    : "border-white/8 bg-black/30 text-foreground/55 hover:border-[oklch(0.7_0.09_185_/_0.5)]")
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </Section>

      <Section icon={ImageIcon} title="Cover art">
        <div className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-white/8 bg-gradient-to-br from-[oklch(0.18_0.05_240)] via-[oklch(0.12_0.04_280)] to-[oklch(0.08_0.02_220)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(0.78_0.22_135_/_0.4),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(0.7_0.09_185_/_0.35),transparent_60%)]" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-[oklch(0.78_0.22_135)]">draft 03</div>
            <div className="mt-1 font-display text-base text-foreground">The Mirrorhall</div>
          </div>
        </div>
        <NeonButton size="sm" variant="titanium" className="mt-3 w-full">
          <Wand2 className="h-3.5 w-3.5" /> Regenerate cover
        </NeonButton>
      </Section>
    </aside>
  );

  if (isMobile) {
    return (
      <Shell maxWidth="1640px">
        <div className="flex h-[calc(100dvh-9.5rem)] min-h-0 flex-col">
          <SwipeTabs
            tabs={[
              { id: "plot", label: "Plot", content: plotPanel },
              { id: "editor", label: "Editor", content: editorPanel },
              { id: "prompt", label: "Prompt", content: promptPanel },
            ]}
            initial="editor"
          />
        </div>
      </Shell>
    );
  }

  return (
    <Shell maxWidth="1640px">
      <div className="grid h-[calc(100dvh-8rem)] gap-5 lg:grid-cols-[320px_1fr_340px]">
        {plotPanel}
        {editorPanel}
        {promptPanel}
      </div>
    </Shell>
  );
}

function Section({ icon: Icon, title, sub, children }: { icon: any; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.7_0.09_185)]">
          <Icon className="h-3 w-3" /> {title}
        </div>
        {sub && <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/40">{sub}</span>}
      </div>
      {children}
    </div>
  );
}
