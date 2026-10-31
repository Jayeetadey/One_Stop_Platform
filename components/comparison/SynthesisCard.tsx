"use client";

import { motion } from "framer-motion";

const BAR_DATA = [
  { label: "Claude", tokens: 1120, color: "#c0c1ff", pct: 100 },
  { label: "Gemini", tokens: 1040, color: "#4cd7f6", pct: 92 },
  { label: "OpenAI", tokens: 982, color: "#61dbb4", pct: 87 },
];

export default function SynthesisCard() {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col justify-between rounded-xl bg-[#262a33] overflow-hidden shadow-lg border border-[#c0c1ff]/20"
    >
      {/* Rainbow stripe */}
      <div className="h-1 w-full bg-gradient-to-r from-[#61dbb4] via-[#4cd7f6] to-[#c0c1ff]" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#c0c1ff] text-[#1000a9] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-lg">difference</span>
            </div>
            <div className="flex flex-col">
              <span className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
                Synthesis Insight
              </span>
              <span className="font-inter text-label-xs text-[#c0c1ff] font-semibold">
                Multi-Model Cross Consensus
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#61dbb4]/20 text-[#61dbb4] font-jetbrains text-xs font-bold">
            94% Agreement
          </span>
        </div>

        <div className="flex flex-col gap-3 text-[#dfe2ee] font-inter text-body-sm flex-1">
          {/* Agreement */}
          <div className="p-3 rounded-lg bg-[#1c2028]">
            <div className="font-semibold text-[#dfe2ee] flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-sm text-[#61dbb4]">
                task_alt
              </span>
              Universal Agreement Points:
            </div>
            <p className="text-[#c7c4d7]">
              Cryptographic hashing prevents retro-modification; distributed
              nodes eliminate single points of failure.
            </p>
          </div>

          {/* Divergence */}
          <div className="p-3 rounded-lg bg-[#1c2028]">
            <div className="font-semibold text-[#dfe2ee] flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-sm text-[#4cd7f6]">
                alt_route
              </span>
              Key Divergence / Nuance:
            </div>
            <p className="text-[#c7c4d7]">
              Claude emphasizes Byzantine Fault Tolerance; Grok emphasizes
              practical intermediary disintermediation; Perplexity adds live L2
              and institutional telemetry.
            </p>
          </div>

          {/* Bar chart */}
          <div className="mt-2 p-3 rounded-lg bg-[#0a0e16] flex flex-col gap-3">
            <span className="font-inter text-label-xs text-[#c7c4d7] uppercase font-semibold">
              Comparative Token Density
            </span>
            <div className="space-y-2 font-jetbrains text-[11px]">
              {BAR_DATA.map((bar) => (
                <div key={bar.label} className="flex items-center justify-between gap-3">
                  <span className="w-14 text-[#c7c4d7]">{bar.label}</span>
                  <div className="flex-1 bg-[#262a33] h-2 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.pct}%` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: bar.color }}
                    />
                  </div>
                  <span className="text-[#dfe2ee]">{bar.tokens}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#1c2028] flex items-center justify-between">
        <button className="text-[#c0c1ff] hover:text-[#e1e0ff] font-inter text-label-xs font-semibold flex items-center gap-1 transition-colors">
          <span>Generate Merged Synthesis Document</span>
          <span className="material-symbols-outlined text-xs">arrow_forward</span>
        </button>
        <span className="material-symbols-outlined text-sm text-[#c7c4d7]">
          psychology
        </span>
      </div>
    </motion.article>
  );
}
