import { useMemo, useState } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MODELS, type AevaModel } from "@/lib/models";
import { useAeva } from "@/lib/aeva-context";

export function ModelSelector({ compact = false }: { compact?: boolean }) {
  const { modelId, setModelId } = useAeva();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const current = MODELS.find((m) => m.id === modelId) ?? MODELS[0];

  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return MODELS;
    return MODELS.filter((m) => m.id.toLowerCase().includes(s) || m.label.toLowerCase().includes(s) || m.vendor.toLowerCase().includes(s));
  }, [q]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={
          "flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-left transition-all hover:border-[color:var(--neon)]/50 " +
          (compact ? "min-w-0" : "min-w-[260px]")
        }
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--neon)", boxShadow: "0 0 10px var(--neon)" }} />
          <span className="min-w-0">
            <span className="block truncate font-display text-sm font-medium tracking-tight text-foreground">{current.label}</span>
            <span className="block truncate font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/40">{current.id}</span>
          </span>
        </span>
        <ChevronDown className={"h-4 w-4 shrink-0 text-foreground/50 transition-transform " + (open ? "rotate-180" : "")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="glass-strong absolute left-0 right-0 z-50 mt-2 max-h-[60vh] overflow-hidden rounded-2xl"
            >
              <div className="flex items-center gap-2 border-b border-white/5 px-3 py-2">
                <Search className="h-3.5 w-3.5 text-foreground/40" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Filter models…"
                  className="flex-1 bg-transparent text-sm placeholder:text-foreground/30 focus:outline-none"
                />
              </div>
              <div className="max-h-[44vh] overflow-y-auto p-1">
                {filtered.map((m) => (
                  <ModelRow
                    key={m.id}
                    m={m}
                    active={m.id === modelId}
                    onPick={() => { setModelId(m.id); setOpen(false); }}
                  />
                ))}
                {filtered.length === 0 && (
                  <div className="px-3 py-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">no match</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModelRow({ m, active, onPick }: { m: AevaModel; active: boolean; onPick: () => void }) {
  const dot = m.theme === "green" ? "oklch(0.78 0.22 135)" : "oklch(0.72 0.2 245)";
  return (
    <button
      onClick={onPick}
      className={
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-white/5 " +
        (active ? "bg-white/5" : "")
      }
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-foreground">{m.label}</span>
        <span className="block truncate font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40">{m.vendor} · {m.category}</span>
      </span>
      {active && <Check className="h-4 w-4" style={{ color: "var(--neon)" }} />}
    </button>
  );
}