export type ModelTheme = "green" | "blue";
export type ModelCategory = "reasoning" | "fast" | "coding" | "vision" | "general";

export interface AevaModel {
  id: string;
  label: string;
  vendor: string;
  theme: ModelTheme;
  category: ModelCategory;
  hint?: string;
}

export const MODELS: AevaModel[] = [
  // Primary theme triggers
  { id: "meta/llama-3.3-70b-instruct", label: "Llama 3.3 70B", vendor: "Meta", theme: "green", category: "reasoning", hint: "neon green core" },
  { id: "deepseek-ai/deepseek-r1", label: "DeepSeek R1", vendor: "DeepSeek", theme: "blue", category: "reasoning", hint: "electric blue core" },

  // NVIDIA family
  { id: "nvidia/llama-3.3-nemotron-super-49b-v1", label: "Nemotron Super 49B", vendor: "NVIDIA", theme: "green", category: "reasoning" },
  { id: "nvidia/llama-3.3-nemotron-super-49b-v1.5", label: "Nemotron Super 49B v1.5", vendor: "NVIDIA", theme: "green", category: "reasoning" },
  { id: "nvidia/llama-3.1-nemotron-nano-8b-v1", label: "Nemotron Nano 8B", vendor: "NVIDIA", theme: "green", category: "fast" },
  { id: "nvidia/llama-3.1-nemotron-nano-vl-8b-v1", label: "Nemotron Nano VL 8B", vendor: "NVIDIA", theme: "green", category: "vision" },
  { id: "nvidia/nemotron-nano-12b-v2-vl", label: "Nemotron Nano 12B VL", vendor: "NVIDIA", theme: "green", category: "vision" },
  { id: "nvidia/nvidia-nemotron-nano-9b-v2", label: "Nemotron Nano 9B v2", vendor: "NVIDIA", theme: "green", category: "fast" },
  { id: "nvidia/nemotron-mini-4b-instruct", label: "Nemotron Mini 4B", vendor: "NVIDIA", theme: "green", category: "fast" },
  { id: "nvidia/usdcode", label: "USDCode", vendor: "NVIDIA", theme: "green", category: "coding" },

  // Meta
  { id: "meta/llama-4-maverick-17b-128e-instruct", label: "Llama 4 Maverick 17B", vendor: "Meta", theme: "green", category: "reasoning" },
  { id: "meta/llama-3.2-90b-vision-instruct", label: "Llama 3.2 90B Vision", vendor: "Meta", theme: "green", category: "vision" },
  { id: "meta/llama-3.2-11b-vision-instruct", label: "Llama 3.2 11B Vision", vendor: "Meta", theme: "green", category: "vision" },
  { id: "meta/llama-3.2-3b-instruct", label: "Llama 3.2 3B", vendor: "Meta", theme: "green", category: "fast" },
  { id: "meta/llama-3.2-1b-instruct", label: "Llama 3.2 1B", vendor: "Meta", theme: "green", category: "fast" },
  { id: "meta/llama-3.1-70b-instruct", label: "Llama 3.1 70B", vendor: "Meta", theme: "green", category: "reasoning" },
  { id: "meta/llama-3.1-8b-instruct", label: "Llama 3.1 8B", vendor: "Meta", theme: "green", category: "fast" },

  // Google
  { id: "google/gemma-3-27b-it", label: "Gemma 3 27B", vendor: "Google", theme: "blue", category: "general" },
  { id: "google/gemma-3n-e4b-it", label: "Gemma 3n E4B", vendor: "Google", theme: "blue", category: "fast" },
  { id: "google/gemma-3n-e2b-it", label: "Gemma 3n E2B", vendor: "Google", theme: "blue", category: "fast" },
  { id: "google/gemma-2-2b-it", label: "Gemma 2 2B", vendor: "Google", theme: "blue", category: "fast" },

  // Mistral
  { id: "mistralai/mistral-medium-3-instruct", label: "Mistral Medium 3", vendor: "Mistral", theme: "blue", category: "general" },
  { id: "mistralai/mistral-nemotron", label: "Mistral Nemotron", vendor: "Mistral", theme: "blue", category: "general" },
  { id: "mistralai/magistral-small-2506", label: "Magistral Small 2506", vendor: "Mistral", theme: "blue", category: "fast" },
  { id: "mistralai/mixtral-8x22b-instruct-v0.1", label: "Mixtral 8x22B", vendor: "Mistral", theme: "blue", category: "reasoning" },
  { id: "mistralai/mixtral-8x7b-instruct-v0.1", label: "Mixtral 8x7B", vendor: "Mistral", theme: "blue", category: "general" },
  { id: "mistralai/mistral-7b-instruct-v0.3", label: "Mistral 7B v0.3", vendor: "Mistral", theme: "blue", category: "fast" },

  // Qwen
  { id: "qwen/qwen3-next-80b-a3b-instruct", label: "Qwen3 Next 80B", vendor: "Qwen", theme: "blue", category: "reasoning" },
  { id: "qwen/qwen3-next-80b-a3b-thinking", label: "Qwen3 Next 80B Thinking", vendor: "Qwen", theme: "blue", category: "reasoning" },
  { id: "qwen/qwen3-coder-480b-a35b-instruct", label: "Qwen3 Coder 480B", vendor: "Qwen", theme: "blue", category: "coding" },
  { id: "qwen/qwen2.5-coder-32b-instruct", label: "Qwen2.5 Coder 32B", vendor: "Qwen", theme: "blue", category: "coding" },

  // OpenAI OSS
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", vendor: "OpenAI", theme: "blue", category: "reasoning" },
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B", vendor: "OpenAI", theme: "blue", category: "general" },

  // Microsoft
  { id: "microsoft/phi-4-multimodal-instruct", label: "Phi-4 Multimodal", vendor: "Microsoft", theme: "blue", category: "vision" },
  { id: "microsoft/phi-4-mini-instruct", label: "Phi-4 Mini", vendor: "Microsoft", theme: "blue", category: "fast" },

  // Misc
  { id: "bytedance/seed-oss-36b-instruct", label: "Seed OSS 36B", vendor: "ByteDance", theme: "blue", category: "general" },
  { id: "stockmark/stockmark-2-100b-instruct", label: "Stockmark 2 100B", vendor: "Stockmark", theme: "blue", category: "reasoning" },
  { id: "sarvamai/sarvam-m", label: "Sarvam M", vendor: "SarvamAI", theme: "blue", category: "general" },
  { id: "moonshotai/kimi-k2-instruct", label: "Kimi K2", vendor: "Moonshot", theme: "blue", category: "general" },
  { id: "abacusai/dracarys-llama-3.1-70b-instruct", label: "Dracarys Llama 70B", vendor: "AbacusAI", theme: "green", category: "coding" },
];

export function getModel(id: string): AevaModel | undefined {
  return MODELS.find((m) => m.id === id);
}

export const DEFAULT_MODEL_ID = "meta/llama-3.3-70b-instruct";