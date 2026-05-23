import type { ReactNode } from "react";
import { useState } from "react";
import { TopNav } from "./TopNav";
import { Modal } from "./Modal";
import { NeonButton } from "./NeonButton";
import { SideDock } from "./SideDock";

interface ShellProps {
  children: ReactNode;
  maxWidth?: string;
  /** When true, removes default page padding so route can manage its own dvh layout (e.g. chat). */
  fullBleed?: boolean;
}

export function Shell({ children, maxWidth = "1480px", fullBleed = false }: ShellProps) {
  const [modal, setModal] = useState(false);
  return (
    <div className="relative min-h-dvh overflow-hidden pt-safe">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-[320px] w-[320px] rounded-full blur-[90px] md:h-[480px] md:w-[480px] md:blur-[120px]" style={{ background: "color-mix(in oklab, var(--neon) 15%, transparent)" }} />
        <div className="absolute top-1/3 -right-20 h-[340px] w-[340px] rounded-full blur-[100px] md:h-[520px] md:w-[520px] md:blur-[140px]" style={{ background: "color-mix(in oklab, var(--titanium) 15%, transparent)" }} />
        <div className="absolute bottom-0 left-1/3 hidden h-[420px] w-[420px] rounded-full bg-[oklch(0.45_0.18_290_/_0.10)] blur-[140px] md:block" />
      </div>
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40 md:opacity-50" />

      <div
        className={
          "relative mx-auto flex gap-6 pl-16 md:pl-20 " +
          (fullBleed ? "pr-0 py-0 md:pr-6 md:py-6" : "pr-3 py-3 md:pr-6 md:py-6")
        }
        style={{ maxWidth }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-6">
          {!fullBleed && <TopNav onLaunch={() => setModal(true)} />}
          {children}
        </div>
      </div>

      <SideDock />

      <Modal open={modal} onClose={() => setModal(false)} title="Deploy">
        <p className="text-sm text-foreground/70">Push the current workspace to staging?</p>
        <div className="mt-6 flex justify-end gap-3">
          <NeonButton variant="ghost" size="sm" onClick={() => setModal(false)}>Cancel</NeonButton>
          <NeonButton size="sm" onClick={() => setModal(false)}>Confirm</NeonButton>
        </div>
      </Modal>
    </div>
  );
}