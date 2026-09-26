"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="w-full py-12 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl bg-gradient-to-br from-[#1c2028] to-[#262a33] rounded-3xl p-10 md:p-14 shadow-xl flex flex-col items-center text-center gap-6 relative overflow-hidden"
      >
        {/* Decorative aura */}
        <div className="absolute -bottom-16 w-80 h-80 bg-[#c0c1ff]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#61dbb4]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Stars */}
        <div className="relative flex items-center gap-1 text-[#61dbb4]">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="material-symbols-outlined text-[18px]">
              star
            </span>
          ))}
        </div>

        <h2 className="relative font-plus-jakarta text-headline-lg text-[#dfe2ee] max-w-xl">
          The Ultimate AI Benchmarking &amp; Productivity Workspace
        </h2>

        <p className="relative font-inter text-body-md text-[#c7c4d7] max-w-lg">
          &ldquo;One Stop Platform eliminated context switching for our ML
          research lab. Finding the right response takes seconds now instead of
          half an hour.&rdquo;
        </p>

        {/* CTA */}
        <div className="relative flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-full bg-[#8083ff] text-[#07006c] font-plus-jakarta text-headline-sm shadow-xl hover:bg-[#c0c1ff] transition-all active:scale-95"
          >
            Start Free Trial — No Credit Card Required
          </Link>
        </div>

        <span className="relative font-inter text-label-xs text-[#908fa0]">
          Instant access • Free tier includes 100 multi-model queries/mo
        </span>
      </motion.div>
    </section>
  );
}
