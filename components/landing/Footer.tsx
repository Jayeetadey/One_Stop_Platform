"use client";

export default function Footer() {
  return (
    <footer className="w-full mt-12 py-8 px-4 bg-[#0a0e16] rounded-2xl flex flex-col gap-8 max-w-7xl mx-auto border border-[#464554]/30">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#c0c1ff] to-[#4cd7f6] flex items-center justify-center text-[#07006c] font-bold text-[10px]">
              1S
            </div>
            <span className="font-plus-jakarta text-headline-sm text-[#dfe2ee]">
              ONE STOP PLATFORM
            </span>
          </div>
          <p className="font-inter text-body-sm text-[#908fa0] max-w-sm">
            Parallel multi-engine intelligence workspace for
            developers, teams, and researchers.
          </p>
        </div>

        <div className="flex flex-wrap gap-12 text-[#c7c4d7] font-inter text-label-md">
          <div className="flex flex-col gap-2">
            <span className="text-[#dfe2ee] font-semibold mb-1">Product</span>
            {["Features", "How It Works", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="hover:text-[#dfe2ee] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#dfe2ee] font-semibold mb-1">Legal</span>
            {["Privacy Policy", "Terms of Service", "Security"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-[#dfe2ee] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[#dfe2ee] font-semibold mb-1">
              Engine Status
            </span>
            <div className="flex items-center gap-1.5 text-[#61dbb4]">
              <span className="w-2 h-2 rounded-full bg-[#61dbb4] animate-ping" />
              <span>All 5 LLMs Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#464554]/40 text-[#908fa0] font-inter text-label-xs">
        <span>© 2026 ONE STOP PLATFORM. All rights reserved.</span>
        <div className="flex gap-6 mt-2 sm:mt-0">
          <span>Multi-Engine LLM Workspace</span>
          <span>v2.4.0</span>
        </div>
      </div>
    </footer>
  );
}
