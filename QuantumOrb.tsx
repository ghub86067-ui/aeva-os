import { motion, useAnimationFrame } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type AIModelType = "reasoning" | "fast" | "coding" | "vision";
export type OrbState = "idle" | "streaming";

interface QuantumOrbProps {
  size?: number;
  modelType?: AIModelType;
  state?: OrbState;
  className?: string;
}

// Per-model behavior tuning
const PROFILES: Record<
  AIModelType,
  {
    pulseDuration: number;
    pulseScale: number[];
    hue: string; // oklch core color
    accent: string; // accent ring color
    auraOpacity: number;
    particleCount: number;
    particleSpeed: number;
    ringSpeeds: [number, number, number]; // sec per rotation
    waveform: boolean;
    distortion: number; // 0-1
  }
> = {
  reasoning: {
    pulseDuration: 5.5,
    pulseScale: [1, 1.08, 1],
    hue: "oklch(0.72 0.18 280)",
    accent: "oklch(0.78 0.14 240)",
    auraOpacity: 0.55,
    particleCount: 8,
    particleSpeed: 14,
    ringSpeeds: [60, 90, 120],
    waveform: false,
    distortion: 0.35,
  },
  fast: {
    pulseDuration: 0.9,
    pulseScale: [1, 1.05, 1],
    hue: "oklch(0.85 0.2 90)",
    accent: "oklch(0.78 0.22 135)",
    auraOpacity: 0.75,
    particleCount: 14,
    particleSpeed: 3.5,
    ringSpeeds: [12, 18, 25],
    waveform: false,
    distortion: 0.6,
  },
  coding: {
    pulseDuration: 1.6,
    pulseScale: [1, 1.03, 0.99, 1.04, 1],
    hue: "oklch(0.78 0.22 135)",
    accent: "oklch(0.7 0.22 160)",
    auraOpacity: 0.7,
    particleCount: 6,
    particleSpeed: 6,
    ringSpeeds: [40, 55, 70],
    waveform: true,
    distortion: 0.5,
  },
  vision: {
    pulseDuration: 3.2,
    pulseScale: [1, 1.04, 1],
    hue: "oklch(0.78 0.14 200)",
    accent: "oklch(0.7 0.18 320)",
    auraOpacity: 0.65,
    particleCount: 10,
    particleSpeed: 9,
    ringSpeeds: [8, 12, 18], // fast rotation = signature for vision
    waveform: false,
    distortion: 0.4,
  },
};

/**
 * QuantumOrb — animated AI orb whose motion language changes per model type.
 * Pure CSS + framer-motion. GPU-friendly (transform/opacity/filter only).
 */
