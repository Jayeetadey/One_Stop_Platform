"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  Plus,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  PanelLeftClose,
  PanelLeft,
  SquarePen,
  ChevronDown,
  Columns,
  MessageSquare,
  Search,
  ExternalLink,
  Code,
  Terminal,
  Mic,
  FolderKanban,
  CalendarClock,
  Film,
  Image,
  MoreHorizontal,
  Settings,
  LogOut,
  User,
  X,
  Key,
  Trash2,
  Shield,
  CreditCard,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

interface ModelResponse {
  engineId: string;
  name: string;
  provider: string;
  color: string;
  time: string;
  tokens: string;
  content: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  responses?: ModelResponse[];
  selectedModel?: string;
}

interface Conversation {
  id: string;
  title: string;
  category: "Today" | "Yesterday" | "Previous 7 days";
  messages: Message[];
}

const ENGINES = [
  { id: "openai", name: "GPT-4o", provider: "OpenAI", color: "#10a37f" },
  { id: "gemini", name: "Gemini 1.5 Pro", provider: "Google", color: "#4285f4" },
  { id: "claude", name: "Claude 3.5 Sonnet", provider: "Anthropic", color: "#d97706" },
  { id: "grok", name: "Grok 2", provider: "xAI", color: "#ec4899" },
  { id: "perplexity", name: "Sonar Pro", provider: "Perplexity", color: "#22d3ee" },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "What is blockchain and how does it work?",
    category: "Today",
    messages: [
      {
        id: "m-1",
        role: "user",
        content: "What is blockchain and how does it work?",
      },
      {
        id: "m-2",
        role: "assistant",
        selectedModel: "openai",
        responses: [
          {
            engineId: "openai",
            name: "GPT-4o",
            provider: "OpenAI",
            color: "#10a37f",
            time: "1.2s",
            tokens: "384 tokens",
            content: `A **blockchain** is a decentralized, distributed, and cryptographically secured digital ledger that records transactions across a network of computers.

### Core Architecture
1. **Blocks**: Batches of validated transactions with a timestamp and a cryptographic nonce.
2. **Hash Links**: Each block contains the cryptographic hash of the prior block, forming an unbreakable sequential chain.
3. **Decentralization**: Copies of the ledger are synchronized across thousands of independent nodes without a central authority.

### How a Transaction Works
- **Step 1 — Initiation**: A user authorizes a transaction with their private cryptographic key.
- **Step 2 — Propagation**: The transaction broadcasts across the peer-to-peer gossip network.
- **Step 3 — Consensus**: Validator nodes verify signatures and agree on the new block via consensus (Proof of Stake or Proof of Work).
- **Step 4 — Finality**: The block is appended permanently. Once confirmed, modifying any prior record would require recomputing all subsequent hashes.`,
          },
          {
            engineId: "gemini",
            name: "Gemini 1.5 Pro",
            provider: "Google",
            color: "#4285f4",
            time: "1.1s",
            tokens: "410 tokens",
            content: `Think of a blockchain as an **append-only, shared digital notebook** that thousands of people hold identical copies of.

### The Mental Model
Imagine a Google Doc where:
- Anyone can read the contents.
- Anyone can propose adding a new row.
- **Nobody can edit or delete an existing row.**
- A collective vote validates every new line before it gets locked forever.

\`\`\`text
Block #104829
├── Prev Hash:  0000abc49f8...
├── Timestamp:  1740940800
├── Data:       [Alice -> Bob 2.5 ETH]
└── Block Hash: 0000ff94b1a...
\`\`\`

### Why It Matters
Because trust is embedded into the protocol via **mathematics and cryptographic hashing**, participants do not need to rely on intermediaries like banks, clearinghouses, or central servers.`,
          },
          {
            engineId: "claude",
            name: "Claude 3.5 Sonnet",
            provider: "Anthropic",
            color: "#d97706",
            time: "1.4s",
            tokens: "460 tokens",
            content: `At its foundation, a blockchain is a **Byzantine Fault Tolerant replicated state machine**.

### The Problem It Solves: Double Spending
In digital systems, copying data costs almost nothing. Before blockchain, preventing someone from copying and spending the same digital currency twice required a trusted central ledger (like a bank). Blockchain solved this without central authority through three primitives:

1. **Asymmetric Cryptography**: Public keys identify accounts; private keys sign transactions.
2. **Merkle Trees**: Efficiently summarize and verify the integrity of thousands of transactions in a single root hash.
3. **Sybil Resistance**: Proof of Work (computation expenditure) or Proof of Stake (capital bond) ensures bad actors cannot cheaply overwhelm the network vote.

| Consensus Model | Primary Metric | Energy Impact | Finality Time |
|---|---|---|---|
| **Proof of Work** | Hash rate / Computing | High | 10–60 min |
| **Proof of Stake** | Staked collateral | Negligible (<0.1%) | Seconds–Minutes |

The fundamental breakthrough was turning game-theoretic incentives into distributed data security.`,
          },
          {
            engineId: "grok",
            name: "Grok 2",
            provider: "xAI",
            color: "#ec4899",
            time: "0.9s",
            tokens: "312 tokens",
            content: `**It's a ledger governed by math and code rather than corporate institutions.**

Here is the straight-to-the-point breakdown:
- **No Boss**: Zero single points of failure. Even if governments or hosting providers pull the plug on half the nodes, the network hums along uninterrupted.
- **Append-Only**: You can write to it, but you can never erase a page. Every entry is chained to the previous one with cryptographic hashes.
- **Code is Law**: Smart contracts automate transactions based on strict logic without requiring lawyers or escrow agents.

Everything from decentralized finance (DeFi) to digital asset ownership stems from these properties.`,
          },
          {
            engineId: "perplexity",
            name: "Sonar Pro",
            provider: "Perplexity",
            color: "#22d3ee",
            time: "1.5s",
            tokens: "395 tokens",
            content: `Blockchain is a distributed ledger technology (DLT) introduced by Satoshi Nakamoto in 2008 [1].

### Key Mechanics & Modern Standards
- **Layer 1 vs Layer 2**: While base layers like Bitcoin and Ethereum handle core settlement and security, Layer-2 rollups (Arbitrum, Optimism, zkSync) execute transactions off-chain to achieve 2,000+ TPS [2].
- **Cryptographic Primacy**: Transactions rely on elliptic curve cryptography (secp256k1 or Ed25519) and SHA-256 / Keccak-256 hash functions.
- **Enterprise Adoption**: Modern deployments include institutional cross-border settlement (e.g. SWIFT RLN pilots) and tokenized real-world assets (RWA).

**Citations:**
[1] Nakamoto, S. *Bitcoin: A Peer-to-Peer Electronic Cash System* (2008).
[2] Ethereum Foundation *Rollup Roadmap & Scalability Architecture* (2024-2025).`,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Compare PostgreSQL vs CockroachDB",
    category: "Today",
    messages: [
      {
        id: "m-3",
        role: "user",
        content: "Compare PostgreSQL vs CockroachDB",
      },
      {
        id: "m-4",
        role: "assistant",
        selectedModel: "openai",
        responses: [
          {
            engineId: "openai",
            name: "GPT-4o",
            provider: "OpenAI",
            color: "#10a37f",
            time: "1.3s",
            tokens: "430 tokens",
            content: `**PostgreSQL** and **CockroachDB** both offer relational SQL semantics, but they target fundamentally different architectural paradigms.

### Summary Comparison
- **PostgreSQL**: Monolithic primary-replica architecture. Perfect for single-region workloads, complex analytical extensions (PostGIS, pgvector), and low-latency single-node transactions.
- **CockroachDB**: Native distributed SQL database inspired by Google Spanner. Built on Raft consensus, offering automatic sharding, multi-region survivability, and horizontal scaling out of the box.

\`\`\`sql
-- Both support standard Postgres dialect
SELECT user_id, email, balance 
FROM accounts 
WHERE active = true 
ORDER BY created_at DESC 
LIMIT 10;
\`\`\`

**Recommendation**: Choose Postgres if you need maximum feature richness, lowest single-node read latency, or cost efficiency. Choose CockroachDB if zero-downtime multi-region survivability and horizontal write scale are mission-critical.`,
          },
          {
            engineId: "gemini",
            name: "Gemini 1.5 Pro",
            provider: "Google",
            color: "#4285f4",
            time: "1.2s",
            tokens: "380 tokens",
            content: `### High-Level Architectural Differences

| Feature | PostgreSQL | CockroachDB |
|---|---|---|
| **Architecture** | Single-leader active/passive | Distributed peer-to-peer (Raft) |
| **Horizontal Write Scale** | Difficult (requires Citus/sharding) | Native & automatic |
| **Ecosystem & Extensions** | Unmatched (pgvector, Timescale) | Limited (emulates PG wire) |
| **High Availability** | Failover fail-risk | Automatic node self-healing |
| **Latency** | Extremely low (<1ms local) | Slightly higher consensus latency |

If your data fits on a single substantial instance, standard Postgres wins in speed and simplicity.`,
          },
          {
            engineId: "claude",
            name: "Claude 3.5 Sonnet",
            provider: "Anthropic",
            color: "#d97706",
            time: "1.5s",
            tokens: "420 tokens",
            content: `### Consistency Models & Operational Trade-offs

- **CockroachDB**: Enforces serializable isolation by default using multi-version concurrency control (MVCC) combined with hybrid logical clocks (HLC) and Raft consensus. This guarantees ACID compliance across geographical boundaries, but comes at the cost of cross-node network roundtrips.
- **PostgreSQL**: Defaults to Read Committed. Highly optimized memory buffer management with WAL (Write Ahead Logging).

**Operational Verdict**:
Postgres is significantly easier and cheaper to operate for 95% of applications. CockroachDB shines when you must survive entire cloud data center outages without human intervention.`,
          },
          {
            engineId: "grok",
            name: "Grok 2",
            provider: "xAI",
            color: "#ec4899",
            time: "1.0s",
            tokens: "310 tokens",
            content: `Bottom line:
- **Postgres** is the reliable workhorse of the internet. It handles massive traffic easily, costs less, and has the richest plugin ecosystem in existence.
- **CockroachDB** is distributed Postgres on steroids. When an entire AWS region goes dark, CockroachDB doesn't even blink.

If you don't have petabyte scale or multi-continent active-active requirements, stick with Postgres.`,
          },
          {
            engineId: "perplexity",
            name: "Sonar Pro",
            provider: "Perplexity",
            color: "#22d3ee",
            time: "1.4s",
            tokens: "360 tokens",
            content: `According to recent benchmarks, PostgreSQL achieves up to 3x higher single-node transaction throughput than distributed SQL engines due to lack of Raft consensus overhead [1].

However, CockroachDB eliminates single-point-of-failure risks and enables geo-partitioning to comply with data sovereignty regulations like GDPR [2].

**Sources:**
[1] VLDB Distributed Database Benchmark Survey
[2] Cockroach Labs Multi-Region Architecture Whitepaper`,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    title: "EU AI Act legal ramifications",
    category: "Yesterday",
    messages: [
      {
        id: "m-5",
        role: "user",
        content: "Explain the EU AI Act legal ramifications for software companies.",
      },
    ],
  },
  {
    id: "4",
    title: "Rust async backpressure patterns",
    category: "Yesterday",
    messages: [
      {
        id: "m-6",
        role: "user",
        content: "What are the best patterns for managing async backpressure in Rust?",
      },
    ],
  },
  {
    id: "5",
    title: "Zero-Knowledge Proof cryptography",
    category: "Previous 7 days",
    messages: [
      {
        id: "m-7",
        role: "user",
        content: "Explain Zero-Knowledge Proofs and ZK-SNARKs simply.",
      },
    ],
  },
];

const SUGGESTIONS = [
  {
    title: "Explain blockchain",
    subtitle: "Consensus, hashing & peer-to-peer ledger",
    prompt: "What is blockchain and how does it work?",
  },
  {
    title: "Postgres vs CockroachDB",
    subtitle: "Architecture, scaling, and ACID trade-offs",
    prompt: "Compare PostgreSQL vs CockroachDB",
  },
  {
    title: "Zero-Knowledge Proofs",
    subtitle: "ZK-SNARKs and mathematical verification",
    prompt: "Explain Zero-Knowledge Proofs and ZK-SNARKs simply.",
  },
  {
    title: "Async Backpressure in Rust",
    subtitle: "Tokio channels, bounded buffers, and actor patterns",
    prompt: "What are the best patterns for managing async backpressure in Rust?",
  },
];

export default function ChatGPTInterface() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [currentId, setCurrentId] = useState<string>("1");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"tab" | "grid">("tab");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeModelMap, setActiveModelMap] = useState<Record<string, string>>({
    "m-2": "openai",
    "m-4": "openai",
  });
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [sidebarSection, setSidebarSection] = useState<"projects" | "chats" | "schedule" | "media">("chats");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isLogOutOpen, setIsLogOutOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"general" | "models" | "account">("general");
  const [userName, setUserName] = useState("Ahana");
  const [userEmail, setUserEmail] = useState("ahana@onestop.ai");
  const [userPlan, setUserPlan] = useState<"Free" | "Pro">("Pro");
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("dark");
  const [systemIsDark, setSystemIsDark] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("onestop_theme");
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeMode(saved);
      }
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      setSystemIsDark(media.matches);
      const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }
  }, []);

  const isDark = themeMode === "system" ? systemIsDark : themeMode === "dark";

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.body.style.backgroundColor = "#212121";
        document.body.style.color = "#ececec";
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "#ffffff";
        document.body.style.color = "#0d0d0d";
      }
    }
  }, [isDark]);

  const handleThemeChange = (newMode: "dark" | "light" | "system") => {
    setThemeMode(newMode);
    localStorage.setItem("onestop_theme", newMode);
    triggerToast(`Theme set to ${newMode.charAt(0).toUpperCase() + newMode.slice(1)} Mode`);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState({
    openai: "sk-proj-••••••••••••••••••••",
    anthropic: "sk-ant-••••••••••••••••",
    gemini: "AIzaSy••••••••••••••••••",
    grok: "xai-••••••••••••••••••••",
    perplexity: "pplx-••••••••••••••••••",
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Mock data for Left Up Navigation Sections
  const [projects, setProjects] = useState([
    { id: "p1", name: "FinTech Multi-Engine Analysis", updated: "2h ago", filesCount: 12 },
    { id: "p2", name: "Distributed Consensus Whitepaper", updated: "Yesterday", filesCount: 5 },
    { id: "p3", name: "Full-Stack Rust Migration", updated: "3d ago", filesCount: 18 },
    { id: "p4", name: "Autonomous Agent Evaluator", updated: "5d ago", filesCount: 8 },
  ]);

  const [schedules, setSchedules] = useState([
    { id: "s1", title: "Daily 9:00 AM Multi-Engine Benchmark", time: "09:00 AM", priority: "high", recurring: "Daily" },
    { id: "s2", title: "Token Quota Reset & Billing Audit", time: "Sun 11:59 PM", priority: "medium", recurring: "Weekly" },
    { id: "s3", title: "Sonar Pro Realtime Feed Sync", time: "Every 4 hrs", priority: "low", recurring: "Recurring" },
  ]);

  const [mediaItems, setMediaItems] = useState([
    { id: "m1", title: "ZK-Rollup Architecture Diagram", type: "image", resolution: "4K PNG", created: "Today" },
    { id: "m2", title: "AI Model Latency Comparison Visual", type: "video", resolution: "60 FPS MP4", created: "Yesterday" },
    { id: "m3", title: "Distributed Consensus Flowchart", type: "image", resolution: "SVG Vector", created: "2d ago" },
    { id: "m4", title: "Neural Token Sampling Simulation", type: "video", resolution: "1080p MP4", created: "3d ago" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice input handler using Web Speech API
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    let finalTranscript = inputValue;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      setInputValue(finalTranscript + (interimTranscript ? " " + interimTranscript : ""));
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const userMenuRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Auto-resize input textarea to fit multi-line queries dynamically
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [inputValue]);

  // Click outside listener to smoothly close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Escape key closes active popups and modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
        setIsUpgradeOpen(false);
        setIsLogOutOpen(false);
        setUserMenuOpen(false);
        setModelDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentChat = conversations.find((c) => c.id === currentId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages, isGenerating]);

  const handleSelectModel = (messageId: string, engineId: string) => {
    setActiveModelMap((prev) => ({ ...prev, [messageId]: engineId }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleNewChat = () => {
    setSidebarSection("chats");
    const newId = Date.now().toString();
    const newChat: Conversation = {
      id: newId,
      title: "New chat",
      category: "Today",
      messages: [],
    };
    setConversations([newChat, ...conversations]);
    setCurrentId(newId);
    setInputValue("");
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    const userMessage: Message = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
    };

    const isNew = currentChat.messages.length === 0;
    const updatedTitle = isNew ? text.slice(0, 38) + (text.length > 38 ? "..." : "") : currentChat.title;

    // Update conversation with user message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentId
          ? {
              ...c,
              title: updatedTitle,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    );

    setIsGenerating(true);

    // Simulate simultaneous frontier model queries
    setTimeout(() => {
      const assistantMessageId = "a-" + Date.now();
      const generatedResponses: ModelResponse[] = [
        {
          engineId: "openai",
          name: "GPT-4o",
          provider: "OpenAI",
          color: "#10a37f",
          time: "1.1s",
          tokens: "340 tokens",
          content: `Here is a clear, structured overview regarding **${text}**:

### Core Principles
1. **Definition & Scope**: When addressing ${text}, the primary consideration involves system design, reliability, and clear interface contracts.
2. **Direct Application**: Implement standard modular abstractions to avoid tight coupling between components.
3. **Best Practices**:
   - Maintain deterministic execution paths.
   - Always validate inputs at system boundaries.
   - Structure data flows for observability and graceful fallback.

\`\`\`typescript
// Production reference pattern
export async function executeWorkload(query: string): Promise<Result> {
  const verified = await validateContext(query);
  return processWorkflow(verified);
}
\`\`\``,
        },
        {
          engineId: "gemini",
          name: "Gemini 1.5 Pro",
          provider: "Google",
          color: "#4285f4",
          time: "0.9s",
          tokens: "380 tokens",
          content: `### Gemini Analysis on "${text}"

**The High-Level Concept:**
Think of this in three distinct phases:
- **Phase 1: Input & Ingestion** — Normalizing parameters and establishing bounds.
- **Phase 2: Processing Engine** — Leveraging optimized computational paths.
- **Phase 3: Output & Verification** — Ensuring responses adhere to strict consistency requirements.

*Key strength here is horizontal flexibility without compromising baseline safety.*`,
        },
        {
          engineId: "claude",
          name: "Claude 3.5 Sonnet",
          provider: "Anthropic",
          color: "#d97706",
          time: "1.4s",
          tokens: "415 tokens",
          content: `### Nuanced Examination: ${text}

To analyze this comprehensively, we need to balance theoretical guarantees against real-world engineering constraints.

| Dimension | Consideration | Recommended Strategy |
|---|---|---|
| **Correctness** | Invariant preservation | Rigorous type contracts & tests |
| **Performance** | Latency vs throughput | Bounded concurrency & buffering |
| **Maintainability** | Cognitive load | Minimal surface area APIs |

The pivotal insight is prioritizing predictable failure modes over premature micro-optimizations.`,
        },
        {
          engineId: "grok",
          name: "Grok 2",
          provider: "xAI",
          color: "#ec4899",
          time: "0.8s",
          tokens: "290 tokens",
          content: `Direct answer on **${text}**:

Cut the unnecessary fluff and focus on what actually moves the needle:
- **Keep it dead simple.** If a solution requires three layers of indirection, refactor it.
- **Measure before tuning.** Most bottlenecks aren't where you think they are.
- **Automate the repetitive parts.**

Build cleanly, test thoroughly, and ship.`,
        },
        {
          engineId: "perplexity",
          name: "Sonar Pro",
          provider: "Perplexity",
          color: "#22d3ee",
          time: "1.3s",
          tokens: "360 tokens",
          content: `Synthesized research regarding **${text}** [1]:

- Modern consensus points toward standardizing on modular, verifiable architectures [2].
- Recent benchmarks demonstrate significant efficiency gains when using unified multi-model pipelines rather than isolated point solutions.

**Sources:**
[1] ACM Computing Surveys, Volume 57, Issue 4.
[2] IEEE Software Architecture Guidelines.`,
        },
      ];

      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        responses: generatedResponses,
        selectedModel: "openai",
      };

      setActiveModelMap((prev) => ({
        ...prev,
        [assistantMessageId]: "openai",
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentId
            ? {
                ...c,
                messages: [...c.messages, assistantMessage],
              }
            : c
        )
      );

      setIsGenerating(false);
    }, 800);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = "";

    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.trim().startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace("```", "") || "plaintext";
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          const codeContent = codeBuffer.join("\n");
          elements.push(
            <div key={`code-${idx}`} className={`my-3 rounded-lg overflow-hidden border ${isDark ? "border-[#3e3e3e] bg-[#171717]" : "border-[#e0e0e0] bg-[#f7f7f8]"}`}>
              <div className={`flex items-center justify-between px-3.5 py-1.5 border-b text-xs font-mono ${isDark ? "bg-[#212121] border-[#333] text-[#b4b4b4]" : "bg-[#efefef] border-[#e0e0e0] text-[#555]"}`}>
                <span>{codeLanguage}</span>
                <button
                  onClick={() => handleCopy(codeContent, `code-${idx}`)}
                  className={`flex items-center gap-1 transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}
                >
                  {copiedId === `code-${idx}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className={`p-3 text-[13px] font-mono overflow-x-auto leading-relaxed ${isDark ? "text-[#ececec]" : "text-[#1a1a1a]"}`}>
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Empty line
      if (!line.trim()) {
        elements.push(<div key={`sp-${idx}`} className="h-2" />);
        return;
      }

      // Heading 3
      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={`h3-${idx}`} className={`text-base font-semibold mt-4 mb-1 ${isDark ? "text-[#ececec]" : "text-[#0d0d0d]"}`}>
            {line.replace("### ", "")}
          </h3>
        );
        return;
      }

      // Heading 2
      if (line.startsWith("## ")) {
        elements.push(
          <h2 key={`h2-${idx}`} className={`text-lg font-bold mt-5 mb-2 ${isDark ? "text-[#ececec]" : "text-[#0d0d0d]"}`}>
            {line.replace("## ", "")}
          </h2>
        );
        return;
      }

      // Table line
      if (line.trim().startsWith("|")) {
        const cells = line
          .split("|")
          .filter((c) => c.trim().length > 0)
          .map((c) => c.trim());
        if (cells.every((c) => /^[-:]+$/.test(c))) return; // divider
        const isHeader = line.includes("---") || idx === 0;
        elements.push(
          <div
            key={`tbl-${idx}`}
            className={`grid gap-2 py-1 px-2 text-xs font-mono border-b ${isDark ? "border-[#2e2e2e]" : "border-[#e5e5e5]"}`}
            style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
          >
            {cells.map((c, ci) => (
              <span key={ci} className={isHeader ? (isDark ? "font-bold text-[#ececec]" : "font-bold text-[#0d0d0d]") : (isDark ? "text-[#b4b4b4]" : "text-[#666]")}>
                {c.replace(/\*\*(.*?)\*\*/g, "$1")}
              </span>
            ))}
          </div>
        );
        return;
      }

      // Bullet list
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ") || line.trim().startsWith("• ")) {
        const clean = line.trim().replace(/^[-*•]\s*/, "");
        elements.push(
          <li key={`li-${idx}`} className={`ml-4 list-disc text-[14.5px] leading-relaxed my-1 ${isDark ? "text-[#ececec]" : "text-[#1a1a1a]"}`}>
            <span
              dangerouslySetInnerHTML={{
                __html: clean.replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold ${isDark ? "text-white" : "text-black"}">$1</strong>`),
              }}
            />
          </li>
        );
        return;
      }

      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        elements.push(
          <div key={`num-${idx}`} className={`text-[14.5px] leading-relaxed my-1 pl-2 ${isDark ? "text-[#ececec]" : "text-[#1a1a1a]"}`}>
            <span
              dangerouslySetInnerHTML={{
                __html: line.trim().replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold ${isDark ? "text-white" : "text-black"}">$1</strong>`),
              }}
            />
          </div>
        );
        return;
      }

      // Normal paragraph
      elements.push(
        <p
          key={`p-${idx}`}
          className={`text-[14.5px] leading-relaxed my-1.5 ${isDark ? "text-[#ececec]" : "text-[#1a1a1a]"}`}
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold ${isDark ? "text-white" : "text-black"}">$1</strong>`)
              .replace(/`([^`]+)`/g, `<code class="px-1.5 py-0.5 rounded ${isDark ? "bg-[#2e2e2e] text-[#c0c1ff]" : "bg-[#ebebeb] text-[#2563eb]"} font-mono text-[13px]">$1</code>`),
          }}
        />
      );
    });

    return elements;
  };

  const groupConversations = () => {
    const groups: Record<string, Conversation[]> = {
      Today: [],
      Yesterday: [],
      "Previous 7 days": [],
    };
    conversations.forEach((c) => {
      if (groups[c.category]) {
        groups[c.category].push(c);
      } else {
        groups["Today"].push(c);
      }
    });
    return groups;
  };

  return (
    <div className={`flex h-screen w-screen ${isDark ? "bg-[#212121] text-[#ececec]" : "theme-light bg-[#ffffff] text-[#0d0d0d]"} overflow-hidden font-sans transition-colors duration-200`}>
      {/* ===================== SIDEBAR (CHATGPT STYLE) ===================== */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`h-full ${isDark ? "bg-[#171717] border-[#262626]" : "bg-[#f9f9f9] border-[#e5e5e5]"} flex flex-col shrink-0 z-40 border-r overflow-hidden select-none transition-colors duration-200`}
          >
            {/* Sidebar Top: Logo & New Chat */}
            <div className="p-3 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(false)}
                className={`p-2 rounded-lg transition-colors ${isDark ? "text-[#b4b4b4] hover:text-white hover:bg-[#212121]" : "text-[#666] hover:text-black hover:bg-[#ebebeb]"}`}
                title="Close sidebar"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>

              <button
                onClick={handleNewChat}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  isDark
                    ? "bg-[#212121] hover:bg-[#2f2f2f] text-[#ececec] border-[#333]"
                    : "bg-[#ffffff] hover:bg-[#ebebeb] text-[#111] border-[#d8d8d8] shadow-sm"
                }`}
                title="New chat"
              >
                <SquarePen className="w-4 h-4 text-emerald-500" />
                <span>New chat</span>
              </button>
            </div>

            {/* Upper Left Navigation Sections */}
            <div className={`px-2 pt-1 pb-2 border-b ${isDark ? "border-[#262626]" : "border-[#e5e5e5]"} space-y-0.5`}>
              <button
                type="button"
                onClick={() => setSidebarSection("projects")}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  sidebarSection === "projects"
                    ? (isDark ? "bg-[#212121] text-white shadow-sm border border-[#383838]" : "bg-[#ffffff] text-black shadow-sm border border-[#d8d8d8]")
                    : (isDark ? "text-[#b4b4b4] hover:bg-[#1f1f1f] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                }`}
                title="Projects"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FolderKanban className={`w-4 h-4 shrink-0 ${sidebarSection === "projects" ? "text-amber-500" : (isDark ? "text-[#8e8e8e]" : "text-[#777]")}`} />
                  <span className="truncate">Projects</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${isDark ? "bg-[#2a2a2a] text-[#a3a3a3]" : "bg-[#e5e5e5] text-[#555]"}`}>
                  {projects.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarSection("chats")}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  sidebarSection === "chats"
                    ? (isDark ? "bg-[#212121] text-white shadow-sm border border-[#383838]" : "bg-[#ffffff] text-black shadow-sm border border-[#d8d8d8]")
                    : (isDark ? "text-[#b4b4b4] hover:bg-[#1f1f1f] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                }`}
                title="Chats"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${sidebarSection === "chats" ? "text-emerald-500" : (isDark ? "text-[#8e8e8e]" : "text-[#777]")}`} />
                  <span className="truncate">Chats</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-mono font-medium shrink-0">
                  {conversations.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarSection("schedule")}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  sidebarSection === "schedule"
                    ? (isDark ? "bg-[#212121] text-white shadow-sm border border-[#383838]" : "bg-[#ffffff] text-black shadow-sm border border-[#d8d8d8]")
                    : (isDark ? "text-[#b4b4b4] hover:bg-[#1f1f1f] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                }`}
                title="Important Schedule"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <CalendarClock className={`w-4 h-4 shrink-0 ${sidebarSection === "schedule" ? "text-sky-500" : (isDark ? "text-[#8e8e8e]" : "text-[#777]")}`} />
                  <span className="truncate">Important Schedule</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-500 font-mono font-medium shrink-0">
                  2 Due
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarSection("media")}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all ${
                  sidebarSection === "media"
                    ? (isDark ? "bg-[#212121] text-white shadow-sm border border-[#383838]" : "bg-[#ffffff] text-black shadow-sm border border-[#d8d8d8]")
                    : (isDark ? "text-[#b4b4b4] hover:bg-[#1f1f1f] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                }`}
                title="Images & Videos"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Film className={`w-4 h-4 shrink-0 ${sidebarSection === "media" ? "text-purple-500" : (isDark ? "text-[#8e8e8e]" : "text-[#777]")}`} />
                  <span className="truncate">Images & Videos</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-500 font-mono font-medium shrink-0">
                  {mediaItems.length}
                </span>
              </button>
            </div>

            {/* Dynamic Content List Based on Active Section */}
            <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3">
              {sidebarSection === "chats" && (
                <>
                  {Object.entries(groupConversations()).map(([category, items]) => {
                    if (items.length === 0) return null;
                    return (
                      <div key={category} className="space-y-0.5">
                        <div className={`px-3 py-1 text-[11px] font-semibold tracking-wider uppercase ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                          {category}
                        </div>
                        {items.map((conv) => {
                          const isActive = conv.id === currentId;
                          return (
                            <button
                              key={conv.id}
                              onClick={() => setCurrentId(conv.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-[13.5px] transition-colors truncate flex items-center justify-between group ${
                                isActive
                                  ? (isDark ? "bg-[#212121] text-white font-medium" : "bg-[#ffffff] text-black font-medium shadow-sm border border-[#e0e0e0]")
                                  : (isDark ? "text-[#b4b4b4] hover:bg-[#212121] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                              }`}
                            >
                              <span className="truncate pr-2">{conv.title}</span>
                              {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}

              {sidebarSection === "projects" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                      Workspaces
                    </span>
                    <button
                      onClick={() => {
                        const newName = prompt("Enter project name:", "New Research Project");
                        if (newName?.trim()) {
                          setProjects([
                            { id: `p-${Date.now()}`, name: newName.trim(), updated: "Just now", filesCount: 1 },
                            ...projects,
                          ]);
                        }
                      }}
                      className="text-xs text-amber-500 hover:text-amber-400 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> New
                    </button>
                  </div>
                  {projects.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setInputValue(`Review project context for [${proj.name}]: `);
                        if (textareaRef.current) textareaRef.current.focus();
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all space-y-1 ${
                        isDark
                          ? "bg-[#212121]/60 hover:bg-[#212121] border-[#2b2b2b] hover:border-[#383838]"
                          : "bg-[#ffffff] hover:bg-[#f3f3f3] border-[#e0e0e0] hover:border-[#ccc] shadow-sm"
                      }`}
                    >
                      <div className={`text-[13px] font-medium truncate flex items-center gap-2 ${isDark ? "text-[#ececec]" : "text-black"}`}>
                        <FolderKanban className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{proj.name}</span>
                      </div>
                      <div className={`flex items-center justify-between text-[11px] ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                        <span>{proj.filesCount} context files</span>
                        <span>{proj.updated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sidebarSection === "schedule" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                      Scheduled Tasks
                    </span>
                    <button
                      onClick={() => {
                        const title = prompt("Enter task or prompt to schedule:", "Weekly Model Benchmark");
                        if (title?.trim()) {
                          setSchedules([
                            { id: `s-${Date.now()}`, title: title.trim(), time: "Tomorrow 10:00 AM", priority: "medium", recurring: "Once" },
                            ...schedules,
                          ]);
                        }
                      }}
                      className="text-xs text-sky-500 hover:text-sky-400 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Schedule
                    </button>
                  </div>
                  {schedules.map((sch) => (
                    <div
                      key={sch.id}
                      onClick={() => {
                        setInputValue(`Execute scheduled run: ${sch.title}`);
                        if (textareaRef.current) textareaRef.current.focus();
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all space-y-1 ${
                        isDark
                          ? "bg-[#212121]/60 hover:bg-[#212121] border-[#2b2b2b] hover:border-[#383838]"
                          : "bg-[#ffffff] hover:bg-[#f3f3f3] border-[#e0e0e0] hover:border-[#ccc] shadow-sm"
                      }`}
                    >
                      <div className={`text-[13px] font-medium truncate flex items-center gap-2 ${isDark ? "text-[#ececec]" : "text-black"}`}>
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            sch.priority === "high"
                              ? "bg-rose-400"
                              : sch.priority === "medium"
                              ? "bg-amber-400"
                              : "bg-sky-400"
                          }`}
                        />
                        <span className="truncate">{sch.title}</span>
                      </div>
                      <div className={`flex items-center justify-between text-[11px] ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                        <span className="text-sky-500 font-mono">{sch.time}</span>
                        <span className={`px-1.5 py-0.5 rounded ${isDark ? "bg-[#2a2a2a] text-[#999]" : "bg-[#e5e5e5] text-[#555]"}`}>{sch.recurring}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sidebarSection === "media" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                      Generated Media
                    </span>
                    <button
                      onClick={() => {
                        const promptText = prompt("Enter prompt to generate image or video:", "Cyberpunk futuristic city in neon rain");
                        if (promptText?.trim()) {
                          setInputValue(`/imagine ${promptText.trim()}`);
                          if (textareaRef.current) textareaRef.current.focus();
                        }
                      }}
                      className="text-xs text-purple-500 hover:text-purple-400 font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Generate
                    </button>
                  </div>
                  {mediaItems.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => {
                        setInputValue(`Show details and export options for asset: "${med.title}"`);
                        if (textareaRef.current) textareaRef.current.focus();
                      }}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all space-y-1 ${
                        isDark
                          ? "bg-[#212121]/60 hover:bg-[#212121] border-[#2b2b2b] hover:border-[#383838]"
                          : "bg-[#ffffff] hover:bg-[#f3f3f3] border-[#e0e0e0] hover:border-[#ccc] shadow-sm"
                      }`}
                    >
                      <div className={`text-[13px] font-medium truncate flex items-center gap-2 ${isDark ? "text-[#ececec]" : "text-black"}`}>
                        {med.type === "video" ? (
                          <Film className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                        ) : (
                          <Image className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        )}
                        <span className="truncate">{med.title}</span>
                      </div>
                      <div className={`flex items-center justify-between text-[11px] ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                        <span className="text-purple-500 font-mono">{med.resolution}</span>
                        <span>{med.created}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Footer / User Account (Minimalist ChatGPT / Gemini style) */}
            <div ref={userMenuRef} className={`p-2 border-t relative ${isDark ? "border-[#262626]" : "border-[#e5e5e5]"}`}>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute bottom-full left-2 right-2 mb-2 p-1.5 border rounded-xl shadow-2xl z-50 space-y-0.5 text-[13px] ${
                      isDark ? "bg-[#212121] border-[#383838] text-[#ececec]" : "bg-[#ffffff] border-[#e0e0e0] text-black shadow-2xl"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsUpgradeOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        isDark ? "hover:bg-[#2c2c2c] text-[#ececec]" : "hover:bg-[#f3f3f3] text-black"
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                      <span>Upgrade plan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSettingsOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                        isDark ? "hover:bg-[#2c2c2c] text-[#ececec]" : "hover:bg-[#f3f3f3] text-black"
                      }`}
                    >
                      <Settings className={`w-4 h-4 ${isDark ? "text-[#a3a3a3]" : "text-[#666]"}`} />
                      <span>Settings</span>
                    </button>
                    <div className={`my-1 border-t ${isDark ? "border-[#2c2c2c]" : "border-[#e5e5e5]"}`} />
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogOutOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-500 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-colors group text-left cursor-pointer ${
                  isDark ? "hover:bg-[#212121]" : "hover:bg-[#eeeeee]"
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xs font-semibold text-white shrink-0 shadow-sm">
                  {userName ? userName[0].toUpperCase() : "A"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[13.5px] font-medium truncate ${isDark ? "text-[#ececec]" : "text-black"}`}>{userName}</div>
                </div>
                <MoreHorizontal
                  className={`w-4 h-4 transition-colors shrink-0 ${
                    isDark ? "text-[#8e8e8e] group-hover:text-[#ececec]" : "text-[#777] group-hover:text-black"
                  }`}
                />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ===================== MAIN CONTENT AREA ===================== */}
      <main className={`flex-1 flex flex-col h-full min-w-0 relative overflow-hidden transition-colors duration-200 ${isDark ? "bg-[#212121]" : "bg-[#ffffff]"}`}>
        {/* Top Minimal Navigation Bar */}
        <header className={`h-12 border-b px-3 flex items-center justify-between backdrop-blur z-20 shrink-0 transition-colors duration-200 ${isDark ? "bg-[#212121]/95 border-[#2e2e2e]" : "bg-[#ffffff]/95 border-[#e5e5e5]"}`}>
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg transition-colors ${isDark ? "text-[#b4b4b4] hover:text-white hover:bg-[#2f2f2f]" : "text-[#666] hover:text-black hover:bg-[#ebebeb]"}`}
                title="Open sidebar"
              >
                <PanelLeft className="w-5 h-5" />
              </button>
            )}

            {/* Model Selector Dropdown Header */}
            <div ref={modelDropdownRef} className="relative">
              <button
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isDark ? "hover:bg-[#2f2f2f] text-[#ececec]" : "hover:bg-[#f0f0f0] text-black"}`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>OneStop</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${isDark ? "text-[#b4b4b4] bg-[#2f2f2f]" : "text-[#555] bg-[#ebebeb]"}`}>5 Models Active</span>
                </div>
                <ChevronDown className={`w-4 h-4 ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`} />
              </button>

              {modelDropdownOpen && (
                <div className={`absolute top-10 left-0 w-72 border rounded-xl shadow-2xl p-2 z-50 text-xs ${isDark ? "bg-[#171717] border-[#3e3e3e] text-[#ececec]" : "bg-[#ffffff] border-[#e0e0e0] text-black shadow-2xl"}`}>
                  <div className={`px-2 py-1 font-semibold uppercase tracking-wider text-[10px] ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                    Simultaneous Engine Pool
                  </div>
                  {ENGINES.map((e) => (
                    <div
                      key={e.id}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors ${isDark ? "hover:bg-[#212121] text-[#ececec]" : "hover:bg-[#f5f5f5] text-black"}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                        <span className="font-medium">{e.name}</span>
                      </div>
                      <span className={`text-[11px] ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>{e.provider}</span>
                    </div>
                  ))}
                  <div className={`mt-1 pt-1.5 border-t px-2 text-[11px] text-emerald-500 font-medium ${isDark ? "border-[#2a2a2a]" : "border-[#e5e5e5]"}`}>
                    ⚡ Every prompt queries all 5 frontier models at once
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header: View Mode Switcher & New Chat */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center p-0.5 rounded-lg border ${isDark ? "bg-[#171717] border-[#333]" : "bg-[#f0f0f0] border-[#d8d8d8]"}`}>
              <button
                onClick={() => setViewMode("tab")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "tab"
                    ? (isDark ? "bg-[#2f2f2f] text-white shadow-sm" : "bg-[#ffffff] text-black shadow-sm")
                    : (isDark ? "text-[#8e8e8e] hover:text-[#ececec]" : "text-[#666] hover:text-black")
                }`}
                title="Single tabbed view"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Single</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "grid"
                    ? (isDark ? "bg-[#2f2f2f] text-white shadow-sm" : "bg-[#ffffff] text-black shadow-sm")
                    : (isDark ? "text-[#8e8e8e] hover:text-[#ececec]" : "text-[#666] hover:text-black")
                }`}
                title="Compare all 5 side-by-side"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            </div>

            <button
              onClick={() => handleThemeChange(isDark ? "light" : "dark")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? "text-[#b4b4b4] hover:text-white hover:bg-[#2f2f2f]" : "text-[#666] hover:text-black hover:bg-[#ebebeb]"
              }`}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>

            <button
              onClick={handleNewChat}
              className={`p-1.5 rounded-lg transition-colors ${isDark ? "text-[#b4b4b4] hover:text-white hover:bg-[#2f2f2f]" : "text-[#666] hover:text-black hover:bg-[#ebebeb]"}`}
              title="New Chat"
            >
              <SquarePen className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto pb-44 px-4">
          {/* EMPTY STATE (LIKE CHATGPT HOME) */}
          {currentChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-6 shadow-md ${isDark ? "bg-[#2f2f2f] border-[#3e3e3e]" : "bg-[#f0f0f0] border-[#d8d8d8]"}`}>
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <h1 className={`text-2xl sm:text-3xl font-semibold tracking-tight mb-8 ${isDark ? "text-white" : "text-neutral-900"}`}>
                What can I help with today?
              </h1>

              {/* 4 Clean ChatGPT-Style Quick Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl text-left">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.prompt)}
                    className={`p-3.5 rounded-xl border transition-all text-left group ${
                      isDark
                        ? "border-[#383838] bg-[#1a1a1a] hover:bg-[#262626] hover:border-[#4d4d4d]"
                        : "border-[#e0e0e0] bg-[#f8f8f8] hover:bg-[#f0f0f0] hover:border-[#ccc] shadow-sm"
                    }`}
                  >
                    <div className={`text-[13.5px] font-medium transition-colors ${isDark ? "text-[#ececec] group-hover:text-white" : "text-neutral-800 group-hover:text-black"}`}>
                      {s.title}
                    </div>
                    <div className={`text-xs mt-1 line-clamp-1 ${isDark ? "text-[#8e8e8e]" : "text-neutral-500"}`}>
                      {s.subtitle}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* CONVERSATION THREAD */
            <div className="max-w-3xl mx-auto py-6 space-y-6">
              {currentChat.messages.map((message) => {
                if (message.role === "user") {
                  return (
                    <div key={message.id} className="flex justify-end">
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-[20px] rounded-br-sm text-[15px] leading-relaxed shadow-sm ${
                        isDark ? "bg-[#2f2f2f] text-[#ececec]" : "bg-[#f4f4f4] text-[#0d0d0d] border border-[#e5e5e5]"
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  );
                }

                // Assistant Message with 5 Model Answers
                const currentModelId = activeModelMap[message.id] || "openai";
                const activeResponse = message.responses?.find((r) => r.engineId === currentModelId) || message.responses?.[0];

                return (
                  <div key={message.id} className="space-y-3">
                    {/* TAB VIEW: Minimal, Elegant, Clean ChatGPT formatting */}
                    {viewMode === "tab" ? (
                      <div className="space-y-3">
                        {/* Model Switcher Pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                          {message.responses?.map((r) => {
                            const isSelected = r.engineId === currentModelId;
                            return (
                              <button
                                key={r.engineId}
                                onClick={() => handleSelectModel(message.id, r.engineId)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border ${
                                  isSelected
                                    ? (isDark ? "bg-[#2f2f2f] text-white border-[#555] shadow-sm" : "bg-[#ffffff] text-black border-[#bbb] shadow-sm font-semibold")
                                    : (isDark ? "bg-[#171717] text-[#8e8e8e] border-[#2e2e2e] hover:text-[#ececec] hover:bg-[#212121]" : "bg-[#f4f4f4] text-[#666] border-[#e0e0e0] hover:text-black hover:bg-[#ebebeb]")
                                }`}
                              >
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: r.color }}
                                />
                                <span>{r.name}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Active Model Content Card */}
                        {activeResponse && (
                          <div className="bg-transparent pl-1">
                            {/* Metadata header */}
                            <div className={`flex items-center gap-2 text-xs mb-2 font-mono ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                              <span className={`font-semibold ${isDark ? "text-[#ececec]" : "text-black"}`}>
                                {activeResponse.name}
                              </span>
                              <span>•</span>
                              <span>{activeResponse.time}</span>
                              <span>•</span>
                              <span>{activeResponse.tokens}</span>
                            </div>

                            {/* Rendered markdown */}
                            <div className={`text-[14.5px] leading-relaxed ${isDark ? "text-[#ececec]" : "text-[#1a1a1a]"}`}>
                              {renderMarkdown(activeResponse.content)}
                            </div>

                            {/* Bottom Response Action Buttons (ChatGPT Style) */}
                            <div className={`flex items-center gap-2 mt-4 ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>
                              <button
                                onClick={() => handleCopy(activeResponse.content, activeResponse.engineId)}
                                className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-[#2f2f2f] hover:text-white" : "hover:bg-[#ebebeb] hover:text-black"}`}
                                title="Copy response"
                              >
                                {copiedId === activeResponse.engineId ? (
                                  <Check className="w-4 h-4 text-emerald-500" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-[#2f2f2f] hover:text-white" : "hover:bg-[#ebebeb] hover:text-black"}`}
                                title="Good response"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-[#2f2f2f] hover:text-white" : "hover:bg-[#ebebeb] hover:text-black"}`}
                                title="Bad response"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleSend(currentChat.messages[currentChat.messages.length - 2]?.content || "Regenerate")}
                                className={`p-1.5 rounded-md transition-colors ${isDark ? "hover:bg-[#2f2f2f] hover:text-white" : "hover:bg-[#ebebeb] hover:text-black"}`}
                                title="Regenerate"
                              >
                                <RotateCw className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* GRID / COMPARE VIEW: Side-by-Side Cards */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {message.responses?.map((r) => (
                          <div
                            key={r.engineId}
                            className={`rounded-xl border p-4 flex flex-col justify-between ${
                              isDark ? "bg-[#1a1a1a] border-[#333]" : "bg-[#ffffff] border-[#e2e2e2] shadow-sm"
                            }`}
                          >
                            <div>
                              <div className={`flex items-center justify-between pb-2 mb-3 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#e5e5e5]"}`}>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: r.color }}
                                  />
                                  <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-black"}`}>{r.name}</span>
                                </div>
                                <span className={`text-[11px] font-mono ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>{r.time}</span>
                              </div>
                              <div className={`text-[13px] leading-relaxed ${isDark ? "text-[#ececec]" : "text-[#1a1a1a]"}`}>
                                {renderMarkdown(r.content)}
                              </div>
                            </div>
                            <div className={`flex items-center justify-end gap-1 mt-4 pt-2 border-t ${isDark ? "border-[#2a2a2a]" : "border-[#e5e5e5]"}`}>
                              <button
                                onClick={() => handleCopy(r.content, r.engineId)}
                                className={`p-1 rounded transition-colors ${isDark ? "text-[#8e8e8e] hover:text-white hover:bg-[#282828]" : "text-[#666] hover:text-black hover:bg-[#f0f0f0]"}`}
                                title="Copy"
                              >
                                {copiedId === r.engineId ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Generating / Thinking State */}
              {isGenerating && (
                <div className={`flex items-center gap-3 py-2 text-sm ${isDark ? "text-[#b4b4b4]" : "text-[#666]"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isDark ? "bg-[#2f2f2f]" : "bg-[#f0f0f0]"}`}>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                  </div>
                  <span className="font-mono text-xs">
                    Querying GPT-4o, Gemini 1.5, Claude 3.5, Grok 2, and Sonar Pro...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ===================== BOTTOM FIXED INPUT BAR (CHATGPT) ===================== */}
        <div className={`absolute bottom-0 left-0 right-0 pt-6 pb-4 px-4 z-30 bg-gradient-to-t ${
          isDark
            ? "from-[#212121] via-[#212121]/95 to-transparent"
            : "from-[#ffffff] via-[#ffffff]/95 to-transparent"
        }`}>
          <div className="max-w-3xl mx-auto">
            <div className={`relative flex items-center rounded-[26px] border shadow-lg transition-all px-3 py-2 ${
              isDark
                ? "bg-[#2f2f2f] border-[#3e3e3e] focus-within:border-[#555]"
                : "bg-[#f4f4f4] border-[#d8d8d8] focus-within:border-[#999] shadow-sm"
            }`}>
              {/* Attachment / Plus Button */}
              <button
                type="button"
                className={`p-2 rounded-full transition-colors shrink-0 ${isDark ? "text-[#b4b4b4] hover:text-white hover:bg-[#3d3d3d]" : "text-[#666] hover:text-black hover:bg-[#e4e4e4]"}`}
                title="Attach files or context"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Main Prompt Input */}
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Ask anything (all 5 AI engines respond)..."
                className={`flex-1 bg-transparent text-[15px] resize-none outline-none px-3 py-1.5 max-h-36 overflow-y-auto leading-relaxed ${
                  isDark ? "text-[#ececec] placeholder-[#8e8e8e]" : "text-[#0d0d0d] placeholder-[#888]"
                }`}
                style={{ minHeight: "24px" }}
              />

              {/* Voice Input Button */}
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isListening
                    ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    : (isDark ? "text-[#b4b4b4] hover:text-white hover:bg-[#3d3d3d]" : "text-[#666] hover:text-black hover:bg-[#e4e4e4]")
                }`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-40" />
                )}
                <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
              </button>

              {/* Circular Send Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isGenerating}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  inputValue.trim() && !isGenerating
                    ? (isDark ? "bg-white text-black hover:bg-neutral-200 cursor-pointer shadow-md" : "bg-black text-white hover:bg-neutral-800 cursor-pointer shadow-md")
                    : (isDark ? "bg-[#424242] text-[#8e8e8e] cursor-not-allowed" : "bg-[#d8d8d8] text-[#999] cursor-not-allowed")
                }`}
                title="Send prompt"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            {/* Bottom Disclaimer */}
            <p className={`text-center text-[11px] mt-2 ${isDark ? "text-[#8e8e8e]" : "text-[#666]"}`}>
              OneStop queries GPT-4o, Claude 3.5, Gemini 1.5, Grok 2, and Sonar Pro simultaneously. Always verify critical facts.
            </p>
          </div>
        </div>
      </main>

      {/* ===================== TOAST NOTIFICATION ===================== */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#2d2d2d] text-white border border-[#444] rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== UPGRADE PLAN MODAL ===================== */}
      <AnimatePresence>
        {isUpgradeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-2xl border rounded-2xl p-6 shadow-2xl space-y-6 transition-colors duration-200 ${
                isDark ? "bg-[#1e1e1e] border-[#333] text-[#ececec]" : "bg-[#ffffff] border-[#e0e0e0] text-[#111]"
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-4 ${
                isDark ? "border-[#2d2d2d]" : "border-[#e5e5e5]"
              }`}>
                <div>
                  <h3 className={`text-xl font-bold flex items-center gap-2 ${
                    isDark ? "text-white" : "text-black"
                  }`}>
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                    Upgrade your plan
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDark ? "text-[#8e8e8e]" : "text-neutral-500"}`}>
                    Unlock the full power of parallel AI synthesis across 5 frontier models.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUpgradeOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isDark ? "text-[#8e8e8e] hover:text-white hover:bg-[#2c2c2c]" : "text-[#666] hover:text-black hover:bg-[#ebebeb]"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Free Tier */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${
                  isDark ? "bg-[#262626]/70 border-[#333]" : "bg-[#f9f9f9] border-[#e0e0e0]"
                }`}>
                  <div className="space-y-2">
                    <div className={`text-sm font-semibold uppercase tracking-wider ${
                      isDark ? "text-[#8e8e8e]" : "text-[#777]"
                    }`}>Free</div>
                    <div className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                      $0 <span className={`text-xs font-normal ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>/month</span>
                    </div>
                    <p className={`text-xs ${isDark ? "text-[#b4b4b4]" : "text-neutral-600"}`}>Standard access for casual exploration.</p>
                    <ul className={`text-xs space-y-2 pt-2 ${isDark ? "text-[#c4c4c4]" : "text-neutral-700"}`}>
                      <li className="flex items-center gap-2 font-medium">✓ Standard response speed</li>
                      <li className="flex items-center gap-2 font-medium">✓ Single query rate limits</li>
                      <li className="flex items-center gap-2 text-[#888]">✕ Parallel 5-model consensus</li>
                      <li className="flex items-center gap-2 text-[#888]">✕ Image & video generation</li>
                    </ul>
                  </div>
                  <button
                    disabled
                    className={`w-full py-2 rounded-lg text-xs font-medium cursor-not-allowed ${
                      isDark ? "bg-[#333] text-[#8e8e8e]" : "bg-[#e5e5e5] text-[#888]"
                    }`}
                  >
                    {userPlan === "Free" ? "Your Current Plan" : "Basic Tier"}
                  </button>
                </div>

                {/* Frontier Pro Tier */}
                <div className={`p-5 rounded-xl border-2 border-emerald-500/60 flex flex-col justify-between space-y-4 shadow-lg relative ${
                  isDark ? "bg-gradient-to-b from-[#262f2b] to-[#1e1e1e]" : "bg-gradient-to-b from-emerald-50/70 to-white"
                }`}>
                  <span className="absolute -top-3 right-4 px-2 py-0.5 bg-emerald-500 text-black text-[10px] font-bold rounded-full uppercase tracking-wider shadow-sm">
                    Popular
                  </span>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      Frontier Pro
                    </div>
                    <div className={`text-3xl font-extrabold ${isDark ? "text-white" : "text-black"}`}>
                      $20 <span className={`text-xs font-normal ${isDark ? "text-[#8e8e8e]" : "text-[#777]"}`}>/month</span>
                    </div>
                    <p className={`text-xs ${isDark ? "text-[#b4b4b4]" : "text-neutral-600"}`}>Unlimited access to all frontier AI engines.</p>
                    <ul className={`text-xs space-y-2 pt-2 ${isDark ? "text-[#ececec]" : "text-neutral-800"}`}>
                      <li className="flex items-center gap-2 font-medium"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> GPT-4o, Claude 3.5, Gemini 1.5, Grok 2, Sonar Pro</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> High-speed parallel generation</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Real-time Speech-to-Text & Voice input</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> High-res Image & Video studio</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUserPlan("Pro");
                      setIsUpgradeOpen(false);
                      triggerToast("Successfully active on Frontier Pro plan!");
                    }}
                    className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    {userPlan === "Pro" ? "Current Active Plan (Pro)" : "Upgrade to Pro"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== SETTINGS MODAL ===================== */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative w-full max-w-2xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[460px] transition-colors duration-200 ${
                isDark ? "bg-[#1e1e1e] border-[#333] text-[#ececec]" : "bg-[#ffffff] border-[#e0e0e0] text-[#111]"
              }`}
            >
              {/* Settings Sidebar Tabs */}
              <div className={`w-full md:w-52 p-3 border-r flex flex-col justify-between shrink-0 transition-colors duration-200 ${
                isDark ? "bg-[#171717] border-[#2d2d2d]" : "bg-[#f8f8f8] border-[#e5e5e5]"
              }`}>
                <div className="space-y-1">
                  <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#8e8e8e]" : "text-[#777]"
                  }`}>
                    Settings
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsTab("general")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      settingsTab === "general"
                        ? (isDark ? "bg-[#262626] text-white shadow-sm" : "bg-[#ffffff] text-black shadow-sm border border-[#e0e0e0]")
                        : (isDark ? "text-[#8e8e8e] hover:bg-[#202020] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>General</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab("models")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      settingsTab === "models"
                        ? (isDark ? "bg-[#262626] text-white shadow-sm" : "bg-[#ffffff] text-black shadow-sm border border-[#e0e0e0]")
                        : (isDark ? "text-[#8e8e8e] hover:bg-[#202020] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                    }`}
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>API Keys & Models</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettingsTab("account")}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      settingsTab === "account"
                        ? (isDark ? "bg-[#262626] text-white shadow-sm" : "bg-[#ffffff] text-black shadow-sm border border-[#e0e0e0]")
                        : (isDark ? "text-[#8e8e8e] hover:bg-[#202020] hover:text-[#ececec]" : "text-[#666] hover:bg-[#eeeeee] hover:text-black")
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Account</span>
                  </button>
                </div>
                <div className={`px-3 py-2 text-[11px] ${isDark ? "text-[#666]" : "text-[#999]"}`}>OneStop AI v0.1.0</div>
              </div>

              {/* Settings Body */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="space-y-5">
                  <div className={`flex items-center justify-between border-b pb-3 ${
                    isDark ? "border-[#2d2d2d]" : "border-[#e5e5e5]"
                  }`}>
                    <h4 className={`text-base font-bold capitalize ${isDark ? "text-white" : "text-black"}`}>
                      {settingsTab === "general"
                        ? "General Settings"
                        : settingsTab === "models"
                        ? "API Keys & Frontier Engines"
                        : "Account & Preferences"}
                    </h4>
                    <button
                      type="button"
                      onClick={() => setIsSettingsOpen(false)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isDark ? "text-[#8e8e8e] hover:text-white hover:bg-[#2c2c2c]" : "text-[#666] hover:text-black hover:bg-[#ebebeb]"
                      }`}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* General Tab */}
                  {settingsTab === "general" && (
                    <div className="space-y-5 text-xs">
                      {/* Theme Selector Section */}
                      <div className={`py-2 border-b ${isDark ? "border-[#2d2d2d]" : "border-[#e5e5e5]"}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className={`font-semibold text-sm ${isDark ? "text-white" : "text-neutral-900"}`}>Theme</div>
                            <div className={`text-xs ${isDark ? "text-[#8e8e8e]" : "text-neutral-500"}`}>Select your preferred interface appearance</div>
                          </div>
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                            isDark ? "bg-[#2a2a2a] text-[#aaa]" : "bg-[#f0f0f0] text-[#555]"
                          }`}>
                            Active: {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
                          </span>
                        </div>

                        {/* Interactive Segmented Buttons */}
                        <div className="grid grid-cols-3 gap-2.5 mb-3">
                          <button
                            type="button"
                            onClick={() => handleThemeChange("light")}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                              themeMode === "light"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30 font-semibold"
                                : (isDark
                                    ? "border-[#333] bg-[#242424] text-[#b4b4b4] hover:bg-[#2b2b2b] hover:text-white"
                                    : "border-[#e0e0e0] bg-[#f9f9f9] text-[#666] hover:bg-[#eeeeee] hover:text-black")
                            }`}
                          >
                            <Sun className="w-5 h-5 text-amber-500" />
                            <span>Light</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleThemeChange("dark")}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                              themeMode === "dark"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30 font-semibold"
                                : (isDark
                                    ? "border-[#333] bg-[#242424] text-[#b4b4b4] hover:bg-[#2b2b2b] hover:text-white"
                                    : "border-[#e0e0e0] bg-[#f9f9f9] text-[#666] hover:bg-[#eeeeee] hover:text-black")
                            }`}
                          >
                            <Moon className="w-5 h-5 text-indigo-400" />
                            <span>Dark</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleThemeChange("system")}
                            className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                              themeMode === "system"
                                ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30 font-semibold"
                                : (isDark
                                    ? "border-[#333] bg-[#242424] text-[#b4b4b4] hover:bg-[#2b2b2b] hover:text-white"
                                    : "border-[#e0e0e0] bg-[#f9f9f9] text-[#666] hover:bg-[#eeeeee] hover:text-black")
                            }`}
                          >
                            <Monitor className="w-5 h-5 text-sky-400" />
                            <span>System ({systemIsDark ? "Dark" : "Light"})</span>
                          </button>
                        </div>

                        {/* Dropdown Selector */}
                        <div className="flex items-center justify-between pt-1">
                          <span className={`text-[11.5px] ${isDark ? "text-[#8e8e8e]" : "text-neutral-500"}`}>Or select from dropdown:</span>
                          <select
                            value={themeMode}
                            onChange={(e) => handleThemeChange(e.target.value as "dark" | "light" | "system")}
                            className={`border rounded-lg px-3 py-1.5 outline-none cursor-pointer text-xs font-medium transition-colors ${
                              isDark ? "bg-[#2a2a2a] text-white border-[#3e3e3e]" : "bg-[#f5f5f5] text-black border-[#d4d4d4]"
                            }`}
                          >
                            <option value="dark">Dark (Default)</option>
                            <option value="light">Light</option>
                            <option value="system">System (Matches OS)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <div className={`font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}>Clear All Chats</div>
                          <div className={isDark ? "text-[#8e8e8e]" : "text-neutral-500"}>Permanently delete all conversation history</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete all chats?")) {
                              setConversations([]);
                              handleNewChat();
                              triggerToast("All chat history cleared");
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear chats</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Models & API Keys Tab */}
                  {settingsTab === "models" && (
                    <div className="space-y-3 text-xs max-h-72 overflow-y-auto pr-1">
                      <p className={isDark ? "text-[#8e8e8e]" : "text-neutral-500"}>
                        OneStop connects to all 5 frontier engines. Optionally specify custom API keys:
                      </p>
                      {Object.entries(apiKeys).map(([provider, keyVal]) => (
                        <div key={provider} className="space-y-1">
                          <label className={`font-semibold uppercase text-[10px] ${isDark ? "text-[#b4b4b4]" : "text-[#555]"}`}>
                            {provider} Key
                          </label>
                          <input
                            type="password"
                            value={keyVal}
                            onChange={(e) => setApiKeys({ ...apiKeys, [provider]: e.target.value })}
                            className={`w-full border rounded-lg px-3 py-1.5 font-mono outline-none focus:border-emerald-500 transition-colors ${
                              isDark ? "bg-[#2a2a2a] border-[#3e3e3e] text-white" : "bg-[#f5f5f5] border-[#d8d8d8] text-black"
                            }`}
                          />
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => triggerToast("API keys securely saved locally!")}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Save API Keys
                      </button>
                    </div>
                  )}

                  {/* Account Tab */}
                  {settingsTab === "account" && (
                    <div className="space-y-4 text-xs">
                      <div className="space-y-1">
                        <label className={`font-semibold ${isDark ? "text-[#b4b4b4]" : "text-[#555]"}`}>Display Name</label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 transition-colors ${
                            isDark ? "bg-[#2a2a2a] border-[#3e3e3e] text-white" : "bg-[#f5f5f5] border-[#d8d8d8] text-black"
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={`font-semibold ${isDark ? "text-[#b4b4b4]" : "text-[#555]"}`}>Email</label>
                        <input
                          type="email"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className={`w-full border rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500 transition-colors ${
                            isDark ? "bg-[#2a2a2a] border-[#3e3e3e] text-white" : "bg-[#f5f5f5] border-[#d8d8d8] text-black"
                          }`}
                        />
                      </div>

                      <div className={`flex items-center justify-between py-2 border-t ${
                        isDark ? "border-[#2d2d2d]" : "border-[#e5e5e5]"
                      }`}>
                        <div>
                          <div className={`font-semibold ${isDark ? "text-white" : "text-black"}`}>Subscription Tier</div>
                          <div className="text-emerald-500 font-medium">Frontier Pro (Active)</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSettingsOpen(false);
                            setIsUpgradeOpen(true);
                          }}
                          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            isDark ? "bg-[#2a2a2a] hover:bg-[#333] text-white" : "bg-[#f0f0f0] hover:bg-[#e4e4e4] text-black border border-[#d8d8d8]"
                          }`}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className={`flex justify-end pt-4 border-t ${isDark ? "border-[#2d2d2d]" : "border-[#e5e5e5]"}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSettingsOpen(false);
                      triggerToast("Settings saved");
                    }}
                    className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                      isDark ? "bg-white text-black hover:bg-neutral-200" : "bg-black text-white hover:bg-neutral-800"
                    }`}
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== LOG OUT DIALOG ===================== */}
      <AnimatePresence>
        {isLogOutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-sm border rounded-2xl p-5 shadow-2xl space-y-4 transition-colors duration-200 ${
                isDark ? "bg-[#1e1e1e] border-[#333] text-[#ececec]" : "bg-[#ffffff] border-[#e0e0e0] text-[#111]"
              }`}
            >
              <h3 className={`text-base font-bold flex items-center gap-2 ${
                isDark ? "text-white" : "text-black"
              }`}>
                <LogOut className="w-4 h-4 text-rose-500" />
                Log out of OneStop?
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-[#8e8e8e]" : "text-neutral-600"}`}>
                You will be signed out of your current session. You can sign back in anytime to continue your chats.
              </p>
              <div className={`flex items-center justify-end gap-2 pt-2 border-t ${
                isDark ? "border-[#2d2d2d]" : "border-[#e5e5e5]"
              }`}>
                <button
                  type="button"
                  onClick={() => setIsLogOutOpen(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isDark ? "bg-[#2a2a2a] hover:bg-[#333] text-[#ececec]" : "bg-[#f0f0f0] hover:bg-[#e4e4e4] text-[#333] border border-[#d8d8d8]"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedOut(true);
                    setIsLogOutOpen(false);
                    triggerToast("Logged out successfully");
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors cursor-pointer shadow-sm"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ===================== SIGN IN OVERLAY (WHEN LOGGED OUT) ===================== */}
      <AnimatePresence>
        {isLoggedOut && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717] p-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="w-full max-w-md bg-[#212121] border border-[#333] rounded-2xl p-8 shadow-2xl text-center space-y-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 mx-auto flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Welcome back to OneStop</h2>
                <p className="text-xs text-[#8e8e8e] mt-1">
                  Frontier AI Platform with 5 parallel engines.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedOut(false);
                    triggerToast(`Welcome back, ${userName}!`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {userName ? userName[0].toUpperCase() : "A"}
                  </div>
                  <span>Continue as {userName}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoggedOut(false);
                    triggerToast("Signed in with Google");
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2a2a2a] hover:bg-[#333] border border-[#3e3e3e] text-white text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue with Google</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
