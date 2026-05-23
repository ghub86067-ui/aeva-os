import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export interface SwipeTab {
  id: string;
  label: string;
  content: ReactNode;
}

interface Props {
  tabs: SwipeTab[];
  initial?: string;
  className?: string;
}

/**
 * Mobile-first swipeable tabs using native scroll-snap.
 * GPU-friendly, no JS during swipe, falls back perfectly without motion.
 */
export function SwipeTabs({ tabs, initial, className = "" }: Props) {
  const [active, setActive] = useState(initial ?? tabs[0]?.id);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Detect active page based on scroll position
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const x = el.scrollLeft;
      const w = el.clientWidth;
      const idx = Math.round(x / w);
      const t = tabs[idx];
      if (t && t.id !== active) setActive(t.id);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [tabs, active]);

  function goTo(id: string) {
    const node = pageRefs.current[id];
    const scroller = scrollerRef.current;
    if (!node || !scroller) return;
    scroller.scrollTo({ left: node.offsetLeft, behavior: "smooth" });
    setActive(id);
  }

  return (
    <div className={"flex min-h-0 flex-1 flex-col " + className}>
      {/* Tab strip */}
      <div className="glass-strong sticky top-0 z-20 flex shrink-0 items-center gap-1 overflow-x-auto rounded-2xl p-1.5 no-scrollbar">
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => goTo(t.id)}
              className="relative flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 touch-target"
            >
              {isActive && (
                <motion.span
                  layoutId="swipe-tab-active"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-[oklch(0.78_0.22_135_/_0.12)] shadow-[inset_0_0_0_1px_oklch(0.78_0.22_135_/_0.5)]"
                />
              )}
              <span
                className={
                  "relative font-mono text-[10px] uppercase tracking-[0.22em] transition-colors " +
                  (isActive ? "text-[oklch(0.85_0.2_135)]" : "text-foreground/55")
                }
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Swipeable pages */}
      <div
        ref={scrollerRef}
        className="snap-x-pages mt-3 flex min-h-0 flex-1 overflow-x-auto overflow-y-hidden no-scrollbar"
      >
        {tabs.map((t) => (
          <div
            key={t.id}
            ref={(el) => { pageRefs.current[t.id] = el; }}
            className="snap-page flex w-full shrink-0 flex-col overflow-y-auto"
          >
            {t.content}
          </div>
        ))}
      </div>
    </div>
  );
}