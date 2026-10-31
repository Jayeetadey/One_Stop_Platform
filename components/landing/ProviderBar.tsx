"use client";

import { motion } from "framer-motion";

const PROVIDERS = [
  { icon: "psychology", color: "#c0c1ff", name: "OpenAI", model: "GPT-4o Omnimodal" },
  { icon: "auto_awesome", color: "#4cd7f6", name: "Google Gemini", model: "Gemini 1.5 Pro" },
  { icon: "cognition", color: "#61dbb4", name: "Anthropic Claude", model: "Claude 3.5 Sonnet" },
  { icon: "terminal", color: "#dfe2ee", name: "xAI Grok", model: "Grok 2 Real-Time" },
  { icon: "travel_explore", color: "#4cd7f6", name: "Perplexity", model: "Sonar Pro Web" },
];

export default function ProviderBar() {
  return (
    <section className="w-full py-10 flex flex-col items-center gap-6">
      <p className="font-inter text-label-xs uppercase tracking-widest text-[#908fa0]">
        POWERED BY THE WORLD&apos;S LEADING INTELLIGENCE ENGINES
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 max-w-5xl">
        {PROVIDERS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="flex items-center gap-3 px-5 py-3 rounded-xl bg-[#1c2028] hover:bg-[#262a33] transition-colors shadow-sm cursor-pointer"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ color: p.color }}
            >
              {p.icon}
            </span>
            <div className="flex flex-col text-left">
              <span className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
                {p.name}
              </span>
              <span className="font-inter text-label-xs text-[#908fa0]">
                {p.model}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
