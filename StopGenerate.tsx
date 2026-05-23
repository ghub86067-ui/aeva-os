import { AnimatePresence, motion } from "framer-motion";
import { Square } from "lucide-react";
import { useAeva } from "@/lib/aeva-context";

export function StopGenerate({ className = "" }: { className?: string }) {
  const { generating, requestStop } = useAeva();
  return (
    <AnimatePresence>
      {generating && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 6 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={requestStop}
          className={
            "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] " + className
          }
          style={{
            borderColor: "color-mix(in oklab, var(--neon) 55%, transparent)",
            background: "color-mix(in oklab, var(--neon) 10%, transparent)",
            color: "var(--neon)",
            boxShadow: "0 0 28px -6px color-mix(in oklab, var(--neon) 60%, transparent)",
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--neon)" }} />
            <Square className="relative h-2 w-2 fill-current" />
          </span>
          Stop generation
        </motion.button>
      )}
    </AnimatePresence>
  );
}