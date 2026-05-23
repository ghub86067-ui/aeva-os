import { motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { MessageSquare, BookOpen, FlaskConical, Terminal, Settings } from "lucide-react";

const items = [
  { icon: MessageSquare, label: "Chat", to: "/chat" },
  { icon: BookOpen, label: "Novel", to: "/novel" },
  { icon: FlaskConical, label: "Lab", to: "/lab" },
  { icon: Terminal, label: "Dev", to: "/dev" },
  { icon: Settings, label: "Settings", to: "/settings" },
] as const;

/** Floating vertical left dock — replaces bottom nav across all viewports. */
export function SideDock() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="fixed left-2 top-1/2 z-40 -translate-y-1/2 md:left-4"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass-strong relative flex flex-col items-center gap-1.5 rounded-2xl p-1.5 shadow-[0_30px_80px_-15px_oklch(0_0_0_/_0.7)]">
        <div className="mb-1 mt-1 h-7 w-7 rounded-md bg-gradient-to-br from-[color:var(--neon)] to-[color:var(--titanium)] shadow-[0_0_18px_color-mix(in_oklab,var(--neon)_70%,transparent)]" />
        {items.map((it) => {
          const active = pathname === it.to || (it.to === "/chat" && pathname === "/");
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              aria-label={it.label}
              className="group relative grid h-11 w-11 place-items-center rounded-xl touch-target"
            >
              {active && (
                <motion.span
                  layoutId="sidedock-active"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: "color-mix(in oklab, var(--neon) 14%, transparent)",
                    boxShadow:
                      "inset 0 0 0 1px color-mix(in oklab, var(--neon) 55%, transparent), 0 0 22px -6px color-mix(in oklab, var(--neon) 70%, transparent)",
                  }}
                />
              )}
              <Icon
                className="relative h-5 w-5 transition-colors"
                style={{ color: active ? "var(--neon)" : "color-mix(in oklab, white 55%, transparent)" }}
              />
              <span
                className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-md border border-white/10 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/80 opacity-0 transition-opacity group-hover:opacity-100 md:block"
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}