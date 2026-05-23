import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Rocket, Check, X, Activity, Brain, Terminal, Plus, Minus, Send, Square, Sparkles } from "lucide-react";
import { Shell } from "@/components/nexus/Shell";
import { ParticleField } from "@/components/nexus/ParticleField";
import { NeonButton } from "@/components/nexus/NeonButton";
import { useAeva } from "@/lib/aeva-context";
import { getModel } from "@/lib/models";

export const Route = createFileRoute("/dev")({
  head: () => ({
    meta: [
      { title: "Dev Studio — Nexus" },
      { name: "description", content: "Cinematic AI dev studio · live analytics, diff review, and staging deploy." },
    ],
  }),
  component: DevPage,
});

const diffLines: { kind: "add" | "del" | "ctx"; text: string }[] = [
  { kind: "ctx", text: "export function resolve(query: string) {" },
  { kind: "del", text: "  return cache.get(query) ?? naive(query);" },
  { kind: "add", text: "  const hit = cache.get(query);" },
  { kind: "add", text: "  if (hit) return hit;" },
  { kind: "add", text: "  const out = await neural.resolve(query, { stream: true });" },
  { kind: "add", text: "  cache.set(query, out);" },
  { kind: "add", text: "  return out;" },
  { kind: "ctx", text: "}" },
];

