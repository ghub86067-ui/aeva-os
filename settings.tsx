import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Key, Cpu, Check, ExternalLink, Palette } from "lucide-react";
import { Shell } from "@/components/nexus/Shell";
import { NeonButton } from "@/components/nexus/NeonButton";
import { ModelSelector } from "@/components/nexus/ModelSelector";
import { useAeva } from "@/lib/aeva-context";
import { MODELS, getModel } from "@/lib/models";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AEVA OS" },
      { name: "description", content: "Configure your NVIDIA API key, default model, and theme accents." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { apiKey, setApiKey, modelId, theme } = useAeva();
  const [reveal, setReveal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [draft, setDraft] = useState(apiKey);
  const current = getModel(modelId);

  const masked = apiKey
    ? apiKey.slice(0, 6) + "•".repeat(Math.max(0, apiKey.length - 10)) + apiKey.slice(-4)
    : "";

  function save() {
    setApiKey(draft.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

  return (
    <Shell maxWidth="1280px">
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Header */}
        <section className="glass relative overflow-hidden rounded-3xl p-6 md:p-8 lg:col-span-2">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: "var(--titanium)" }}>// configuration</div>
              <h1 className="mt-2 font-display text-3xl font-light tracking-tight md:text-5xl">Settings</h1>
              <p className="mt-2 max-w-xl text-sm text-foreground/55">Wire your NVIDIA Build credentials, pick the cognitive core, and let AEVA repaint the operating accent.</p>
            </div>
            <div className="flex items-center gap-3 rounded-full border px-3 py-1.5"
              style={{ borderColor: "color-mix(in oklab, var(--neon) 40%, transparent)", background: "color-mix(in oklab, var(--neon) 8%, transparent)" }}>
              <Palette className="h-3.5 w-3.5" style={{ color: "var(--neon)" }} />
              <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: "var(--neon)" }}>
                theme · {theme === "green" ? "neon green" : "electric blue"}
              </span>
            </div>
          </div>
        </section>

        {/* API key */}
        <section className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border" style={{ borderColor: "color-mix(in oklab, var(--neon) 30%, transparent)", background: "color-mix(in oklab, var(--neon) 6%, transparent)", color: "var(--neon)" }}>
              <Key className="h-4 w-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">// credentials</div>
              <h2 className="font-display text-xl font-light tracking-tight">NVIDIA API Key</h2>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="relative">
              <input
                type={reveal ? "text" : "password"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="nvapi-..."
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 pr-12 font-mono text-sm tracking-tight text-foreground placeholder:text-foreground/30 focus:border-[color:var(--neon)]/60 focus:outline-none focus:shadow-[0_0_30px_-6px_color-mix(in_oklab,var(--neon)_60%,transparent)] transition-all"
              />
              <button
                type="button"
                onClick={() => setReveal((r) => !r)}
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-foreground/50 hover:text-foreground"
                aria-label={reveal ? "Hide" : "Reveal"}
              >
                {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {apiKey && (
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-black/30 px-3 py-2 font-mono text-[11px] text-foreground/60">
                <span className="truncate">stored · {masked}</span>
                <button onClick={() => { setDraft(""); setApiKey(""); }} className="text-[oklch(0.7_0.22_25)] hover:underline">clear</button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <NeonButton size="sm" onClick={save} disabled={draft === apiKey}>
                {saved ? <><Check className="h-3.5 w-3.5" /> Saved</> : "Save key"}
              </NeonButton>
              <a
                href="https://build.nvidia.com"
                target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50 hover:text-foreground"
              >
                build.nvidia.com <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="text-[11px] text-foreground/40">
              Stored locally in this browser only. Never transmitted anywhere except the NVIDIA Build API.
            </p>
          </div>
        </section>

        {/* Model selector */}
        <section className="glass relative overflow-hidden rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border" style={{ borderColor: "color-mix(in oklab, var(--titanium) 30%, transparent)", background: "color-mix(in oklab, var(--titanium) 6%, transparent)", color: "var(--titanium)" }}>
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">// cognitive core</div>
              <h2 className="font-display text-xl font-light tracking-tight">Active model</h2>
            </div>
          </div>

          <div className="mt-5">
            <ModelSelector />
            {current && (
              <div className="mt-4 grid grid-cols-3 gap-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                <Stat label="vendor" value={current.vendor} />
                <Stat label="class" value={current.category} />
                <Stat label="theme" value={current.theme} accent />
              </div>
            )}
          </div>
        </section>

        {/* Quick switch — theme triggers */}
        <section className="glass relative overflow-hidden rounded-3xl p-6 md:p-8 lg:col-span-2">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/50">// recommended cores</div>
              <h2 className="mt-1 font-display text-xl font-light tracking-tight">Theme-defining models</h2>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">{MODELS.length} total</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <ThemeCard id="meta/llama-3.3-70b-instruct" theme="green" title="Cyberpunk Neon" sub="meta/llama-3.3-70b-instruct" />
            <ThemeCard id="deepseek-ai/deepseek-r1" theme="blue" title="Electric Blue" sub="deepseek-ai/deepseek-r1" />
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-white/5 bg-black/30 p-2.5">
      <div className="text-foreground/40">{label}</div>
      <div className={"mt-1 truncate text-foreground " + (accent ? "" : "")} style={accent ? { color: "var(--neon)" } : undefined}>{value}</div>
    </div>
  );
}

function ThemeCard({ id, theme, title, sub }: { id: string; theme: "green" | "blue"; title: string; sub: string }) {
  const { modelId, setModelId } = useAeva();
  const active = modelId === id;
  const c = theme === "green" ? "oklch(0.78 0.22 135)" : "oklch(0.72 0.2 245)";
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={() => setModelId(id)}
      className="relative overflow-hidden rounded-2xl border p-5 text-left transition-all"
      style={{
        borderColor: active ? c : "color-mix(in oklab, white 10%, transparent)",
        background: active ? `color-mix(in oklab, ${c} 8%, transparent)` : "oklch(0 0 0 / 0.3)",
        boxShadow: active ? `0 0 40px -10px ${c}` : undefined,
      }}
    >
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl" style={{ background: `${c}`, opacity: 0.25 }} />
      <div className="relative">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]" style={{ color: c }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 10px ${c}` }} />
          {theme} theme
        </div>
        <div className="mt-3 font-display text-xl font-light tracking-tight">{title}</div>
        <div className="mt-1 truncate font-mono text-[11px] text-foreground/50">{sub}</div>
        {active && (
          <div className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: c }}>
            <Check className="h-3 w-3" /> active core
          </div>
        )}
      </div>
    </motion.button>
  );
}