import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Mic, Send, Paperclip, Sparkles } from "lucide-react";
import { Shell } from "@/components/nexus/Shell";
import { QuantumOrb, type AIModelType } from "@/components/nexus/QuantumOrb";
import { ParticleField } from "@/components/nexus/ParticleField";
import { useAeva } from "@/lib/aeva-context";
import { getModel } from "@/lib/models";
import { Square } from "lucide-react";
import { freeWebSearch, buildLiveContext } from "@/lib/websearch";
import { Globe } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Quantum Chat — Nexus" },
      {
        name: "description",
        content: "Cinematic AI chat with adaptive glass panels and streaming reveal.",
      },
    ],
  }),
  component: ChatPage,
});

type Msg = { id: number; role: "user" | "ai"; text: string };
type CleanAIResponse = { text: string; sources: string[] };

function sanitizeAIResponse(text: string): CleanAIResponse {
  const sourceUrls = Array.from(
    new Set(
      (text.match(/https?:\/\/[^\s)\]}>"]+/gi) ?? [])
        .map((url) => url.replace(/[.,;:!?]+$/g, ""))
        .filter((url) => {
          try {
            const parsed = new URL(url);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
          } catch {
            return false;
          }
        }),
    ),
  ).slice(0, 3);

  const cleaned = text
    .replace(/Sources?:\s*(?:\[\d+\]\s*)?(?:https?:\/\/\S+\s*)+/gi, " ")
    .replace(/\[\d+\](?:\s*https?:\/\/\S+)?/g, " ")
    .replace(/\((?:https?:\/\/[^)]+)\)/gi, " ")
    .replace(/https?:\/\/\S+/gi, " ")
    .replace(/\b(?:Source|Sources)\s*:\s*$/gi, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    text: cleaned || "Live context processed. No clean visible summary was returned.",
    sources: sourceUrls,
  };
}

/** Intent Classification Gatekeeper — prevents hyperactive search triggering */
function shouldTriggerSearch(prompt: string): boolean {
  const p = prompt.toLowerCase().trim();

  // 1. Greetings — always bypass
  const greetings = [
    "hello", "hi", "hey", "howdy", "hola", "bonjour", "g'day",
    "good morning", "good afternoon", "good evening", "good night",
    "what's up", "whats up", "sup", "yo", "yo!", "hiya",
  ];
  if (greetings.some((g) => p === g || p.startsWith(g + " "))) return false;

  // 2. Simple conversational acks / filler
  const conversational = [
    "ok", "okay", "k", "kk", "sure", "yes", "no", "maybe", "nah",
    "thanks", "thank you", "thx", "ty", "cool", "nice", "great",
    "awesome", "perfect", "got it", "understood", "roger", "alright",
    "see you", "bye", "goodbye", "later", "talk soon", "take care",
    "lol", "lmao", "haha", "hehe", "wow", "omg", "oh", "ah",
    "i see", "makes sense", "fair enough", "exactly", "absolutely",
    "definitely", "probably", "perhaps", "i think so", "i guess",
    "not really", "i don't know", "idk", "dunno", "no idea",
  ];
  if (conversational.some((c) => p === c || p.startsWith(c + " ") || p.endsWith(" " + c))) return false;

  // 3. Very short (1-2 words) that aren't clearly knowledge queries
  const wordCount = p.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 2) {
    // Allow 1-2 word queries IF they look like knowledge lookups
    const knowledgeStarters = [
      "who", "what", "when", "where", "why", "how", "which",
      "define", "explain", "translate", "meaning", "synonym",
      "weather", "news", "score", "price", "time", "date",
      "capital", "population", "recipe", "calories", "directions",
    ];
    if (!knowledgeStarters.some((k) => p.startsWith(k))) return false;
  }

  // 4. Smart trigger keywords — signals that live data is needed
  const liveKeywords = [
    "latest", "current", "recent", "today", "now", "2026", "2025",
    "news", "weather", "score", "game", "match", "stock", "price",
    "who is", "what happened", "what is", "where is", "when did",
    "how to", "how do", "how much", "how many",
    "compare", "versus", "vs", "difference between",
    "election", "war", "crisis", "update", "breaking",
    "crypto", "bitcoin", "ethereum", "nft",
    "released", "premiere", "debut", "album", "movie", "series",
    "won", "champion", "tournament", "standings", "ranking",
    "forecast", "prediction", "outlook", "trend",
    "net worth", "age of", "born", "died", "death",
    "directions to", "near me", "nearby", "best", "top 10",
    "reddit", "twitter", "youtube", "tiktok", "instagram",
    "wikipedia", "wiki",
  ];
  if (liveKeywords.some((k) => p.includes(k))) return true;

  // 5. Default: for 3+ word prompts that aren't greetings/acks,
  //    allow search only if they look like information-seeking
  //    (contain wh-words, imperative lookups, or are sentence-like)
  const infoPatterns = [
    /\b(who|what|when|where|why|how|which)\b/,
    /\b(define|explain|describe|summarize|translate|convert|calculate)\b/,
    /\b(find|search|look up|tell me about|give me|show me)\b/,
  ];
  if (infoPatterns.some((re) => re.test(p))) return true;

  // 6. Fallback: short pleasantries / ambiguous -> no search
  return false;
}

