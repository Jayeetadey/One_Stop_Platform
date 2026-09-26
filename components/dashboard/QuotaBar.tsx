"use client";

import { motion } from "framer-motion";

export default function QuotaBar() {
  const percent = 82;
  const circumference = 2 * Math.PI * 15.9155;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div className="w-full bg-[#0a0e16] rounded-2xl p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
      {/* Ring */}
      <div className="flex items-center gap-5">
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#262a33]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <motion.path
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: dashOffset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-[#c0c1ff]"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${circumference}, ${circumference}`}
              strokeLinecap="round"
              strokeWidth="3.5"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-plus-jakarta text-headline-sm text-[#dfe2ee]">
            {percent}%
          </div>
        </div>
        <div>
          <div className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
            Weekly Synthesis Quota
          </div>
          <div className="font-inter text-body-sm text-[#c7c4d7]">
            820 of 1,000 parallel requests used. Resets in 3 days.
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5 w-full md:w-auto">
        <div className="hidden sm:flex flex-col text-right">
          <span className="font-inter text-label-xs text-[#4cd7f6] uppercase tracking-wider font-semibold">
            Concurrency
          </span>
          <span className="font-jetbrains text-code-sm text-[#dfe2ee]">
            5 Models in Parallel
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-[#262a33] hover:bg-[#353942] text-[#dfe2ee] font-plus-jakarta text-headline-sm transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">bolt</span>
          <span>Upgrade to Unlimited</span>
        </motion.button>
      </div>
    </div>
  );
}