export function QuantumOrb({
  size = 240,
  modelType = "reasoning",
  state = "idle",
  className,
}: QuantumOrbProps) {
  const profile = PROFILES[modelType];
  const streamingMultiplier = state === "streaming" ? 0.55 : 1;

  return (
    <div
      className={cn("relative select-none", className)}
      style={{ width: size, height: size }}
      aria-label={`AI orb ${modelType}`}
    >
      {/* Ambient floating particles outside the orb */}
      <AmbientParticles
        size={size}
        count={profile.particleCount}
        speed={profile.particleSpeed * streamingMultiplier}
        color={profile.hue}
      />

      {/* Soft neon aura */}
      <motion.div
        className="absolute inset-[-20%] rounded-full pointer-events-none"
        animate={{
          opacity: [profile.auraOpacity * 0.6, profile.auraOpacity, profile.auraOpacity * 0.6],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: profile.pulseDuration * streamingMultiplier,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle, ${profile.hue.replace(")", " / 0.45)")} 0%, transparent 60%)`,
          filter: "blur(30px)",
          willChange: "transform, opacity",
        }}
      />

      {/* Rotating layered rings — emphasized for vision models */}
      <RotatingRing
        size={size}
        inset="0"
        duration={profile.ringSpeeds[0]}
        color={profile.accent}
        thickness={1}
        emphasis={modelType === "vision" ? 0.9 : 0.4}
      />
      <RotatingRing
        size={size}
        inset="8%"
        duration={profile.ringSpeeds[1]}
        direction={-1}
        color={profile.hue}
        thickness={1}
        emphasis={modelType === "vision" ? 0.8 : 0.35}
      />
      <RotatingRing
        size={size}
        inset="16%"
        duration={profile.ringSpeeds[2]}
        color={profile.accent}
        thickness={0.5}
        emphasis={modelType === "vision" ? 0.7 : 0.25}
      />

      {/* Core orb with dynamic pulse */}
      <motion.div
        className="absolute inset-[24%] rounded-full pointer-events-none"
        animate={{
          scale: profile.pulseScale,
          filter: [
            `blur(0px) hue-rotate(0deg)`,
            `blur(${profile.distortion * 0.6}px) hue-rotate(${profile.distortion * 8}deg)`,
            `blur(0px) hue-rotate(0deg)`,
          ],
        }}
        transition={{
          duration: profile.pulseDuration * streamingMultiplier,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: `radial-gradient(circle at 35% 30%, oklch(0.98 0.05 95 / 0.95), ${profile.hue.replace(")", " / 0.9)")} 35%, ${profile.accent.replace(")", " / 0.5)")} 65%, oklch(0.12 0.04 240 / 0.5) 100%)`,
          boxShadow: `0 0 50px 6px ${profile.hue.replace(")", " / 0.55)")}, 0 0 120px 24px ${profile.hue.replace(")", " / 0.25)")}, inset 0 0 50px ${profile.hue.replace(")", " / 0.45)")}, inset -16px -22px 40px oklch(0.12 0.04 240 / 0.6)`,
          willChange: "transform, filter",
        }}
      />

      {/* Holographic distortion sheen */}
      <motion.div
        className="absolute inset-[24%] rounded-full mix-blend-screen pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 20 * streamingMultiplier, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, oklch(1 0 0 / 0.22) 30deg, transparent 60deg, transparent 200deg, oklch(0.85 0.2 320 / 0.22) 230deg, transparent 270deg)",
          opacity: 0.6,
          filter: "blur(8px)",
        }}
      />

      {/* Specular highlight */}
      <div
        className="absolute inset-[32%] rounded-full pointer-events-none opacity-80"
        style={{
          background:
            "radial-gradient(circle at 38% 32%, oklch(1 0 0 / 0.7), transparent 55%)",
          filter: "blur(2px)",
        }}
      />

      {/* Coding waveform — electric horizontal scanline */}
      {profile.waveform && (
        <WaveformOverlay size={size} color={profile.hue} streaming={state === "streaming"} />
      )}
    </div>
  );
}

/* ---------------------------- Sub components ---------------------------- */

function RotatingRing({
  inset,
  duration,
  color,
  thickness,
  direction = 1,
  emphasis,
}: {
  size: number;
  inset: string;
  duration: number;
  color: string;
  thickness: number;
  direction?: 1 | -1;
  emphasis: number;
}) {
  const c = color.replace(")", ` / ${0.3 + emphasis * 0.5})`);
  const c2 = color.replace(")", ` / ${0.1 + emphasis * 0.3})`);
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        inset,
        backgroundImage: `conic-gradient(from 0deg, transparent 0deg, ${c} 50deg, transparent 110deg, transparent 240deg, ${c2} 290deg, transparent 350deg)`,
        mask: `radial-gradient(circle, transparent calc(50% - ${thickness + 1}px), black calc(50% - ${thickness}px), black 50%, transparent calc(50% + 1px))`,
        WebkitMask: `radial-gradient(circle, transparent calc(50% - ${thickness + 1}px), black calc(50% - ${thickness}px), black 50%, transparent calc(50% + 1px))`,
        willChange: "transform",
      }}
      animate={{ rotate: direction * 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

function AmbientParticles({
  size,
  count,
  speed,
  color,
}: {
  size: number;
  count: number;
  speed: number;
  color: string;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const radius = size * (0.42 + Math.random() * 0.12);
        return {
          id: i,
          x1: Math.cos(angle) * radius,
          y1: Math.sin(angle) * radius,
          x2: Math.cos(angle + Math.PI) * radius * 0.7,
          y2: Math.sin(angle + Math.PI) * radius * 0.7,
          delay: Math.random() * speed,
          dur: speed + Math.random() * speed * 0.6,
          s: 1 + Math.random() * 2,
        };
      }),
    [count, size, speed]
  );
  return (
    <>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
          style={{
            width: p.s,
            height: p.s,
            background: color,
            boxShadow: `0 0 ${6 + p.s * 2}px ${color}`,
            willChange: "transform, opacity",
          }}
          animate={{
            x: [p.x1, p.x2, p.x1],
            y: [p.y1, p.y2, p.y1],
            opacity: [0.2, 0.95, 0.2],
          }}
          transition={{
            duration: p.dur,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

function WaveformOverlay({
  size,
  color,
  streaming,
}: {
  size: number;
  color: string;
  streaming: boolean;
}) {
  const pathRef = useRef<SVGPathElement | null>(null);
  const [, force] = useState(0);
  const t = useRef(0);

  useAnimationFrame((_, delta) => {
    t.current += delta * (streaming ? 0.006 : 0.0025);
    if (!pathRef.current) return;
    const w = size;
    const cy = size / 2;
    const amp = size * 0.06;
    const segs = 28;
    let d = `M 0 ${cy}`;
    for (let i = 1; i <= segs; i++) {
      const x = (i / segs) * w;
      const y = cy + Math.sin(i * 0.6 + t.current) * amp * Math.sin(i * 0.3 + t.current * 0.7);
      d += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }
    pathRef.current.setAttribute("d", d);
    if (t.current > 1e6) {
      t.current = 0;
      force((n) => n + 1);
    }
  });

  return (
    <svg
      className="absolute inset-0 pointer-events-none mix-blend-screen"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    >
      <defs>
        <linearGradient id="wf" x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path ref={pathRef} stroke="url(#wf)" strokeWidth={1.5} fill="none" />
    </svg>
  );
}