import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonButtonProps extends HTMLMotionProps<"button"> {
  variant?: "neon" | "titanium" | "ghost";
  size?: "sm" | "md" | "lg";
  children?: ReactNode;
}

export function NeonButton({
  className,
  variant = "neon",
  size = "md",
  children,
  ...props
}: NeonButtonProps) {
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const variants = {
    neon: "border-[oklch(0.78_0.22_135_/_0.5)] text-[oklch(0.78_0.22_135)] hover:bg-[oklch(0.78_0.22_135_/_0.12)] hover:shadow-[0_0_28px_-4px_oklch(0.78_0.22_135_/_0.6)]",
    titanium:
      "border-[oklch(0.7_0.09_185_/_0.5)] text-[oklch(0.85_0.07_185)] hover:bg-[oklch(0.7_0.09_185_/_0.12)] hover:shadow-[0_0_28px_-4px_oklch(0.7_0.09_185_/_0.6)]",
    ghost: "border-white/10 text-foreground/80 hover:border-white/30 hover:bg-white/5",
  };
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-full border bg-transparent font-mono uppercase tracking-[0.2em] backdrop-blur-md transition-all duration-300",
        sizes[size],
        variants[variant],
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children as ReactNode}</span>
    </motion.button>
  );
}