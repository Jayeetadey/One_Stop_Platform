"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AI_ENGINES } from "@/lib/data/engines";

export default function QueryInput() {
  const [prompt, setPrompt] = useState("");
  const [activeEngines, setActiveEngines] = useState<Set<string>>(
    new Set(AI_ENGINES.map((e) => e.id))
  );
  const [mode, setMode] = useState<"fast" | "deep">("fast");
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleEngine = (id: string) => {
    setActiveEngines((prev) => {
      const next = new Set(prev);
      if (next.has(id) && next.size > 1) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      textareaRef.current?.focus();
      return;
    }
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/comparison");
    }, 1500);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#181c24] shadow-xl p-8 md:p-12 mb-8">
      {/* Background blurs */}
      <div className="absolute -right-16 -top-24 w-96 h-96 bg-[#8083ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-[#03b5d3]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute left-10 top-1/2 w-48 h-48 bg-[#12a480]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#262a33] mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#61dbb4] animate-pulse" />
          <span className="font-inter text-label-xs text-[#c7c4d7] uppercase tracking-wider">
            Multi-Model Orchestration Engine
          </span>
        </div>

        <div className="font-plus-jakarta text-headline-sm text-[#4cd7f6] mb-1 tracking-tight flex items-center gap-2">
          <span>Good morning, Alex</span>
          <span className="inline-block animate-bounce">👋</span>
        </div>

        <h1 className="font-plus-jakarta text-display-xl text-[#dfe2ee] tracking-tight leading-tight mb-3 max-w-2xl">
          What would you like to know?
        </h1>
        <p className="font-inter text-body-lg text-[#c7c4d7] max-w-xl mb-8">
          One Question. 5 AI Answers from OpenAI, Gemini, Claude, Grok &amp;
          Perplexity.
        </p>

        {/* Input box */}
        <div className="w-full bg-[#0a0e16] rounded-2xl shadow-2xl p-4 md:p-6 text-left group transition-all duration-300 focus-within:shadow-[0_0_35px_rgba(192,193,255,0.1)]">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Ask anything... (e.g. Compare quantum computing vs classical cryptography)"
            rows={3}
            className="w-full bg-transparent border-none outline-none font-inter text-body-lg text-[#dfe2ee] placeholder:text-[#908fa0] resize-none leading-relaxed min-h-[92px]"
          />

          <div className="mt-4 pt-4 border-t border-[#1c2028] flex flex-col gap-4">
            {/* Engines + Mode */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-inter text-label-xs uppercase tracking-widest text-[#c7c4d7] mr-1">
                  Target Engines
                </span>
                <div className="flex flex-wrap gap-2" id="engine-pills">
                  {AI_ENGINES.map((engine) => {
                    const isActive = activeEngines.has(engine.id);
                    return (
                      <button
                        key={engine.id}
                        type="button"
                        onClick={() => toggleEngine(engine.id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-jetbrains text-code-sm transition-all ${
                          isActive
                            ? "bg-[#262a33] text-[#dfe2ee]"
                            : "bg-[#0a0e16] text-[#908fa0]"
                        }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: engine.color,
                            boxShadow: isActive
                              ? `0 0 8px ${engine.color}`
                              : "none",
                          }}
                        />
                        <span>{engine.name}</span>
                        {isActive && (
                          <span className="material-symbols-outlined text-xs text-[#61dbb4]">
                            check
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex items-center gap-1 bg-[#262a33] p-1 rounded-xl">
                {(["fast", "deep"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`px-3 py-1 rounded-lg font-inter text-label-md transition-colors capitalize ${
                      mode === m
                        ? "bg-[#0a0e16] text-[#dfe2ee] shadow-sm"
                        : "text-[#c7c4d7] hover:text-[#dfe2ee]"
                    }`}
                  >
                    {m === "fast" ? "Fast Mode" : "Deep Research Mode"}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                {["attach_file", "code", "mic"].map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="p-1.5 rounded-xl bg-[#1c2028] hover:bg-[#262a33] text-[#c7c4d7] hover:text-[#dfe2ee] transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      {icon}
                    </span>
                  </button>
                ))}
                <span className="font-jetbrains text-code-sm text-[#464554] ml-2">
                  Token limit: 128k
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline font-jetbrains text-code-sm text-[#c7c4d7]">
                  ⌘ + Enter
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c0c1ff] text-[#1000a9] font-plus-jakarta text-headline-sm hover:bg-[#e1e0ff] active:scale-95 shadow-lg transition-all"
                >
                  <span>Ask All 5 Models</span>
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 inset-x-0 z-50 max-w-lg mx-auto px-4"
          >
            <div className="p-4 rounded-2xl bg-[#262a33]/95 backdrop-blur-2xl shadow-2xl flex items-center justify-between text-[#dfe2ee]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#c0c1ff] animate-ping" />
                <div>
                  <div className="font-plus-jakarta text-headline-sm">
                    Dispatched to {activeEngines.size} Engines
                  </div>
                  <div className="font-jetbrains text-code-sm text-[#c7c4d7]">
                    &quot;{prompt.slice(0, 45)}...&quot; [
                    {mode.toUpperCase()}]
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
