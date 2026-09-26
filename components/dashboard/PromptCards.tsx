"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { PROMPT_SUGGESTIONS } from "@/lib/data/prompts";

export default function PromptCards() {
  const router = useRouter();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#4cd7f6] text-lg">
            lightbulb
          </span>
          <span className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
            Try Asking
          </span>
          <span className="font-inter text-label-xs px-2 py-0.5 rounded-full bg-[#262a33] text-[#c7c4d7]">
            Curated Syntheses
          </span>
        </div>
        <button className="font-inter text-label-md text-[#c7c4d7] hover:text-[#4cd7f6] transition-colors flex items-center gap-1">
          <span>Browse Matrix Archive</span>
          <span className="material-symbols-outlined text-sm">east</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROMPT_SUGGESTIONS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => router.push("/comparison")}
            className="cursor-pointer p-4 rounded-xl bg-[#181c24] hover:bg-[#262a33] shadow-md transition-all group relative flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">{p.emoji}</span>
                <span className="font-inter text-label-xs text-[#c7c4d7] uppercase font-semibold tracking-wider">
                  {p.category}
                </span>
              </div>
              <span className="material-symbols-outlined text-sm text-[#c7c4d7] group-hover:text-[#c0c1ff] transition-colors">
                north_east
              </span>
            </div>
            <p className="font-inter text-body-md text-[#dfe2ee] font-medium group-hover:text-[#c0c1ff] transition-colors">
              {p.prompt}
            </p>
            <div className="mt-4 flex items-center justify-between text-[#c7c4d7] font-jetbrains text-code-sm pt-2 border-t border-[#262a33]">
              <span>{p.providers}</span>
              <span
                className={
                  p.leader === "claude"
                    ? "text-[#61dbb4]"
                    : p.leader === "perplexity"
                    ? "text-[#4cd7f6]"
                    : "text-[#61dbb4]"
                }
              >
                {p.consensusLabel}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
