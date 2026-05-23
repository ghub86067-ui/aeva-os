import { motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, MessageSquare, BookOpen, FlaskConical, Terminal } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Home", to: "/" },
  { icon: MessageSquare, label: "Chat", to: "/chat" },
  { icon: BookOpen, label: "Novel", to: "/novel" },
  { icon: FlaskConical, label: "Lab", to: "/lab" },
  { icon: Terminal, label: "Dev", to: "/dev" },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-3 z-40 md:hidden bottom-safe"
    >
      <div className="glass-strong relative flex items-stretch justify-between rounded-2xl px-1.5 py-1.5 shadow-[0_20px_60px_-15px_oklch(0_0_0_/_0.7)]">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-2 touch-target"
            >
              {active && (
                <motion.span
                  layoutId="bottomnav-active"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-[oklch(0.78_0.22_135_/_0.12)] shadow-[inset_0_0_0_1px_oklch(0.78_0.22_135_/_0.5),0_0_22px_-6px_oklch(0.78_0.22_135_/_0.7)]"
                />
              )}
              <Icon
                className={`relative h-5 w-5 transition-colors ${active ? "text-[oklch(0.85_0.2_135)]" : "text-foreground/55"}`}
              />
              <span
                className={`relative font-mono text-[9px] uppercase tracking-[0.18em] transition-colors ${active ? "text-[oklch(0.85_0.2_135)]" : "text-foreground/45"}`}
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