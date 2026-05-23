import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  FlaskConical,
  Terminal,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { icon: LayoutDashboard, label: "Overview", to: "/" },
  { icon: MessageSquare, label: "Chat", to: "/chat" },
  { icon: BookOpen, label: "Novel", to: "/novel" },
  { icon: FlaskConical, label: "Lab", to: "/lab" },
  { icon: Terminal, label: "Dev", to: "/dev" },
  { icon: Settings, label: "Settings", to: "/" },
] as const;

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <motion.aside
      animate={{ width: open ? 240 : 76 }}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className="glass sticky top-6 hidden h-[calc(100vh-3rem)] shrink-0 flex-col gap-2 rounded-2xl p-4 md:flex"
    >
      <div className="flex items-center justify-between px-2 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-gradient-to-br from-[oklch(0.78_0.22_135)] to-[oklch(0.7_0.09_185)] shadow-[0_0_18px_oklch(0.78_0.22_135_/_0.7)]" />
          {open && (
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-foreground/70">
              Nexus
            </span>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-md p-1 text-foreground/50 hover:text-[oklch(0.78_0.22_135)]"
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", !open && "rotate-180")}
          />
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to;
          return (
            <Link
              key={item.label}
              to={item.to}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-[oklch(0.78_0.22_135_/_0.1)] text-[oklch(0.85_0.2_135)]"
                  : "text-foreground/60 hover:bg-white/5 hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r bg-[oklch(0.78_0.22_135)] shadow-[0_0_10px_oklch(0.78_0.22_135)]"
                />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {open && (
                <span className="font-medium tracking-wide">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="glass-strong rounded-xl p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
              GPU
            </span>
            <span className="font-mono text-[10px] text-[oklch(0.78_0.22_135)]">
              72%
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[oklch(0.7_0.09_185)] to-[oklch(0.78_0.22_135)] shadow-[0_0_10px_oklch(0.78_0.22_135)]"
            />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
