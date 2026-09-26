"use client";

import { motion } from "framer-motion";
import { AI_ENGINES } from "@/lib/data/engines";

export default function EngineHealthPanel() {
  return (
    <div className="bg-[#181c24] rounded-2xl p-6 shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#61dbb4] text-lg">
            monitoring
          </span>
          <h3 className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
            Engine Latency &amp; Health
          </h3>
        </div>
        <span className="w-2 h-2 rounded-full bg-[#61dbb4] animate-ping" />
      </div>

      <div className="flex flex-col gap-3">
        {AI_ENGINES.map((engine, i) => (
          <motion.div
            key={engine.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1c2028]"
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: engine.color }}
              />
              <span className="font-inter text-body-md text-[#dfe2ee]">
                {engine.provider}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-jetbrains text-code-sm text-[#c7c4d7]">
                {engine.latency}ms
              </span>
              <span className="font-inter text-label-xs font-semibold text-[#61dbb4] px-2 py-0.5 rounded bg-[#61dbb4]/10">
                {engine.uptime}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
