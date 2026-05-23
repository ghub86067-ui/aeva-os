import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_MODEL_ID, getModel } from "./models";

interface AevaState {
  modelId: string;
  setModelId: (id: string) => void;
  apiKey: string;
  setApiKey: (k: string) => void;
  theme: "green" | "blue";
  generating: boolean;
  setGenerating: (g: boolean) => void;
  stopRequested: boolean;
  requestStop: () => void;
  clearStop: () => void;
}

const AevaCtx = createContext<AevaState | null>(null);

export function AevaProvider({ children }: { children: ReactNode }) {
  const [modelId, setModelIdState] = useState<string>(DEFAULT_MODEL_ID);
  const [apiKey, setApiKeyState] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const m = localStorage.getItem("aeva:model");
      const k = localStorage.getItem("aeva:nvidia_key");
      if (m) setModelIdState(m);
      if (k) setApiKeyState(k);
    } catch {}
  }, []);

  const theme = getModel(modelId)?.theme ?? "green";

  // apply theme to <body data-theme>
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.theme = theme;
    }
  }, [theme]);

  const setModelId = (id: string) => {
    setModelIdState(id);
    try { localStorage.setItem("aeva:model", id); } catch {}
  };
  const setApiKey = (k: string) => {
    setApiKeyState(k);
    try { localStorage.setItem("aeva:nvidia_key", k); } catch {}
  };
  const requestStop = () => setStopRequested(true);
  const clearStop = () => setStopRequested(false);

  return (
    <AevaCtx.Provider value={{ modelId, setModelId, apiKey, setApiKey, theme, generating, setGenerating, stopRequested, requestStop, clearStop }}>
      {children}
    </AevaCtx.Provider>
  );
}

export function useAeva() {
  const ctx = useContext(AevaCtx);
  if (!ctx) throw new Error("useAeva must be used within AevaProvider");
  return ctx;
}