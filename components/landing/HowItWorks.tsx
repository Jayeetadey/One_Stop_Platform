"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    numColor: "#c0c1ff",
    icon: "chat",
    iconColor: "#c0c1ff",
    title: "Ask",
    desc: "Enter your prompt into the unified command input. Optionally configure temperature, reasoning mode, or web access.",
  },
  {
    num: "02",
    numColor: "#4cd7f6",
    icon: "hub",
    iconColor: "#4cd7f6",
    title: "5 Frontier Engines",
    desc: "Our multiplexer orchestrates simultaneous token streaming across OpenAI, Gemini, Claude, Grok, and Perplexity.",
  },
  {
    num: "03",
    numColor: "#61dbb4",
    icon: "compare",
    iconColor: "#61dbb4",
    title: "Compare",
    desc: "Review the side-by-side matrix with token metrics, millisecond latencies, and source citation indicators.",
  },
  {
    num: "04",
    numColor: "#acedff",
    icon: "output",
    iconColor: "#acedff",
    title: "Save & Use",
    desc: "Copy the winner, pin synthesis insights, tag historical queries, or directly export to team productivity tools.",
  },
];

export default function HowItWorks() {
  return (
    <section
      className="w-full py-12 flex flex-col items-center gap-8"
      id="how-it-works"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center text-center max-w-xl mx-auto gap-2"
      >
        <span className="font-inter text-label-xs text-[#4cd7f6] font-semibold uppercase tracking-wider">
          Streamlined Workflow
        </span>
        <h2 className="font-plus-jakarta text-headline-lg text-[#dfe2ee]">
          How It Works
        </h2>
        <p className="font-inter text-body-md text-[#c7c4d7]">
          Four simple steps from question to definitive answer.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto w-full px-2">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.num}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="bg-[#1c2028] rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-[#464554]/20"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className="font-jetbrains text-display-md font-bold text-2xl"
                  style={{ color: s.numColor }}
                >
                  {s.num}
                </span>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: s.iconColor }}
                >
                  {s.icon}
                </span>
              </div>
              <h3 className="font-plus-jakarta text-headline-sm text-[#dfe2ee] mb-2">
                {s.title}
              </h3>
              <p className="font-inter text-body-sm text-[#c7c4d7] leading-relaxed">
                {s.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
