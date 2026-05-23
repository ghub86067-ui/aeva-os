import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "strong";
  glow?: "neon" | "titanium" | "none";
}

export function GlassCard({
  className,
  variant = "default",
  glow = "none",
  children,
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "relative rounded-2xl p-6 hover-neon",
        variant === "strong" ? "glass-strong" : "glass",
        glow === "neon" && "neon-glow",
        glow === "titanium" && "titanium-glow",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}