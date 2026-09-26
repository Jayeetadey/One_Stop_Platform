"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function FollowUpDock() {
  const [question, setQuestion] = useState("");

  return (
    <div className="fixed bottom-6 left-72 right-0 z-40 px-6 pointer-events-none">
      <div className="max-w-4xl mx-auto w-full pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="relative p-4 rounded-2xl bg-[#181c24]/90 backdrop-blur-2xl shadow-2xl flex flex-col gap-3 border border-[#464554]/30"
        >
          {/* Top row */}
          <div className="flex items-center justify-between gap-3 border-b border-[#262a33] pb-3">
            <div className="flex items-center gap-2">
              <span className="font-inter text-label-xs uppercase tracking-wider text-[#c7c4d7] font-semibold">
                Follow-Up Target:
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#c0c1ff]/10 text-[#c0c1ff] font-inter text-[11px] font-semibold">
                All 5 Active
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#1c2028] text-[#c7c4d7] font-jetbrains text-[11px]">
                Preserve Thread Context
              </span>
            </div>
            <span className="font-jetbrains text-code-sm text-[#c7c4d7] text-xs">
              Shift + Enter for multiline
            </span>
          </div>

          {/* Input row */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-[#c0c1ff] pl-1">
              <span className="material-symbols-outlined">chat_bubble</span>
            </div>
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 bg-transparent text-[#dfe2ee] placeholder:text-[#c7c4d7] focus:outline-none font-inter text-body-md py-1"
              placeholder="Ask a follow-up question across all 5 engines (e.g. 'Compare consensus overhead in Solana vs Ethereum')..."
              type="text"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setQuestion("");
                }
              }}
            />
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-xl hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] transition-colors">
                <span className="material-symbols-outlined text-lg">
                  attach_file
                </span>
              </button>
              <button className="p-1.5 rounded-xl hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] transition-colors">
                <span className="material-symbols-outlined text-lg">tune</span>
              </button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setQuestion("")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c0c1ff] text-[#1000a9] hover:bg-[#e1e0ff] font-plus-jakarta text-headline-sm transition-all shadow-md"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-sm font-bold">
                  send
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
