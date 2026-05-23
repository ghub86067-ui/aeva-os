import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  children: ReactNode;
  title?: string;
}

export function MobileDrawer({ open, onClose, side = "left", children, title }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const isBottom = side === "bottom";
  const initial = side === "left" ? { x: "-100%" } : side === "right" ? { x: "100%" } : { y: "100%" };
  const animate = side === "bottom" ? { y: 0 } : { x: 0 };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={initial}
            animate={animate}
            exit={initial}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            drag={isBottom ? "y" : "x"}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              const offset = isBottom ? info.offset.y : side === "left" ? -info.offset.x : info.offset.x;
              if (offset > 80 || (isBottom ? info.velocity.y : Math.abs(info.velocity.x)) > 400) onClose();
            }}
            className={
              "glass-strong absolute flex flex-col gap-4 p-5 pt-safe " +
              (isBottom
                ? "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-3xl"
                : side === "left"
                  ? "inset-y-0 left-0 w-[78vw] max-w-xs rounded-r-3xl"
                  : "inset-y-0 right-0 w-[78vw] max-w-xs rounded-l-3xl")
            }
          >
            {isBottom && (
              <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-foreground/25" />
            )}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[oklch(0.78_0.22_135)]">
                {title ?? "Menu"}
              </span>
              <button onClick={onClose} className="rounded-full p-1.5 text-foreground/60 touch-target">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}