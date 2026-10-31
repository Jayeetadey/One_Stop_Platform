import { PromptSuggestion } from "@/lib/types";

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    id: "blockchain",
    emoji: "⚡",
    category: "Distributed Systems",
    prompt: "What is blockchain and how does it work?",
    providers: "5 Providers",
    consensusLabel: "Consensus 98%",
  },
  {
    id: "quantum",
    emoji: "🔬",
    category: "Physics & Computation",
    prompt: "Explain quantum computing in plain English",
    providers: "5 Providers",
    consensusLabel: "Consensus 94%",
  },
  {
    id: "scraping",
    emoji: "🐍",
    category: "Software Engineering",
    prompt: "Build a Python program for automated web scraping",
    providers: "Code Benchmark",
    consensusLabel: "Claude Leads",
    leader: "claude",
  },
  {
    id: "react-nextjs",
    emoji: "⚛️",
    category: "Frontend Architecture",
    prompt: "Compare React 19 vs Next.js App Router",
    providers: "5 Providers",
    consensusLabel: "Architectural Matrix",
  },
  {
    id: "ai-chips",
    emoji: "📈",
    category: "Market Intelligence",
    prompt: "Analyze current macro trends in AI chips & compute",
    providers: "Web Live Grounding",
    consensusLabel: "Perplexity Leads",
    leader: "perplexity",
  },
  {
    id: "zkp",
    emoji: "🔐",
    category: "Applied Cryptography",
    prompt: "How does Zero-Knowledge Proof (ZKP) cryptography work?",
    providers: "Deep Math Formulae",
    consensusLabel: "Consensus 96%",
  },
];
