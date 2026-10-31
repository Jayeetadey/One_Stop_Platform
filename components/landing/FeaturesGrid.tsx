"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "dynamic_feed",
    color: "#c0c1ff",
    bgColor: "#8083ff20",
    title: "Ask Once, Save Hours",
    desc: "One clean prompt automatically dispatches to 5 frontier LLMs concurrently. Zero repetitive copy-pasting across browser windows.",
    badge: "Saves hours per research sprint",
    badgeIcon: "check_circle",
    badgeColor: "#61dbb4",
    span: "md:col-span-3",
  },
  {
    icon: "splitscreen",
    color: "#4cd7f6",
    bgColor: "#03b5d320",
    title: "Side-by-Side Comparison",
    desc: "Instantly spot hallucinations, cross-verify numerical facts, and contrast coding patterns side-by-side with synchronized viewport scrolling.",
    badge: "Cross-verification accuracy",
    badgeIcon: "verified",
    badgeColor: "#61dbb4",
    span: "md:col-span-3",
  },
  {
    icon: "bookmarks",
    color: "#61dbb4",
    bgColor: "#12a48020",
    title: "Save & Organize",
    desc: "Bookmark optimal outputs, tag insights by domain, and export structured summaries into Markdown or Notion in a click.",
    badge: null,
    span: "md:col-span-2",
  },
  {
    icon: "history",
    color: "#c7c4d7",
    bgColor: "#26263320",
    title: "Conversation History",
    desc: "Fully searchable archives of multi-engine queries, output diffs, and benchmark scores across team projects.",
    badge: null,
    span: "md:col-span-2",
  },
  {
    icon: "speed",
    color: "#c0c1ff",
    bgColor: "#8083ff20",
    title: "Speed & Cost Efficiency",
    desc: "Ultra-fast multiplexed pipeline. No individual API keys or separate enterprise billing tiers required.",
    badge: null,
    span: "md:col-span-2",
  },
];

export default function FeaturesGrid() {
  return (
    <section className="w-full py-12 flex flex-col gap-8" id="features">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center max-w-2xl mx-auto gap-3"
      >
        <span className="font-inter text-label-xs text-[#c0c1ff] font-semibold uppercase tracking-wider">
          Multi-Model Intelligence
        </span>
        <h2 className="font-plus-jakarta text-headline-lg text-[#dfe2ee]">
          Why Compare AI Models?
        </h2>
        <p className="font-inter text-body-md text-[#c7c4d7]">
          No single model holds all the answers. Compare nuances,
          avoid hallucinations, and get the most complete answer from top AI models.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-5 max-w-5xl mx-auto w-full">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`${f.span} bg-[#1c2028] rounded-2xl p-6 flex flex-col justify-between shadow-sm cursor-default border border-[#464554]/20`}
          >
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: f.bgColor }}
              >
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ color: f.color }}
                >
                  {f.icon}
                </span>
              </div>
              <h3 className="font-plus-jakarta text-headline-sm text-[#dfe2ee] mb-2">
                {f.title}
              </h3>
              <p className="font-inter text-body-sm text-[#c7c4d7] leading-relaxed">
                {f.desc}
              </p>
            </div>

            {f.badge && (
              <div
                className="inline-flex items-center gap-1.5 pt-4 font-inter text-label-xs font-semibold"
                style={{ color: f.badgeColor }}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {f.badgeIcon}
                </span>
                <span>{f.badge}</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
