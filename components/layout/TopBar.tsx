"use client";

import { usePathname } from "next/navigation";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/comparison": "Synthesis Core",
  "/history": "History",
  "/saved": "Saved Answers",
  "/settings": "Settings",
};

export default function TopBar() {
  const pathname = usePathname();
  const currentLabel = BREADCRUMB_MAP[pathname] ?? "Platform";

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-[#0f131c]/80 backdrop-blur-xl z-40 flex items-center justify-between px-6 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4">
        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-1 font-inter text-body-sm text-[#c7c4d7]">
          <span className="hover:text-[#dfe2ee] cursor-pointer transition-colors">
            Platform
          </span>
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
          <span className="text-[#dfe2ee] font-plus-jakarta text-headline-sm">
            {currentLabel}
          </span>
        </div>

        {/* Engine Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#262a33]">
          <span className="w-2 h-2 rounded-full bg-[#61dbb4] animate-pulse" />
          <span className="font-inter text-label-xs text-[#61dbb4] font-semibold tracking-wide">
            5 AI Engines Online
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Keyboard Shortcut */}
        <div className="hidden md:flex items-center gap-1 px-3 py-1 rounded-xl bg-[#181c24] text-[#c7c4d7] font-jetbrains text-code-sm">
          <span className="material-symbols-outlined text-sm">
            keyboard_command_key
          </span>
          <span>K Quick Ask</span>
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 text-[#c7c4d7] hover:text-[#dfe2ee] hover:bg-[#262a33] rounded-xl transition-colors">
          <span className="material-symbols-outlined text-lg">
            notifications
          </span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#4cd7f6]" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-xs font-bold text-[#dfe2ee]">
            AM
          </div>
          <span className="material-symbols-outlined text-sm text-[#c7c4d7]">
            expand_more
          </span>
        </div>
      </div>
    </header>
  );
}
