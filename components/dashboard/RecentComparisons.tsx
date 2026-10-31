"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { RECENT_COMPARISONS } from "@/lib/data/comparisons";

const MODE_COLORS: Record<string, string> = {
  fast: "#61dbb4",
  deep: "#c0c1ff",
};

export default function RecentComparisons() {
  return (
    <div className="lg:col-span-7 flex flex-col bg-[#181c24] rounded-2xl p-6 shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-lg">
            history_edu
          </span>
          <h2 className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
            Recent Comparisons
          </h2>
        </div>
        <Link
          href="#"
          className="font-inter text-label-md text-[#c0c1ff] hover:text-[#e1e0ff] transition-colors"
        >
          View All Archive
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {RECENT_COMPARISONS.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="p-4 rounded-xl bg-[#1c2028] hover:bg-[#262a33] transition-colors flex items-center justify-between gap-4 group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-inter text-label-xs px-2 py-0.5 rounded bg-[#31353e] text-[#4cd7f6] font-jetbrains">
                  {item.engineCount} Engines
                </span>
                <span className="font-jetbrains text-code-sm text-[#c7c4d7]">
                  {item.time}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#464554]" />
                <span
                  className="font-jetbrains text-code-sm font-semibold"
                  style={{ color: MODE_COLORS[item.mode] }}
                >
                  {item.mode === "fast" ? "Fast Mode" : "Deep Research"}
                </span>
              </div>
              <p className="font-plus-jakarta text-body-md text-[#dfe2ee] truncate group-hover:text-[#c0c1ff] transition-colors">
                {item.query}
              </p>
              <div className="flex items-center gap-3 mt-2 text-[#c7c4d7] font-jetbrains text-code-sm">
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.bestEngineColor }}
                  />
                  Best: {item.bestEngine}
                </span>
                <span>•</span>
                <span>Avg Latency: {item.avgLatency}</span>
              </div>
            </div>
            <Link href="/comparison">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="shrink-0 p-2 rounded-xl bg-[#262a33] text-[#dfe2ee] hover:bg-[#c0c1ff] hover:text-[#1000a9] transition-all"
              >
                <span className="material-symbols-outlined text-base">
                  open_in_new
                </span>
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
