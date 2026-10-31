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
          Four frictionless steps from query to definitive answer.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            className="bg-[#262a33] rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative"
          >
            {/* Connector line for desktop */}
            {i < STEPS.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 w-6 h-px bg-[#464554] z-10" />
            )}
            <div className="flex items-center justify-between">
              <span
                className="font-jetbrains text-code-sm font-bold"
                style={{ color: step.numColor }}
              >
                {step.num}
              </span>
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ color: step.iconColor }}
              >
                {step.icon}
              </span>
            </div>
            <div>
              <h3 className="font-plus-jakarta text-headline-sm text-[#dfe2ee] mb-2">
                {step.title}
              </h3>
              <p className="font-inter text-body-sm text-[#c7c4d7]">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
