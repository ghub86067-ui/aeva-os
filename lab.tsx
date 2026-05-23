import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FlaskConical, Sigma, BarChart3, Gauge, FileText } from "lucide-react";
import { Shell } from "@/components/nexus/Shell";
import { ParticleField } from "@/components/nexus/ParticleField";
import { NeonButton } from "@/components/nexus/NeonButton";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Polymathic Lab — Nexus" },
      { name: "description", content: "Scientific AI laboratory with 3D scatter, holographic equations, and live confidence analytics." },
    ],
  }),
  component: LabPage,
});

function LabPage() {
  return (
    <Shell maxWidth="1640px">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* 3D Scatter canvas */}
        <section className="glass relative overflow-hidden rounded-3xl p-6">
          <Header eyebrow="// canvas.3d" title="Tensor manifold · run 087" right="14,392 samples" />
          <div className="relative mt-5 h-[420px] overflow-hidden rounded-2xl border border-white/5 bg-[radial-gradient(ellipse_at_center,oklch(0.16_0.04_240),oklch(0.06_0.02_220))]">
            <ParticleField count={20} />
            <Scatter3D />
            <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/40">
              x · temp(K) &nbsp;·&nbsp; y · entropy &nbsp;·&nbsp; z · yield
            </div>
            <div className="absolute bottom-4 right-4 rounded-lg border border-[oklch(0.78_0.22_135_/_0.4)] bg-black/50 px-3 py-2 font-mono text-[10px] text-[oklch(0.78_0.22_135)] backdrop-blur-md">
              cluster · σ=0.142
            </div>
          </div>
        </section>

        {/* Dataset upload */}
        <section className="glass relative flex flex-col gap-5 overflow-hidden rounded-3xl p-6">
          <Header eyebrow="// dataset" title="Upload corpus" />
          <div className="group relative flex h-44 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-black/30 transition-all hover:border-[oklch(0.78_0.22_135_/_0.5)] hover:bg-[oklch(0.78_0.22_135_/_0.04)]">
            <Upload className="h-7 w-7 text-foreground/40 transition-colors group-hover:text-[oklch(0.78_0.22_135)]" />
            <div className="mt-3 font-display text-sm text-foreground/80">Drop CSV / Parquet / HDF5</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">max 2 GB · streaming ingest</div>
            <NeonButton size="sm" className="mt-4">Browse</NeonButton>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "Rows", v: "1.4M" },
              { l: "Features", v: "284" },
              { l: "Cleaned", v: "97%" },
            ].map((m) => (
              <div key={m.l} className="rounded-xl border border-white/5 bg-black/30 p-3">
                <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-foreground/40">{m.l}</div>
                <div className="mt-1 font-display text-xl font-light text-[oklch(0.85_0.2_135)]">{m.v}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Equation discovery */}
        <section className="glass relative overflow-hidden rounded-3xl p-6">
          <Header eyebrow="// symbolic regression" title="Equation discovery" right="convergence 0.94" />
          <div className="mt-5 space-y-3">
            {[
              { eq: "ŷ = α · sin(βx) + γ · log(z)", conf: 0.94 },
              { eq: "ŷ = α · x² − β · √z + δ", conf: 0.81 },
              { eq: "ŷ = α · exp(−β/x) · cos(z)", conf: 0.67 },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}
                className="rounded-xl border border-white/5 bg-black/40 p-4"
              >
                <div className="flex items-center gap-3">
                  <Sigma className="h-4 w-4 text-[oklch(0.7_0.09_185)]" />
                  <code className="flex-1 font-mono text-sm text-foreground/85" style={{ textShadow: "0 0 12px oklch(0.78 0.22 135 / 0.4)" }}>
                    {row.eq}
                  </code>
                  <span className="font-mono text-xs text-[oklch(0.78_0.22_135)]">{(row.conf * 100).toFixed(0)}%</span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.conf * 100}%` }}
                    transition={{ duration: 1.2, delay: i * 0.15 }}
                    className="h-full bg-gradient-to-r from-[oklch(0.7_0.09_185)] to-[oklch(0.78_0.22_135)] shadow-[0_0_8px_oklch(0.78_0.22_135_/_0.6)]"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Confidence dials */}
        <section className="glass relative overflow-hidden rounded-3xl p-6">
          <Header eyebrow="// analytics" title="Confidence telemetry" />
          <div className="mt-5 grid grid-cols-3 gap-4">
            <Dial label="Fit" value={0.94} />
            <Dial label="Stability" value={0.78} />
            <Dial label="Generalize" value={0.67} />
          </div>
          <div className="mt-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40">
            <Gauge className="h-3 w-3" /> last sweep · 12s ago
          </div>
        </section>

        {/* Graph comparison */}
        <section className="glass relative overflow-hidden rounded-3xl p-6 lg:col-span-2">
          <Header eyebrow="// comparison" title="Predicted vs. observed" right="rmse 0.018" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Sparkline label="Observed" color="oklch(0.7 0.09 185)" />
            <Sparkline label="Predicted" color="oklch(0.78 0.22 135)" />
          </div>
        </section>

        {/* Report */}
        <section className="glass relative overflow-hidden rounded-3xl p-6 lg:col-span-2">
          <Header eyebrow="// report" title="Scientific draft" right={<NeonButton size="sm" variant="titanium"><FileText className="h-3.5 w-3.5" /> Export</NeonButton>} />
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {["Abstract", "Methodology", "Findings"].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl border border-white/5 bg-black/30 p-5"
              >
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.7_0.09_185)]">
                  <FlaskConical className="h-3 w-3" /> {t}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-foreground/65">
                  {i === 0 && "We resolve a 14-term symbolic relation across the high-entropy regime, holding under bootstrapped resamples."}
                  {i === 1 && "Bayesian symbolic regression seeded with priors from the prior 6 runs, pruned to a parsimony of 4 operators."}
                  {i === 2 && "The dominant operator family is harmonic with logarithmic correction; residuals are Gaussian to within 2σ."}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
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
      {typeof right === "string" ? (
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[oklch(0.78_0.22_135)]">{right}</span>
      ) : right}
    </div>
  );
}

function Scatter3D() {
  // Pseudo-3D projection (depth-sorted dots)
  const pts = useMemo(
    () =>
      Array.from({ length: 90 }).map(() => {
        const x = Math.random();
        const y = Math.random();
        const z = Math.random();
        return { x, y, z };
      }),
    [],
  );
  // simple isometric projection
  const proj = pts
    .map((p) => {
      const sx = p.x * 80 + p.z * 10 + 5; // %
      const sy = (1 - p.y) * 70 + p.z * 10 + 5;
      return { ...p, sx, sy };
    })
    .sort((a, b) => a.z - b.z);

  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: [0, 1.5, 0, -1.5, 0] }}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* axes */}
      <svg className="absolute inset-0 h-full w-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line x1="5" y1="95" x2="95" y2="95" stroke="oklch(0.7 0.09 185 / 0.4)" strokeWidth="0.25" />
        <line x1="5" y1="95" x2="5" y2="5" stroke="oklch(0.7 0.09 185 / 0.4)" strokeWidth="0.25" />
        <line x1="5" y1="95" x2="20" y2="80" stroke="oklch(0.7 0.09 185 / 0.4)" strokeWidth="0.25" />
      </svg>
      {proj.map((p, i) => {
        const size = 4 + p.z * 8;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4 + p.z * 0.6, scale: 1 }}
            transition={{ delay: i * 0.01, duration: 0.6 }}
            className="absolute rounded-full"
            style={{
              left: `${p.sx}%`,
              top: `${p.sy}%`,
              width: size,
              height: size,
              background: `oklch(${0.7 + p.z * 0.15} 0.22 ${135 - p.x * 40})`,
              boxShadow: `0 0 ${size * 1.5}px oklch(0.78 0.22 135 / ${0.4 + p.z * 0.4})`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </motion.div>
  );
}

function Dial({ label, value }: { label: string; value: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value);
  return (
    <div className="flex flex-col items-center">
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r={r} stroke="oklch(0.3 0.02 240 / 0.5)" strokeWidth="3" fill="none" />
        <motion.circle
          cx="46" cy="46" r={r}
          stroke="oklch(0.78 0.22 135)" strokeWidth="3" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.22 135 / 0.7))", transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        <text x="46" y="50" textAnchor="middle" className="fill-foreground font-display text-base" fontSize="14">
          {(value * 100).toFixed(0)}
        </text>
      </svg>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/50">{label}</div>
    </div>
  );
}

function Sparkline({ label, color }: { label: string; color: string }) {
  const pts = useMemo(
    () =>
      Array.from({ length: 40 }).map((_, i) => {
        const v = 40 + Math.sin(i * 0.4) * 18 + Math.random() * 12;
        return [i * (100 / 39), 100 - v];
      }),
    [label],
  );
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
  return (
    <div className="rounded-2xl border border-white/5 bg-black/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/60">
          <BarChart3 className="h-3 w-3" /> {label}
        </div>
        <span className="font-mono text-[10px]" style={{ color }}>● live</span>
      </div>
      <svg className="mt-3 h-32 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d={d} stroke={color} strokeWidth="0.6" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
    </div>
  );
}