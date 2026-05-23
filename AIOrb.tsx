import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AIOrbProps {
  size?: number;
  className?: string;
}

export function AIOrb({ size = 320, className }: AIOrbProps) {
  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-[oklch(0.7_0.09_185_/_0.35)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "conic-gradient(from 0deg, transparent 0deg, oklch(0.78 0.22 135 / 0.4) 60deg, transparent 120deg, oklch(0.7 0.09 185 / 0.3) 240deg, transparent 300deg)",
          mask: "radial-gradient(circle, transparent 58%, black 60%, black 64%, transparent 66%)",
          WebkitMask:
            "radial-gradient(circle, transparent 58%, black 60%, black 64%, transparent 66%)",
        }}
      />
      {/* Mid rotating ring (counter) */}
      <motion.div
        className="absolute inset-6 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "conic-gradient(from 90deg, transparent 0deg, oklch(0.7 0.09 185 / 0.5) 40deg, transparent 80deg, transparent 280deg, oklch(0.78 0.22 135 / 0.4) 320deg, transparent 360deg)",
          mask: "radial-gradient(circle, transparent 70%, black 72%, black 74%, transparent 76%)",
          WebkitMask:
            "radial-gradient(circle, transparent 70%, black 72%, black 74%, transparent 76%)",
        }}
      />
      {/* Core orb */}
      <motion.div
        className="absolute inset-[18%] rounded-full"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 35% 30%, oklch(0.95 0.18 135 / 0.95), oklch(0.78 0.22 135 / 0.85) 35%, oklch(0.45 0.18 145 / 0.6) 65%, oklch(0.15 0.05 220 / 0.4) 100%)",
          boxShadow:
            "0 0 60px 10px oklch(0.78 0.22 135 / 0.5), 0 0 140px 30px oklch(0.78 0.22 135 / 0.25), inset 0 0 60px oklch(0.95 0.18 135 / 0.4), inset -20px -30px 50px oklch(0.15 0.05 220 / 0.6)",
        }}
      />
      {/* Inner highlight */}
      <div
        className="absolute inset-[28%] rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle at 40% 35%, oklch(1 0 0 / 0.6), transparent 50%)",
          filter: "blur(2px)",
        }}
      />
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[oklch(0.78_0.22_135)]"
          style={{
            boxShadow: "0 0 8px oklch(0.78 0.22 135 / 0.9)",
          }}
          animate={{
            x: [
              Math.cos((i / 6) * Math.PI * 2) * size * 0.42,
              Math.cos(((i + 3) / 6) * Math.PI * 2) * size * 0.42,
              Math.cos((i / 6) * Math.PI * 2) * size * 0.42,
            ],
            y: [
              Math.sin((i / 6) * Math.PI * 2) * size * 0.42,
              Math.sin(((i + 3) / 6) * Math.PI * 2) * size * 0.42,
              Math.sin((i / 6) * Math.PI * 2) * size * 0.42,
            ],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}