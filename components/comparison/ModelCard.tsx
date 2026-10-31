"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AI_ENGINES } from "@/lib/data/engines";

interface ModelCardProps {
  engineId: string;
  tokens: number;
  latencySeconds: number;
  temperature: number;
  contextWindow: string;
  badge: string;
  children: React.ReactNode;
}

export default function ModelCard({
  engineId,
  tokens,
  latencySeconds,
  temperature,
  contextWindow,
  badge,
  children,
}: ModelCardProps) {
  const engine = AI_ENGINES.find((e) => e.id === engineId);
  if (!engine) return null;

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="flex flex-col justify-between rounded-xl bg-[#181c24] overflow-hidden shadow-lg"
    >
      {/* Top color stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: engine.color }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Card header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${engine.color}20` }}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ color: engine.color }}
              >
                {engine.icon}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
                  {engine.provider}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-jetbrains uppercase bg-[#262a33] text-[#c7c4d7] font-semibold">
                  {engine.badge}
                </span>
              </div>
              <span
                className="font-inter text-label-xs font-semibold"
                style={{ color: engine.color }}
              >
                {engine.model}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span
              className="font-jetbrains text-code-sm flex items-center gap-1 font-semibold"
              style={{ color: engine.color }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: engine.color }}
              />
              {latencySeconds}s
            </span>
            <span className="font-inter text-label-xs text-[#c7c4d7]">
              {tokens > 0 ? `${tokens.toLocaleString()} tokens` : "Live Verified"}
            </span>
          </div>
        </div>

        {/* Metric pills */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-[#262a33] text-[#c7c4d7] font-jetbrains text-[11px]">
            temp: {temperature}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#262a33] text-[#c7c4d7] font-jetbrains text-[11px]">
            {contextWindow}
          </span>
          <span
            className="px-2 py-0.5 rounded-full font-inter text-[11px] font-semibold"
            style={{
              backgroundColor: `${engine.color}15`,
              color: engine.color,
            }}
          >
            {badge}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-3 text-[#dfe2ee] font-inter text-body-md flex-1 leading-relaxed">
          {children}
        </div>
      </div>

      {/* Action footer */}
      <div className="px-5 py-3 bg-[#1c2028] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] transition-colors"
            title="Copy"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? "check" : "content_copy"}
            </span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSaved((s) => !s)}
            className={`p-1.5 rounded-lg hover:bg-[#262a33] transition-colors ${
              saved ? "text-[#c0c1ff]" : "text-[#c7c4d7] hover:text-[#c0c1ff]"
            }`}
            title="Save"
          >
            <span className="material-symbols-outlined text-sm">
              {saved ? "bookmark_added" : "bookmark"}
            </span>
          </motion.button>
          <button className="p-1.5 rounded-lg hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] transition-colors" title="Fork">
            <span className="material-symbols-outlined text-sm">alt_route</span>
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-lg hover:bg-[#262a33] text-[#c7c4d7] transition-colors"
            style={{ color: undefined }}
            title="Helpful"
          >
            <span className="material-symbols-outlined text-sm">thumb_up</span>
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#ffb4ab] transition-colors" title="Unhelpful">
            <span className="material-symbols-outlined text-sm">thumb_down</span>
          </button>
          <button className="p-1.5 rounded-lg hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] transition-colors" title="Rerun">
            <span className="material-symbols-outlined text-sm">replay</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
