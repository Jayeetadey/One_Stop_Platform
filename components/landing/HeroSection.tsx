"use client";

import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import Link from "next/link";

const MOCK_CARDS = [
  {
    engine: "Claude 3.5 Sonnet",
    color: "#61dbb4",
    time: "380ms • 412t",
    text: "PostgreSQL 16 introduced parallel builds for partitioned hash tables, scaling linearly across CPU cores. Unlike distributed engines (Presto/Trino), it lacks cross-node serialization overhead...",
    badge: "99.4% factual match",
  },
  {
    engine: "OpenAI GPT-4o",
    color: "#c0c1ff",
    time: "410ms • 490t",
    text: "PG16 minimizes shared memory contention via adaptive batch sizing. Distributed query engines like ClickHouse or Snowflake offer massive horizontal sharding, whereas PG16 parallel joins remain strictly SMP...",
    badge: "Fastest token rate",
  },
  {
    engine: "Sonar Pro",
    color: "#4cd7f6",
    time: "520ms • 388t",
    text: "Direct benchmarks from pgbench 2024 indicate up to 3.2x throughput gains for skewed keys. Verified citations link to PostgreSQL core commit logs and Citus data whitepapers...",
    badge: "4 Verified Sources",
  },
];

const ENGINE_PILLS = [
  { label: "OpenAI", color: "#c0c1ff" },
  { label: "Gemini", color: "#4cd7f6" },
  { label: "Claude", color: "#61dbb4" },
  { label: "Grok", color: "#908fa0" },
  { label: "Perplexity", color: "#4cd7f6" },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

interface HeroSectionProps {
  onOpenSignIn?: () => void;
  isAuthenticated?: boolean;
}

export default function HeroSection({ onOpenSignIn, isAuthenticated }: HeroSectionProps) {
  return (
    <section
      className="relative w-full flex flex-col items-center text-center px-4 py-16"
      id="hero"
    >
      {/* Ambient glow */}
      <div className="absolute -top-12 w-3/4 max-w-3xl h-64 bg-gradient-to-r from-[#8083ff]/20 via-[#4cd7f6]/15 to-[#61dbb4]/20 blur-3xl -z-10 pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col items-center"
      >
        {/* Announcement pill */}
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#262a33] text-[#c7c4d7] font-inter text-label-xs shadow-sm mb-8"
        >
          <span className="text-[#61dbb4] font-bold">✨</span>
          <span>Announcing Multi-Model Unified Intelligence v2.4</span>
          <span className="material-symbols-outlined text-[14px] text-[#908fa0]">
            chevron_right
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.div
          variants={fadeUp}
          className="font-plus-jakarta text-headline-sm text-[#4cd7f6] mb-2 tracking-tight flex items-center gap-2"
        >
          <span>Good morning</span>
          <span className="inline-block animate-bounce">👋</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          className="font-plus-jakarta text-display-xl md:text-[56px] leading-[1.1] tracking-[-0.03em] font-bold text-[#dfe2ee] max-w-4xl uppercase mb-4"
        >
          ONE QUESTION.
          <br />
          <span className="bg-gradient-to-r from-[#c0c1ff] via-[#4cd7f6] to-[#7ff8cf] bg-clip-text text-transparent">
            MULTIPLE AI ANSWERS.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="font-inter text-body-lg text-[#c7c4d7] max-w-xl mb-10"
        >
          Stop opening 5 browser tabs. Enter your question once and get
          simultaneous, side-by-side answers from OpenAI, Gemini, Claude, Grok,
          and Perplexity in one powerful workspace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          {isAuthenticated ? (
            <Link
              href="/dashboard"
              className="px-8 py-3.5 rounded-full bg-[#8083ff] text-[#07006c] font-plus-jakarta text-headline-sm shadow-xl hover:bg-[#c0c1ff] transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined">bolt</span>
              <span>Open Dashboard</span>
            </Link>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="px-8 py-3.5 rounded-full bg-[#8083ff] text-[#07006c] font-plus-jakarta text-headline-sm shadow-xl hover:bg-[#c0c1ff] transition-all active:scale-95 flex items-center gap-2 cursor-pointer font-bold"
            >
              <span className="material-symbols-outlined">bolt</span>
              <span>Try One Stop Platform Free</span>
            </button>
          )}
          <button className="px-8 py-3.5 rounded-full bg-[#262a33] text-[#dfe2ee] font-plus-jakarta text-headline-sm shadow-sm hover:bg-[#353942] transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">play_circle</span>
            <span>Watch 60s Demo</span>
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center gap-4 text-[#c7c4d7] mb-12"
        >
          <div className="flex -space-x-2">
            {["AI", "ML", "DEV", "+45k"].map((label, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border border-[#0f131c]"
                style={{
                  backgroundColor: ["#8083ff40", "#03b5d340", "#12a48040", "#31353e"][i],
                  color: ["#c0c1ff", "#4cd7f6", "#61dbb4", "#dfe2ee"][i],
                }}
              >
                {label}
              </div>
            ))}
          </div>
          <span className="font-inter text-body-sm text-[#908fa0]">
            Trusted by researchers, engineers, and product teams
          </span>
        </motion.div>

        {/* Interactive mockup */}
        <motion.div
          variants={fadeUp}
          className="w-full max-w-4xl bg-[#1c2028] rounded-2xl shadow-2xl p-6 flex flex-col gap-6 text-left"
        >
          {/* Search bar */}
          <div className="w-full bg-[#0a0e16] rounded-xl p-4 flex flex-col gap-4 shadow-inner">
            <div className="flex items-center gap-3 text-[#c7c4d7]">
              <span className="material-symbols-outlined text-[#4cd7f6]">
                search
              </span>
              <span className="font-inter text-body-md text-[#dfe2ee] truncate flex-1">
                How do PostgreSQL 16 parallel hash joins compare with
                distributed query engines?
              </span>
              <span className="px-2 py-0.5 rounded bg-[#262a33] text-[#908fa0] font-inter text-label-xs">
                ⌘K
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {ENGINE_PILLS.map((pill) => (
                <span
                  key={pill.label}
                  className="px-3 py-1 rounded-full bg-[#31353e]/80 font-inter text-label-xs flex items-center gap-1.5"
                  style={{ color: pill.color }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: pill.color }}
                  />
                  {pill.label}
                </span>
              ))}
            </div>
          </div>

          {/* Response cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_CARDS.map((card, i) => (
              <motion.div
                key={card.engine}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.15, duration: 0.5 }}
                className="bg-[#262a33] rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 w-full h-[2px]"
                  style={{ backgroundColor: card.color }}
                />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: card.color }}
                      />
                      <span
                        className="font-inter text-label-xs font-semibold"
                        style={{ color: card.color }}
                      >
                        {card.engine}
                      </span>
                    </div>
                    <span className="font-jetbrains text-code-sm text-[#908fa0]">
                      {card.time}
                    </span>
                  </div>
                  <p className="font-inter text-body-sm text-[#c7c4d7] line-clamp-4">
                    {card.text}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 text-[#908fa0]">
                  <span
                    className="font-inter text-label-xs font-medium"
                    style={{ color: card.color }}
                  >
                    {card.badge}
                  </span>
                  <div className="flex gap-2">
                    <button className="p-1 hover:text-[#dfe2ee] transition-colors">
                      <span className="material-symbols-outlined text-[16px]">
                        content_copy
                      </span>
                    </button>
                    <button className="p-1 hover:text-[#dfe2ee] transition-colors">
                      <span className="material-symbols-outlined text-[16px]">
                        bookmark
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
