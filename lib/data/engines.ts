import { AIEngine } from "@/lib/types";

export const AI_ENGINES: AIEngine[] = [
  {
    id: "openai",
    name: "OpenAI",
    provider: "OpenAI",
    model: "GPT-4o Omnimodal",
    color: "#10a37f",
    glowColor: "rgba(16,163,127,0.4)",
    badge: "Direct API",
    icon: "cyclone",
    latency: 380,
    uptime: "99.9%",
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google Gemini",
    model: "Gemini 1.5 Pro",
    color: "#4285f4",
    glowColor: "rgba(66,133,244,0.4)",
    badge: "Ultra Window",
    icon: "auto_awesome",
    latency: 410,
    uptime: "100%",
  },
  {
    id: "claude",
    name: "Claude",
    provider: "Anthropic Claude",
    model: "Claude 3.5 Sonnet",
    color: "#d97706",
    glowColor: "rgba(217,119,6,0.4)",
    badge: "Hybrid 200k",
    icon: "blur_on",
    latency: 460,
    uptime: "99.8%",
  },
  {
    id: "grok",
    name: "Grok",
    provider: "xAI Grok",
    model: "Grok 2 Enterprise",
    color: "#ec4899",
    glowColor: "rgba(236,72,153,0.4)",
    badge: "Fastest",
    icon: "bolt",
    latency: 320,
    uptime: "100%",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    provider: "Perplexity",
    model: "Sonar Pro Live",
    color: "#22d3ee",
    glowColor: "rgba(34,211,238,0.4)",
    badge: "Web Citations",
    icon: "travel_explore",
    latency: 590,
    uptime: "99.9%",
  },
];

export const ENGINE_MAP = Object.fromEntries(
  AI_ENGINES.map((e) => [e.id, e])
);