function DevPage() {
  const [logs, setLogs] = useState<string[]>([
    "[00:00.012] ▶ socket open · dev-west",
    "[00:00.041] ◢ orchestrator: 4 tasks queued",
    "[00:00.072] ◣ patch.v18 staged",
  ]);
  const { modelId, generating, setGenerating, stopRequested, clearStop, requestStop } = useAeva();
  const model = getModel(modelId);
  const [prompt, setPrompt] = useState("");
  const [transcript, setTranscript] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: `// ${model?.label ?? "core"} online — describe a code change and I'll patch the workspace.` },
  ]);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => {
      const stamps = ["▶ inference 184k tok/s", "◢ memory checkpoint", "◣ task graph re-balanced", "▶ webhook · github sync"];
      setLogs((l) => [
        ...l.slice(-10),
        `[00:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}.${String(Math.floor(Math.random() * 999)).padStart(3, "0")}] ${stamps[Math.floor(Math.random() * stamps.length)]}`,
      ]);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Simulated streaming generator with stop support
  useEffect(() => {
    if (!generating) return;
    const tokens = [
      "scanning workspace graph…",
      " resolving ast nodes…",
      " drafting patch hunks…",
      " applying diff to src/resolver.ts…",
      " verifying type contracts…",
      " ✓ patch ready for staging.",
    ];
    let i = 0;
    setTranscript((t) => [...t, { role: "ai", text: "" }]);
    const tick = setInterval(() => {
      if (stopRequested) {
        setTranscript((t) => {
          const copy = [...t];
          copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + " ⏹ generation halted." };
          return copy;
        });
        setGenerating(false);
        clearStop();
        clearInterval(tick);
        return;
      }
      if (i >= tokens.length) {
        setGenerating(false);
        clearInterval(tick);
        return;
      }
      setTranscript((t) => {
        const copy = [...t];
        copy[copy.length - 1] = { ...copy[copy.length - 1], text: copy[copy.length - 1].text + tokens[i] };
        return copy;
      });
      i += 1;
    }, 480);
    return () => clearInterval(tick);
  }, [generating, stopRequested, setGenerating, clearStop]);

  useEffect(() => {
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript]);

  function send() {
    if (!prompt.trim() || generating) return;
    setTranscript((t) => [...t, { role: "user", text: prompt }]);
    setPrompt("");
    setGenerating(true);
  }

  function autosize() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  }

  return (
    <Shell maxWidth="1640px">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Live analytics */}
        <section className="glass relative overflow-hidden rounded-3xl p-6">
          <Header eyebrow="// telemetry" title="Live monitoring grid" right={<LiveBadge />} />
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {[
              { l: "Throughput", v: "184k", u: "tok/s" },
              { l: "p99", v: "38", u: "ms" },
              { l: "Tasks", v: "1,284", u: "live" },
              { l: "Uptime", v: "99.998", u: "%" },
            ].map((m, i) => (
              <motion.div
                key={m.l}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-2xl border border-white/5 bg-black/30 p-4"
              >
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/40">{m.l}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="font-display text-3xl font-light">{m.v}</span>
                  <span className="font-mono text-[10px] text-foreground/40">{m.u}</span>
                </div>
                <WebsocketBars />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Deploy panel */}
        <section className="glass relative flex flex-col gap-4 overflow-hidden rounded-3xl p-6">
          <ParticleField count={10} />
          <Header eyebrow="// release" title="Staging" />
          <div className="rounded-xl border border-white/5 bg-black/40 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">
                <GitBranch className="h-3 w-3" /> feat/neural-cache
              </div>
              <span className="font-mono text-[9px] text-[oklch(0.78_0.22_135)]">+ 18 / − 4</span>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-foreground/60">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[oklch(0.78_0.22_135)] to-[oklch(0.7_0.09_185)] shadow-[0_0_14px_oklch(0.78_0.22_135_/_0.7)]" />
              <div>
                <div className="font-mono text-[10px] text-foreground/80">patch.v18 · vera</div>
                <div className="font-mono text-[9px] text-foreground/40">commit 7af3 · 2 min ago</div>
              </div>
            </div>
          </div>
          <NeonButton size="lg" className="w-full">
            <Rocket className="h-4 w-4" /> Approve &amp; deploy to staging
          </NeonButton>
          <div className="flex gap-2">
            <NeonButton size="sm" variant="ghost" className="flex-1"><X className="h-3.5 w-3.5" /> Reject</NeonButton>
            <NeonButton size="sm" variant="titanium" className="flex-1"><Check className="h-3.5 w-3.5" /> Hold</NeonButton>
          </div>
        </section>

        {/* Diff viewer */}
        <section className="glass relative overflow-hidden rounded-3xl p-0 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60">
              <Terminal className="h-3 w-3" /> src/resolver.ts · patch review
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px]">
              <span className="text-[oklch(0.78_0.22_135)]">+6 added</span>
              <span className="text-[oklch(0.62_0.24_25)]">−1 removed</span>
            </div>
          </div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed">
            {diffLines.map((line, i) => {
              const bg =
                line.kind === "add"
                  ? "bg-[oklch(0.78_0.22_135_/_0.08)] border-l-2 border-[oklch(0.78_0.22_135)]"
                  : line.kind === "del"
                    ? "bg-[oklch(0.62_0.24_25_/_0.08)] border-l-2 border-[oklch(0.62_0.24_25)]"
                    : "border-l-2 border-transparent";
              const Icon = line.kind === "add" ? Plus : line.kind === "del" ? Minus : null;
              const color = line.kind === "add" ? "text-[oklch(0.85_0.2_135)]" : line.kind === "del" ? "text-[oklch(0.7_0.22_25)]" : "text-foreground/60";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                  className={`flex items-center gap-3 px-3 py-1 ${bg} ${color}`}
                >
                  <span className="w-6 text-right font-mono text-[10px] text-foreground/30">{i + 1}</span>
                  <span className="w-4">{Icon && <Icon className="h-3 w-3" />}</span>
                  <span>{line.text}</span>
                </motion.div>
              );
            })}
          </pre>
        </section>

        {/* Orchestration + memory */}
        <section className="glass relative overflow-hidden rounded-3xl p-6">
          <Header eyebrow="// orchestrator" title="AI task graph" />
          <div className="mt-5 space-y-3">
            {[
              { name: "Resolve neural cache", agent: "atlas-r1", state: "running" },
              { name: "Verify type contracts", agent: "forge-code", state: "queued" },
              { name: "Spin staging shard", agent: "edge-synapse", state: "running" },
              { name: "Snapshot memory", agent: "vault", state: "done" },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-black/30 p-3"
              >
                <span className={`h-2 w-2 rounded-full ${
                  t.state === "running" ? "bg-[oklch(0.78_0.22_135)] shadow-[0_0_10px_oklch(0.78_0.22_135)] animate-pulse"
                  : t.state === "done" ? "bg-[oklch(0.7_0.09_185)]"
                  : "bg-foreground/30"
                }`} />
                <div className="flex-1">
                  <div className="font-display text-sm">{t.name}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">agent · {t.agent}</div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">{t.state}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="glass relative overflow-hidden rounded-3xl p-6">
          <Header eyebrow="// memory" title="Workspace memory" right={<Brain className="h-4 w-4 text-[oklch(0.7_0.09_185)]" />} />
          <div className="mt-5 grid grid-cols-8 gap-1.5">
            {Array.from({ length: 64 }).map((_, i) => {
              const v = Math.random();
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.008 }}
                  className="aspect-square rounded"
                  style={{
                    background: v > 0.7
                      ? "oklch(0.78 0.22 135 / 0.7)"
                      : v > 0.4
                      ? "oklch(0.7 0.09 185 / 0.45)"
                      : "oklch(0.3 0.04 240 / 0.4)",
                    boxShadow: v > 0.85 ? "0 0 8px oklch(0.78 0.22 135 / 0.9)" : undefined,
                  }}
                />
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            <span>tokens · 184k / 1.2M</span>
            <span className="text-[oklch(0.78_0.22_135)]">14 hot regions</span>
          </div>
        </section>

        {/* Live log stream */}
        <section className="glass relative overflow-hidden rounded-3xl p-0 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60">
              <Activity className="h-3 w-3" /> ws://nexus/stream
            </div>
            <LiveBadge />
          </div>
          <div className="h-44 overflow-hidden p-5 font-mono text-xs text-foreground/70">
            <AnimatePresence initial={false}>
              {logs.map((l, i) => (
                <motion.div
                  key={i + l}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className={i === logs.length - 1 ? "text-[oklch(0.78_0.22_135)]" : ""}
                >
                  {l}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>

      {/* Interactive code prompt — terminal style */}
      <section className="glass relative mt-5 overflow-hidden rounded-3xl">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-3">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/60">
            <Terminal className="h-3 w-3" style={{ color: "var(--neon)" }} />
            aeva://dev-studio · interactive shell
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
            <span className="hidden sm:inline text-foreground/40">core ·</span>
            <span style={{ color: "var(--neon)" }}>{model?.label ?? "—"}</span>
          </div>
        </div>

        <div
          ref={transcriptRef}
          className="max-h-72 min-h-[180px] overflow-y-auto px-5 py-4 font-mono text-xs leading-relaxed"
        >
          <AnimatePresence initial={false}>
            {transcript.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className={"mb-2 flex items-start gap-2 " + (m.role === "user" ? "text-foreground/90" : "")}
                style={m.role === "ai" ? { color: "color-mix(in oklab, var(--neon) 80%, white)" } : undefined}
              >
                <span className="select-none text-foreground/30">{m.role === "user" ? "❯" : "◆"}</span>
                <span className="whitespace-pre-wrap break-words">{m.text}</span>
              </motion.div>
            ))}
            {generating && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex items-center gap-2 font-mono text-[11px] text-foreground/50"
              >
                <span className="flex gap-1">
                  {[0,1,2].map((i) => (
                    <motion.span key={i} className="h-1 w-1 rounded-full" style={{ background: "var(--neon)" }}
                      animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }} />
                  ))}
                </span>
                <Sparkles className="h-3 w-3" style={{ color: "var(--neon)" }} />
                streaming patch tokens…
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="border-t border-white/5 p-3 md:p-4">
          <div
            className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 transition-all focus-within:shadow-[0_0_40px_-8px_color-mix(in_oklab,var(--neon)_60%,transparent)]"
            style={{ borderColor: "color-mix(in oklab, var(--neon) 25%, transparent)" }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg font-mono text-sm" style={{ color: "var(--neon)" }}>❯</span>
            <textarea
              ref={taRef}
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); autosize(); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="refactor src/resolver.ts to add neural cache fallback…"
              className="max-h-[160px] min-w-0 flex-1 resize-none bg-transparent py-2 font-mono text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
            />
            <AnimatePresence mode="wait" initial={false}>
              {generating ? (
                <motion.button
                  key="stop"
                  initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={requestStop}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 font-mono text-[11px] uppercase tracking-[0.2em]"
                  style={{
                    borderColor: "color-mix(in oklab, var(--neon) 55%, transparent)",
                    background: "color-mix(in oklab, var(--neon) 12%, transparent)",
                    color: "var(--neon)",
                    boxShadow: "0 0 28px -6px color-mix(in oklab, var(--neon) 70%, transparent)",
                  }}
                >
                  <Square className="h-3.5 w-3.5 fill-current" /> Stop
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
                  whileHover={{ y: -1 }} whileTap={{ scale: 0.96 }}
                  onClick={send}
                  disabled={!prompt.trim()}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border px-4 font-mono text-[11px] uppercase tracking-[0.2em] disabled:opacity-40"
                  style={{
                    borderColor: "color-mix(in oklab, var(--neon) 55%, transparent)",
                    background: "color-mix(in oklab, var(--neon) 10%, transparent)",
                    color: "var(--neon)",
                  }}
                >
                  <Send className="h-3.5 w-3.5" /> Run
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
            <kbd className="rounded border border-white/10 px-1.5 py-0.5">⏎</kbd> run
            <kbd className="rounded border border-white/10 px-1.5 py-0.5">⇧⏎</kbd> newline
            <span className="ml-auto">workspace patch · auto-staged</span>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function Header({ eyebrow, title, right }: { eyebrow: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.7_0.09_185)]">{eyebrow}</div>
        <div className="mt-2 font-display text-2xl font-light tracking-tight">{title}</div>
      </div>
      {right}
    </div>
  );
}

function LiveBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[oklch(0.78_0.22_135_/_0.4)] bg-[oklch(0.78_0.22_135_/_0.08)] px-3 py-1">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[oklch(0.78_0.22_135)] opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.22_135)]" />
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[oklch(0.85_0.2_135)]">live</span>
    </div>
  );
}

function WebsocketBars() {
  return (
    <div className="mt-3 flex h-8 items-end gap-0.5">
      {Array.from({ length: 22 }).map((_, i) => {
        const h = 20 + Math.sin(i * 0.6) * 40 + Math.random() * 30;
        return (
          <motion.div
            key={i}
            animate={{ height: [`${h * 0.4}%`, `${h}%`, `${h * 0.6}%`] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.04, ease: "easeInOut" }}
            className="flex-1 rounded-t bg-gradient-to-t from-[oklch(0.7_0.09_185_/_0.4)] to-[oklch(0.78_0.22_135)]"
          />
        );
      })}
    </div>
  );
}
