import { Search, Bell, Command } from "lucide-react";
import { NeonButton } from "./NeonButton";
import { ModelSelector } from "./ModelSelector";
import { StopGenerate } from "./StopGenerate";

interface TopNavProps {
  onLaunch: () => void;
}

export function TopNav({ onLaunch }: TopNavProps) {
  return (
    <header className="glass sticky top-3 z-30 flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 md:top-6 md:px-4 md:py-3">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden items-center gap-2 rounded-full border px-3 py-1 sm:flex" style={{ borderColor: "color-mix(in oklab, var(--neon) 30%, transparent)", background: "color-mix(in oklab, var(--neon) 8%, transparent)" }}>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--neon)" }} />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--neon)" }} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--neon)" }}>
            AEVA · LIVE
          </span>
        </div>
        <div className="min-w-0 max-w-[55vw] sm:max-w-[280px]">
          <ModelSelector compact />
        </div>
      </div>

      <div className="hidden flex-1 max-w-md lg:block">
        <label className="group flex items-center gap-3 rounded-xl border border-white/5 bg-black/30 px-4 py-2 transition-colors focus-within:border-[oklch(0.78_0.22_135_/_0.5)] focus-within:shadow-[0_0_18px_-4px_oklch(0.78_0.22_135_/_0.5)]">
          <Search className="h-4 w-4 text-foreground/40" />
          <input
            placeholder="Query the neural fabric…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none"
          />
          <kbd className="hidden items-center gap-1 rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-foreground/40 sm:inline-flex">
            <Command className="h-3 w-3" />K
          </kbd>
        </label>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2">
        <StopGenerate />
        <button
          aria-label="Search"
          className="touch-target grid place-items-center rounded-full text-foreground/60 lg:hidden"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          aria-label="Notifications"
          className="touch-target relative hidden place-items-center rounded-full text-foreground/60 transition-colors hover:text-[color:var(--neon)] sm:grid md:border md:border-white/5 md:p-2"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full" style={{ background: "var(--neon)", boxShadow: "0 0 6px var(--neon)" }} />
        </button>
        <NeonButton size="sm" onClick={onLaunch} className="hidden sm:inline-flex">
          Deploy
        </NeonButton>
      </div>
    </header>
  );
}