const seed: Msg[] = [
  { id: 1, role: "user", text: "Sketch a research plan for synthetic protein folding." },
  {
    id: 2,
    role: "ai",
    text: "Begin with a literature sweep across AlphaFold derivatives, then partition the search space into three tractable basins: thermostability, binding affinity, and immunogenicity. We'll iterate weekly with a confidence-weighted ranking model.",
  },
];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const { modelId, generating, setGenerating, stopRequested, clearStop, requestStop } = useAeva();
  const [uplink, setUplink] = useState(false);
  const activeModel = getModel(modelId);
  const orbType: AIModelType =
    activeModel?.category === "coding"
      ? "coding"
      : activeModel?.category === "vision"
        ? "vision"
        : activeModel?.category === "fast"
          ? "fast"
          : "reasoning";
  const streaming = generating;
  const scrollRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function send() {
    if (!input.trim()) return;
    const prompt = input;
    const userMsg: Msg = { id: Date.now(), role: "user", text: prompt };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setGenerating(true);

    const triggerSearch = shouldTriggerSearch(prompt);
    let results: Awaited<ReturnType<typeof freeWebSearch>> = [];
    let liveContext = "";

    if (triggerSearch) {
      // 1) Free web uplink — DuckDuckGo HTML scrape via /api/websearch
      setUplink(true);
      results = await freeWebSearch(prompt);
      liveContext = buildLiveContext(prompt, results);
      setUplink(false);
    }

    const timer = setTimeout(() => {
      if (triggerSearch && results.length) {
        const sourcesLine =
          "\n\nSources: " +
          results
            .slice(0, 3)
            .map((r, i) => `[${i + 1}] ${r.url}`)
            .join("  ");
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            role: "ai",
            text:
              `Live uplink synthesized ${results.length} source${results.length > 1 ? "s" : ""}. ${results[0].snippet}` +
              sourcesLine,
          },
        ]);
      } else if (triggerSearch) {
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            role: "ai",
            text:
              "Synthesizing across 184k tokens · the response cascades in with calibrated certainty. No live sources were found for this query.",
          },
        ]);
      } else {
        // Bypassed search — clean premium OS assistant response
        setMessages((m) => [
          ...m,
          {
            id: Date.now() + 1,
            role: "ai",
            text:
              "Greetings, Operator. AEVA OS is online and ready to assist. What would you like to explore?",
          },
        ]);
      }
      setGenerating(false);
      void liveContext;
    }, triggerSearch ? 900 : 400);
    // best-effort cancel on stop
    const cancel = setInterval(() => {
      if (stopRequested) {
        clearTimeout(timer);
        setGenerating(false);
        clearStop();
        clearInterval(cancel);
      }
    }, 100);
    setTimeout(() => clearInterval(cancel), 2200);
  }

  function autosize() {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }

  return (
    <Shell>
      <section className="glass relative flex h-[calc(100dvh-9.5rem)] flex-col overflow-hidden rounded-2xl md:h-[calc(100dvh-8rem)] md:rounded-3xl">
        <ParticleField count={28} />

        {/* Header with orb */}
        <div className="relative flex items-center justify-between gap-3 border-b border-white/5 px-4 py-4 md:px-8 md:py-6">
          <div className="flex min-w-0 items-center gap-3 md:gap-5">
            <QuantumOrb
              size={56}
              modelType={orbType}
              state={streaming ? "streaming" : "idle"}
              className="md:hidden"
            />
            <QuantumOrb
              size={88}
              modelType={orbType}
              state={streaming ? "streaming" : "idle"}
              className="hidden md:block"
            />
            <div>
              <div
                className="font-mono text-[9px] uppercase tracking-[0.25em] md:text-[10px] md:tracking-[0.3em]"
                style={{ color: "var(--titanium)" }}
              >
                {activeModel?.vendor ?? "quantum"}
              </div>
              <div className="mt-0.5 truncate font-display text-base font-light tracking-tight md:mt-1 md:text-2xl">
                {activeModel?.label ?? "Quantum core"} · {activeModel?.category ?? "reasoning"}
              </div>
              <div className="mt-1 flex items-center gap-2 font-mono text-[9px] text-foreground/50 md:text-[10px]">
                <span
                  className={"h-1.5 w-1.5 rounded-full " + (streaming ? "animate-pulse" : "")}
                  style={{
                    background: streaming
                      ? "var(--neon)"
                      : "color-mix(in oklab, white 40%, transparent)",
                  }}
                />
                {streaming ? "streaming · 1.2M tok" : "idle · ready"}
              </div>
            </div>
          </div>
          <div className="hidden flex-col items-end font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/40 md:flex">
            <span>lat 38ms · 184k tok/s</span>
            <span className="text-[oklch(0.78_0.22_135)]">● live</span>
          </div>
        </div>

        {/* Messages — floating, no bubbles */}
        <div
          ref={scrollRef}
          className="relative flex-1 overflow-y-auto px-4 py-6 md:px-16 md:py-10"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-8 md:gap-12">
            <AnimatePresence initial={false}>
              {messages.map((m) =>
                m.role === "user" ? (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: streaming ? 0.35 : 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="self-end max-w-[90%] md:max-w-[80%]"
                  >
                    <div className="mb-1.5 text-right font-mono text-[9px] uppercase tracking-[0.3em] text-[oklch(0.7_0.09_185)]">
                      operator
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-black/40 px-5 py-3 text-right text-sm text-foreground/90 backdrop-blur-md">
                      {m.text}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.9 }}
                    className="max-w-[92%]"
                  >
                    <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.3em] text-[oklch(0.78_0.22_135)]">
                      <Sparkles className="h-3 w-3" /> atlas-r1
                    </div>
                    <AIResponse text={m.text} />
                  </motion.div>
                ),
              )}
              {streaming && (
                <motion.div
                  key="streaming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-3 font-mono text-xs text-foreground/50"
                >
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.22_135)]"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
                      />
                    ))}
                  </span>
                  resolving quantum response…
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Input */}
        <div className="relative border-t border-white/5 p-3 pb-safe md:p-8">
          <AnimatePresence>
            {uplink && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="mx-auto mb-2 flex max-w-3xl items-center gap-2 px-2 font-mono text-[10px] uppercase tracking-[0.28em]"
                style={{ color: "var(--neon)" }}
              >
                <Globe className="h-3 w-3 animate-spin" style={{ animationDuration: "2.4s" }} />
                <span
                  style={{
                    textShadow: "0 0 12px color-mix(in oklab, var(--neon) 70%, transparent)",
                  }}
                >
                  🌐 Network Uplink Established · Scraping Web…
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-white/8 bg-black/50 p-2 backdrop-blur-xl transition-shadow focus-within:border-[oklch(0.78_0.22_135_/_0.5)] focus-within:shadow-[0_0_40px_-8px_oklch(0.78_0.22_135_/_0.6)] md:gap-3 md:p-3">
            <button
              aria-label="Attach"
              className="touch-target grid place-items-center rounded-xl text-foreground/50 hover:text-[oklch(0.7_0.09_185)]"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <textarea
              ref={taRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autosize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Prompt the quantum core…"
              className="max-h-[160px] min-w-0 flex-1 resize-none bg-transparent px-1 py-2 text-base text-foreground placeholder:text-foreground/30 focus:outline-none md:text-sm"
            />
            <button
              aria-label="Voice"
              className="touch-target hidden place-items-center rounded-xl text-foreground/50 hover:text-[oklch(0.7_0.09_185)] sm:grid"
            >
              <Mic className="h-4 w-4" />
            </button>
            <AnimatePresence mode="wait" initial={false}>
              {streaming ? (
                <motion.button
                  key="stop"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={requestStop}
                  aria-label="Stop generation"
                  className="touch-target grid place-items-center rounded-xl border px-3"
                  style={{
                    borderColor: "color-mix(in oklab, var(--neon) 55%, transparent)",
                    background: "color-mix(in oklab, var(--neon) 14%, transparent)",
                    color: "var(--neon)",
                    boxShadow: "0 0 22px -4px color-mix(in oklab, var(--neon) 70%, transparent)",
                  }}
                >
                  <Square className="h-5 w-5 fill-current md:h-4 md:w-4" />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={send}
                  aria-label="Send"
                  className="touch-target grid place-items-center rounded-xl border px-3"
                  style={{
                    borderColor: "color-mix(in oklab, var(--neon) 50%, transparent)",
                    background: "color-mix(in oklab, var(--neon) 12%, transparent)",
                    color: "var(--neon)",
                    boxShadow: "0 0 22px -4px color-mix(in oklab, var(--neon) 70%, transparent)",
                  }}
                >
                  <Send className="h-5 w-5 md:h-4 md:w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </Shell>
  );
}

function AIResponse({ text }: { text: string }) {
  const clean = sanitizeAIResponse(text);
  return (
    <div className="max-w-full overflow-hidden">
      <StreamingText text={clean.text} />
      {clean.sources.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-white/5 pt-3">
          {clean.sources.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open source ${i + 1}`}
              className="inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 text-[10px] transition-transform hover:scale-105"
              style={{
                borderColor: "color-mix(in oklab, var(--neon) 38%, transparent)",
                background: "color-mix(in oklab, var(--neon) 10%, transparent)",
                color: "var(--neon)",
              }}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span className="ml-1 font-mono">{i + 1}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function StreamingText({ text }: { text: string }) {
  const words = text.split(/(\s+)/).filter(Boolean);
  return (
    <p className="max-w-full whitespace-pre-wrap text-lg leading-relaxed text-foreground/85 [overflow-wrap:anywhere] [word-break:break-word] md:text-xl">
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(8px)", y: 6 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.025, ease: [0.2, 0.8, 0.2, 1] }}
          className="inline"
          style={{
            backgroundImage:
              "linear-gradient(120deg, oklch(0.95 0.05 95), oklch(0.85 0.2 135) 60%, oklch(0.8 0.12 185))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {w}
        </motion.span>
      ))}
    </p>
  );
}
