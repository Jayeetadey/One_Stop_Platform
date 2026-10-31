"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ViewMode } from "@/lib/types";
import ModelCard from "./ModelCard";
import SynthesisCard from "./SynthesisCard";
import { MOCK_RESPONSES } from "@/lib/data/comparisons";

interface ModelsMatrixProps {
  viewMode: ViewMode;
}

const GRID_CLASSES: Record<ViewMode, string> = {
  grid: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5",
  split: "grid grid-cols-1 lg:grid-cols-2 gap-5",
  digest: "flex flex-col gap-5 max-w-4xl mx-auto",
};

// Card content renderers per engine
function OpenAIContent({ data }: { data: (typeof MOCK_RESPONSES.responses)[0] }) {
  return (
    <>
      <p>
        A <strong className="text-[#61dbb4]">blockchain</strong> is a
        decentralized, distributed, and immutable digital ledger that
        systematically records transactions across a secure peer-to-peer network.
      </p>
      <p className="text-[#c7c4d7] text-body-sm">
        Every discrete block stores an encrypted cryptographic hash of the
        antecedent block, an authoritative timestamp, and validated transaction
        trees (Merkle roots).
      </p>
      {data.pillars && (
        <div className="mt-2 p-4 rounded-xl bg-[#1c2028] flex flex-col gap-2">
          <span className="font-inter text-label-xs text-[#61dbb4] uppercase tracking-wider font-semibold">
            Pillars of Operation
          </span>
          <ul className="space-y-1.5 font-inter text-body-sm">
            {data.pillars.map((p) => (
              <li key={p.title} className="flex items-start gap-2">
                <span className="material-symbols-outlined text-xs text-[#61dbb4] mt-1">
                  check_circle
                </span>
                <span>
                  <strong>{p.title}:</strong> {p.desc}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

function GeminiContent({ data }: { data: (typeof MOCK_RESPONSES.responses)[0] }) {
  return (
    <>
      <p>
        Think of a blockchain as an{" "}
        <strong className="text-[#4cd7f6]">
          open, globally synchronized Google Sheet
        </strong>{" "}
        that no single party owns, controls, or can unilaterally overwrite
        without majority validation.
      </p>
      {/* Block schema */}
      <div className="p-3 rounded-xl bg-[#1c2028] font-jetbrains text-code-sm text-[#c7c4d7] flex flex-col gap-1">
        <div className="flex items-center justify-between pb-1 border-b border-[#262a33]">
          <span className="font-inter text-label-xs text-[#4cd7f6] uppercase font-semibold">
            Block Structure Schema
          </span>
          <span className="text-[10px] text-[#c7c4d7]">SHA-256</span>
        </div>
        <div className="bg-[#0a0e16] p-3 rounded text-[12px] leading-tight">
          <span className="text-[#4cd7f6]">{"{"}</span>
          <br />
          <span className="text-[#c0c1ff]">&quot;index&quot;</span>: 104829,
          <br />
          <span className="text-[#c0c1ff]">&quot;timestamp&quot;</span>: 1740940800,
          <br />
          <span className="text-[#c0c1ff]">&quot;prevHash&quot;</span>:{" "}
          &quot;0000abc49f8...&quot;,
          <br />
          <span className="text-[#c0c1ff]">&quot;hash&quot;</span>:{" "}
          &quot;0000ff94b1a...&quot;
          <br />
          <span className="text-[#4cd7f6]">{"}"}</span>
        </div>
      </div>
      {data.executionSteps && (
        <div className="flex flex-col gap-1 font-inter text-body-sm">
          <span className="font-inter text-label-xs text-[#4cd7f6] font-semibold uppercase">
            Execution Flow:
          </span>
          <div className="grid grid-cols-2 gap-2 text-[12px]">
            {data.executionSteps.map((step, i) => (
              <div key={i} className="p-2 rounded bg-[#1c2028]">
                {i + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function ClaudeContent({ data }: { data: (typeof MOCK_RESPONSES.responses)[0] }) {
  return (
    <>
      <p>
        At its foundational level, a blockchain operates as a{" "}
        <strong className="text-[#c0c1ff]">
          Byzantine Fault Tolerant (BFT) replicated state machine
        </strong>
        . It formally resolves the classic Double-Spending anomaly without
        trusted intermediaries.
      </p>
      {data.consensusTable && (
        <div className="rounded-lg bg-[#1c2028] overflow-hidden text-[12px]">
          <div className="grid grid-cols-3 bg-[#31353e] px-3 py-1.5 font-semibold text-[#c7c4d7]">
            {data.consensusTable.headers.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          {data.consensusTable.rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 px-3 py-1.5 ${
                i % 2 === 0 ? "bg-[#1c2028]" : "bg-[#181c24]"
              } text-[#dfe2ee]`}
            >
              <span className="text-[#c7c4d7]">{row[0]}</span>
              <span>{row[1]}</span>
              <span>{row[2]}</span>
            </div>
          ))}
        </div>
      )}
      {data.tags && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded bg-[#262a33] text-[11px] text-[#c7c4d7] font-jetbrains"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function GrokContent({ data }: { data: (typeof MOCK_RESPONSES.responses)[0] }) {
  return (
    <>
      <p className="font-semibold">
        Bottom line: It&apos;s an append-only, tamper-proof record book run by
        math instead of institutions.
      </p>
      <p className="text-[#c7c4d7] text-body-sm">
        You cut out banks, brokers, registrars, and escrow agents. Anyone can
        audit it, no single cartel can delete a page, and every new transaction
        is cryptographically stapled to the previous one forever.
      </p>
      {data.bullets && (
        <div className="p-4 rounded-xl bg-[#1c2028] flex flex-col gap-2.5">
          {data.bullets.map((b) => (
            <div key={b.title} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dfe2ee] shrink-0" />
              <span className="font-inter text-body-sm">
                <strong>{b.title}:</strong> {b.desc}
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function PerplexityContent({ data }: { data: (typeof MOCK_RESPONSES.responses)[0] }) {
  return (
    <>
      <p>
        Blockchain constitutes a continuous cryptographic chain of timestamped
        records maintained across thousands of independent computing nodes{" "}
        <button className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 rounded bg-[#03b5d3]/40 text-[#4cd7f6] font-jetbrains text-[11px] font-bold">
          [1]
        </button>
        .
      </p>
      <p className="text-[#c7c4d7] text-body-sm">
        Current 2025/2026 industrial implementations span Ethereum Layer-2
        optimistic/ZK-rollups, institutional settlement conduits (SWIFT RLN
        trials), and verifiable enterprise logistics{" "}
        <button className="inline-flex items-center justify-center px-1.5 py-0.5 mx-0.5 rounded bg-[#03b5d3]/40 text-[#4cd7f6] font-jetbrains text-[11px] font-bold">
          [2]
        </button>
        .
      </p>
      {data.citations && (
        <div className="mt-2 p-3 rounded-xl bg-[#1c2028] flex flex-col gap-2">
          <span className="font-inter text-label-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            Verified Citations
          </span>
          {data.citations.map((c) => (
            <a
              key={c.num}
              href={c.href}
              className="flex items-center justify-between p-1.5 rounded bg-[#181c24] hover:bg-[#262a33] text-[#dfe2ee] transition-colors text-[12px]"
            >
              <span className="truncate">
                <strong className="text-[#4cd7f6] mr-1">[{c.num}]</strong>
                {c.label}
              </span>
              <span className="material-symbols-outlined text-xs text-[#c7c4d7] shrink-0">
                open_in_new
              </span>
            </a>
          ))}
        </div>
      )}
    </>
  );
}

const CONTENT_MAP: Record<string, React.ComponentType<{ data: (typeof MOCK_RESPONSES.responses)[0] }>> = {
  openai: OpenAIContent,
  gemini: GeminiContent,
  claude: ClaudeContent,
  grok: GrokContent,
  perplexity: PerplexityContent,
};

export default function ModelsMatrix({ viewMode }: ModelsMatrixProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={viewMode}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className={`${GRID_CLASSES[viewMode]} mb-8`}
        id="models-matrix"
      >
        {MOCK_RESPONSES.responses.map((response, i) => {
          const ContentComponent = CONTENT_MAP[response.engineId];
          return (
            <motion.div
              key={response.engineId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <ModelCard
                engineId={response.engineId}
                tokens={response.tokens}
                latencySeconds={response.latencySeconds}
                temperature={response.temperature}
                contextWindow={response.contextWindow}
                badge={response.badge}
              >
                {ContentComponent && <ContentComponent data={response} />}
              </ModelCard>
            </motion.div>
          );
        })}
        <SynthesisCard />
      </motion.section>
    </AnimatePresence>
  );
}
