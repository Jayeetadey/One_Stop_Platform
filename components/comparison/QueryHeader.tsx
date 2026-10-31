"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ViewMode } from "@/lib/types";
import { AI_ENGINES } from "@/lib/data/engines";

interface QueryHeaderProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const VIEW_OPTIONS: { id: ViewMode; icon: string; label: string }[] = [
  { id: "grid", icon: "dashboard", label: "Matrix Grid" },
  { id: "split", icon: "view_column", label: "Split Columns" },
  { id: "digest", icon: "layers", label: "Consensus Digest" },
];

export default function QueryHeader({ viewMode, onViewChange }: QueryHeaderProps) {
  const [rerunning, setRerunning] = useState(false);

  const handleRerun = () => {
    setRerunning(true);
    setTimeout(() => setRerunning(false), 1200);
  };

  return (
    <section className="relative overflow-hidden rounded-xl bg-[#181c24] p-6 mb-6 shadow-xl">
      {/* Decorative blurs */}
      <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-[#c0c1ff]/5 blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#4cd7f6]/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#262a33] text-[#c0c1ff] font-inter text-label-xs uppercase tracking-widest font-semibold">
              Synthesis Query Core
            </span>
            <span className="text-[#c7c4d7] font-inter text-body-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Asked 2 mins ago
            </span>
            <span className="text-[#464554] font-jetbrains text-code-sm">•</span>
            <span className="text-[#c7c4d7] font-inter text-body-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-[#61dbb4]">hub</span>
              5 Models Parallel
            </span>
            <span className="text-[#464554] font-jetbrains text-code-sm">•</span>
            <span className="text-[#4cd7f6] font-jetbrains text-code-sm font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">speed</span>
              1.4s avg latency
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleRerun}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-inter text-label-md transition-all shadow-sm"
            >
              <span
                className={`material-symbols-outlined text-sm text-[#c0c1ff] ${rerunning ? "animate-spin" : ""}`}
              >
                sync
              </span>
              <span>Re-run All</span>
            </motion.button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-inter text-label-md transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>Filter (5/5)</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-inter text-label-md transition-all shadow-sm">
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Export</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-inter text-label-md shadow-md hover:bg-[#e1e0ff] transition-all">
              <span className="material-symbols-outlined text-sm">share</span>
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Question callout */}
        <div className="p-5 rounded-xl bg-[#1c2028] flex items-start gap-5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#31353e] flex items-center justify-center shrink-0 text-[#c0c1ff]">
            <span className="material-symbols-outlined text-xl">psychology_alt</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-inter text-label-xs uppercase tracking-wider text-[#c7c4d7] font-semibold">
              Universal Prompt Dispatched
            </span>
            <h1 className="font-plus-jakarta text-headline-lg text-[#dfe2ee] tracking-tight leading-tight">
              What is blockchain and how does it work?
            </h1>
            <div className="flex flex-wrap items-center gap-5 pt-1 text-[#c7c4d7] font-inter text-body-sm">
              <span>
                Context:{" "}
                <span className="text-[#dfe2ee] font-semibold">
                  Distributed Ledger Systems
                </span>
              </span>
              <span>
                Target Depth:{" "}
                <span className="text-[#dfe2ee] font-semibold">
                  Architectural Rigor
                </span>
              </span>
              <span>
                Cross-verification:{" "}
                <span className="text-[#61dbb4] font-semibold">
                  Consensus High (94%)
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Engine pills + View switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-inter text-label-xs text-[#c7c4d7] uppercase font-semibold mr-1">
              Active Engines:
            </span>
            {AI_ENGINES.map((engine) => (
              <button
                key={engine.id}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262a33] hover:bg-[#353942] font-inter text-label-xs transition-all"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: engine.color }}
                />
                <span className="font-semibold text-[#dfe2ee]">
                  {engine.name}
                </span>
                <span className="text-[#c7c4d7]">{engine.model}</span>
                <span
                  className="material-symbols-outlined text-xs"
                  style={{ color: engine.color }}
                >
                  check
                </span>
              </button>
            ))}
          </div>

          {/* View switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#0a0e16]">
            {VIEW_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onViewChange(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-inter text-label-xs transition-all ${
                  viewMode === opt.id
                    ? "bg-[#1c2028] text-[#dfe2ee] shadow-sm font-semibold"
                    : "text-[#c7c4d7] hover:text-[#dfe2ee]"
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {opt.icon}
                </span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
