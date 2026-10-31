"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";

const CONVERSATIONS = [
  { id: "1", title: "What is blockchain and how does it work?", time: "Today" },
  { id: "2", title: "Compare PostgreSQL vs CockroachDB", time: "Today" },
  { id: "3", title: "EU AI Act legal ramifications", time: "Yesterday" },
  { id: "4", title: "Rust async backpressure patterns", time: "Yesterday" },
  { id: "5", title: "Zero-Knowledge Proof cryptography", time: "Last 7 days" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Group conversations by time
  const groups = CONVERSATIONS.reduce(
    (acc, c) => {
      if (!acc[c.time]) acc[c.time] = [];
      acc[c.time].push(c);
      return acc;
    },
    {} as Record<string, typeof CONVERSATIONS>
  );

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0a0e16] z-50 flex flex-col">
      {/* New Chat */}
      <div className="p-3">
        <Link
          href="/"
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-[#1c2028] text-[#dfe2ee] font-inter text-body-md transition-colors group"
        >
          <span className="material-symbols-outlined text-lg">edit_square</span>
          <span>New chat</span>
        </Link>
      </div>

      {/* Conversation History */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        {Object.entries(groups).map(([time, convos]) => (
          <div key={time} className="mb-4">
            <p className="px-3 py-1 font-inter text-label-xs text-[#908fa0] font-semibold">
              {time}
            </p>
            {convos.map((c) => (
              <Link
                key={c.id}
                href="/comparison"
                onMouseEnter={() => setHoveredId(c.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`relative flex items-center px-3 py-2 rounded-lg font-inter text-body-sm transition-colors truncate ${
                  pathname === "/comparison" && c.id === "1"
                    ? "bg-[#1c2028] text-[#dfe2ee]"
                    : "text-[#c7c4d7] hover:bg-[#1c2028] hover:text-[#dfe2ee]"
                }`}
              >
                <span className="truncate">{c.title}</span>
                {hoveredId === c.id && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute right-2 text-[#908fa0] hover:text-[#dfe2ee]"
                  >
                    <span className="material-symbols-outlined text-sm">
                      more_horiz
                    </span>
                  </motion.span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-[#1c2028]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#1c2028] cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#c0c1ff] to-[#4cd7f6] flex items-center justify-center text-[10px] font-bold text-[#07006c]">
            A
          </div>
          <span className="font-inter text-body-sm text-[#dfe2ee]">Alex Morgan</span>
        </div>
      </div>
    </aside>
  );
}
