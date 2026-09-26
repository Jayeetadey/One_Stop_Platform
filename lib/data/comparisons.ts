import { RecentComparison } from "@/lib/types";

export const RECENT_COMPARISONS: RecentComparison[] = [
  {
    id: "1",
    engineCount: 5,
    time: "22 mins ago",
    mode: "fast",
    query: "Compare PostgreSQL 16 vs CockroachDB for multi-region active-active clusters",
    bestEngine: "Claude 3.5",
    bestEngineColor: "#61dbb4",
    avgLatency: "640ms",
  },
  {
    id: "2",
    engineCount: 5,
    time: "2 hours ago",
    mode: "deep",
    query: "Summarize legal ramifications of EU AI Act on small-scale generative API wrappers",
    bestEngine: "Perplexity",
    bestEngineColor: "#4cd7f6",
    avgLatency: "1.8s",
  },
  {
    id: "3",
    engineCount: 4,
    time: "Yesterday",
    mode: "fast",
    query: "Refactor Rust Tokio async channels to prevent backpressure lockups",
    bestEngine: "OpenAI GPT-4o",
    bestEngineColor: "#10a37f",
    avgLatency: "512ms",
  },
];

export const MOCK_RESPONSES = {
  query: "What is blockchain and how does it work?",
  consensusPercent: 94,
  avgLatency: "1.4s",
  responses: [
    {
      engineId: "openai",
      tokens: 982,
      latencySeconds: 1.2,
      temperature: 0.2,
      contextWindow: "8.2k context",
      badge: "Best Structure",
      badgeColor: "text-[#61dbb4]",
      contentText:
        "A blockchain is a decentralized, distributed, and immutable digital ledger that systematically records transactions across a secure peer-to-peer network. Every discrete block within the topology stores an encrypted cryptographic hash of the antecedent block, an authoritative timestamp, and validated transaction trees (Merkle roots).",
      pillars: [
        {
          title: "Decentralization",
          desc: "Eliminates single-point master nodes or centralized overseers.",
        },
        {
          title: "Immutability",
          desc: "Historical records cannot be rewritten without 51% adversarial reorganization.",
        },
        {
          title: "Consensus",
          desc: "Synchronized state verification via PoW, PoS, or Raft engines.",
        },
      ],
    },
    {
      engineId: "gemini",
      tokens: 1040,
      latencySeconds: 1.1,
      temperature: 0.3,
      contextWindow: "1M token max",
      badge: "Best Metaphor",
      badgeColor: "text-[#4cd7f6]",
      contentText:
        "Think of a blockchain as an open, globally synchronized Google Sheet that no single party owns, controls, or can unilaterally overwrite without majority validation.",
      executionSteps: [
        "Request Initiation",
        "Gossip Protocol P2P",
        "Merkle Validation",
        "Ledger Sealing",
      ],
    },
    {
      engineId: "claude",
      tokens: 1120,
      latencySeconds: 1.4,
      temperature: 0.1,
      contextWindow: "reasoning-first",
      badge: "Highest Depth",
      badgeColor: "text-[#c0c1ff]",
      contentText:
        "At its foundational computer science level, a blockchain operates as a Byzantine Fault Tolerant (BFT) replicated state machine. It formally resolves the classic Double-Spending anomaly without trusted intermediaries.",
      consensusTable: {
        headers: ["Metric", "Proof of Work", "Proof of Stake"],
        rows: [
          ["Security", "Thermodynamic", "Capital Bonding"],
          ["Throughput", "~7-15 TPS", "2,000+ TPS"],
        ],
      },
      tags: ["Smart Contracts (EVM)", "DePIN Networks", "ZK Verification"],
    },
    {
      engineId: "grok",
      tokens: 870,
      latencySeconds: 0.9,
      temperature: 0.4,
      contextWindow: "realtime feed",
      badge: "Zero Fluff",
      badgeColor: "text-[#dfe2ee]",
      contentText:
        "Bottom line: It's an append-only, tamper-proof record book run by math instead of institutions. You cut out banks, brokers, registrars, and escrow agents. Anyone can audit it, no single cartel can delete a page, and every new transaction is cryptographically stapled to the previous one forever.",
      bullets: [
        {
          title: "No Master Keys",
          desc: "Private keys sign transactions directly.",
        },
        {
          title: "Deterministic Rules",
          desc: "Code defines transaction validity, not humans.",
        },
        {
          title: "Censorship Resistance",
          desc: "Open gossip layer propagates state globally.",
        },
      ],
    },
    {
      engineId: "perplexity",
      tokens: 0,
      latencySeconds: 1.6,
      temperature: 0,
      contextWindow: "indexed 2m ago",
      badge: "6 Citations",
      badgeColor: "text-[#4cd7f6]",
      contentText:
        "Blockchain constitutes a continuous cryptographic chain of timestamped records maintained across thousands of independent computing nodes.",
      citations: [
        {
          num: 1,
          label: "Nakamoto Consensus Spec (bitcoin.org)",
          href: "#",
        },
        {
          num: 2,
          label: "IEEE Blockchain Interoperability Stds",
          href: "#",
        },
      ],
    },
  ],
};
