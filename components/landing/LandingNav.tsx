"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface LandingNavProps {
  onOpenSignIn?: () => void;
  isAuthenticated?: boolean;
}

export default function LandingNav({ onOpenSignIn, isAuthenticated }: LandingNavProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex items-center justify-between py-3 px-6 md:px-8 bg-[#1c2028]/60 backdrop-blur-xl rounded-2xl mb-12 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#c0c1ff] to-[#4cd7f6] flex items-center justify-center text-[#1000a9] font-bold text-sm font-jetbrains shadow-sm">
          1S
        </div>
        <span className="font-plus-jakarta text-headline-sm tracking-tight text-[#dfe2ee]">
          ONE STOP PLATFORM
        </span>
      </div>

      <nav className="hidden lg:flex items-center gap-8 text-[#c7c4d7]">
        {["Home", "Features", "How It Works", "Pricing"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
            className="font-inter text-label-md hover:text-[#dfe2ee] transition-colors"
          >
            {item}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <Link
            href="/dashboard"
            className="px-5 py-2 rounded-full bg-[#8083ff] text-[#07006c] font-inter text-label-md font-semibold shadow-md hover:bg-[#c0c1ff] transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Open Dashboard</span>
            <span className="material-symbols-outlined text-[16px]">
              arrow_forward
            </span>
          </Link>
        ) : (
          <>
            <button
              type="button"
              onClick={onOpenSignIn}
              className="inline-flex px-4 py-1.5 rounded-full bg-[#31353e]/50 hover:bg-[#31353e] text-[#c7c4d7] hover:text-[#dfe2ee] font-inter text-label-md transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onOpenSignIn}
              className="px-5 py-2 rounded-full bg-[#8083ff] text-[#07006c] font-inter text-label-md font-semibold shadow-md hover:bg-[#c0c1ff] transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started Free</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </button>
          </>
        )}
      </div>
    </motion.header>
  );
}
