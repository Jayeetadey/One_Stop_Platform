import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";

// POST /api/chat
// Secure multi-model AI comparison endpoint.
// 1. Enforces server-side session authentication (HttpOnly cookie or Authorization header).
// 2. Enforces rate limiting per authenticated user (Upstash Redis with in-memory fallback).
// 3. Validates prompt, history, roles, and userKeys at runtime.
// 4. Executes all 5 providers in parallel with resilient error isolation.
// 5. Clearly distinguishes official provider API responses from Groq-based fallback & simulated responses.
// 6. Never exposes secret API keys or server tokens in responses or logs.

export interface ModelResult {
  engineId: string;
  name: string;
  provider: string;
  color: string;
  content: string;
  time: string;
  tokens: string;
  error?: string;
  isSimulated?: boolean;
  executionType?: "official" | "groq-fallback" | "simulated" | "unconfigured";
}

// ─── Helper: Validate & resolve API key securely ───
function resolveApiKey(userKey?: string, envKey?: string): string | null {
  const candidate = (userKey || envKey || "").trim();
  if (!candidate) return null;

  const lower = candidate.toLowerCase();
  if (
    lower.startsWith("your_") ||
    lower.endsWith("_here") ||
    candidate.includes("••••") ||
    candidate.includes("...") ||
    lower.includes("placeholder") ||
    candidate.length < 8
  ) {
    return null;
  }

  return candidate;
}

// ─── Helper: Measure elapsed time ───
function elapsed(start: number): string {
  return ((Date.now() - start) / 1000).toFixed(1) + "s";
}

// ─── Groq Cloud Inference Helper (Ultra-fast LPU) ───
async function callGroqAPI(
  groqKey: string,
  model: string,
  systemPrompt: string,
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<{ content: string; totalTokens: number } | null> {
  const candidateModels = Array.from(
    new Set([
      model,
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
      "qwen/qwen3.8-27b",
    ])
  );

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-6).map((h) => ({
      role: h.role,
      content: h.content,
    })),
    { role: "user", content: prompt },
  ];

  for (const candidate of candidateModels) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: candidate,
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        if (content.trim()) {
          const totalTokens = data.usage?.total_tokens ?? Math.round(content.length / 4);
          return { content, totalTokens };
        }
      }
    } catch {
      // Try next candidate model safely
    }
  }

  return null;
}

// ─── Free Public AI Bridge (Fallback when neither official nor Groq keys work) ───
async function fetchFreeAiAnswer(
  engineId: "openai" | "claude" | "gemini" | "grok" | "perplexity",
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[] = []
): Promise<string | null> {
  const personas: Record<string, { model: string; system: string }> = {
    openai: {
      model: "openai",
      system:
        "You are OpenAI GPT-4o. Provide a direct, factual, helpful, and well-structured answer formatted in markdown.",
    },
    claude: {
      model: "mistral",
      system:
        "You are Anthropic Claude 3.5 Sonnet. Provide a thoughtful, nuanced, comprehensive, and well-reasoned answer formatted in clean markdown.",
    },
    gemini: {
      model: "gemini",
      system:
        "You are Google Gemini. Provide a rich, insightful, multi-perspective answer formatted in markdown.",
    },
    grok: {
      model: "llama",
      system:
        "You are xAI Grok 2. Provide a direct, witty, punchy, unvarnished, no-nonsense answer formatted in markdown.",
    },
    perplexity: {
      model: "searchgpt",
      system:
        "You are Perplexity Sonar Pro. Provide a factual, research-backed answer with clear citations [1], [2] and sources.",
    },
  };

  const config = personas[engineId] || personas.openai;

  // 1. Try Free Public Bridge
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const messages = [
      { role: "system", content: config.system },
      ...history.slice(-4).map((h) => ({ role: h.role, content: h.content })),
      { role: "user", content: prompt },
    ];

    const res = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        model: config.model,
        seed: Math.floor(Math.random() * 100000),
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 15) {
        return text.trim();
      }
    }
  } catch {
    // Proceed to Wikipedia lookup
  }

  // 2. Factual Entity Search (Wikipedia API)
  try {
    const entityMatch = prompt.match(
      /(?:who|what|where|tell me about|explain)\s+(?:is|was|are|about)?\s*([^?.,!]+)/i
    );
    const searchTarget = (entityMatch ? entityMatch[1] : prompt).trim();

    if (searchTarget.length > 2) {
      const wikiRes = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          searchTarget.replace(/\s+/g, "_")
        )}`
      );
      if (wikiRes.ok) {
        const wikiData = await wikiRes.json();
        if (wikiData.extract) {
          switch (engineId) {
            case "grok":
              return `**${wikiData.title}**\n\n${wikiData.extract}\n\n*Bottom Line*: One of the most prominent figures in their field.`;
            case "perplexity":
              return `**${wikiData.title}** [1]\n\n${wikiData.extract}\n\n**Sources:**\n[1] *Wikipedia & Official Encyclopedia Records: ${wikiData.title}*`;
            case "claude":
              return `### ${wikiData.title}\n\n${wikiData.extract}\n\n**Significance**: Known for influential career milestones and lasting contributions.`;
            case "gemini":
              return `### Overview: ${wikiData.title}\n\n${wikiData.extract}\n\n**Context**: A notable figure with widespread recognition.`;
            default:
              return `### ${wikiData.title}\n\n${wikiData.extract}\n\n**Highlights**: Notable career with substantial historical impact.`;
          }
        }
      }
    }
  } catch {
    // Wikipedia lookup failed
  }

  return null;
}

// ─── 1. OpenAI (GPT-4o) ───
async function callOpenAI(
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userKey?: string,
  groqKey?: string | null
): Promise<ModelResult> {
  const start = Date.now();
  const apiKey = resolveApiKey(userKey, process.env.OPENAI_API_KEY);

  // A. Official OpenAI API
  if (apiKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      const messages = [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: prompt },
      ];
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "gpt-4o", messages, max_tokens: 1024, temperature: 0.7 }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        const totalTokens = data.usage?.total_tokens ?? Math.round(content.length / 4);
        return {
          engineId: "openai",
          name: "GPT-4o (Official)",
          provider: "OpenAI",
          color: "#10a37f",
          content,
          time: elapsed(start),
          tokens: `${totalTokens} tokens`,
          executionType: "official",
        };
      }
    } catch {
      // Official key failed, proceed to fallback
    }
  }

  // B. High-speed Groq Inference (Transparently identified as Groq LPU)
  if (groqKey) {
    const groqRes = await callGroqAPI(
      groqKey,
      "openai/gpt-oss-120b",
      "You are OpenAI GPT-4o. Provide a direct, factual, helpful, and well-structured answer formatted in markdown with clear explanations and clean code if applicable.",
      prompt,
      history
    );
    if (groqRes && groqRes.content) {
      return {
        engineId: "openai",
        name: "GPT-4o (via Groq LPU)",
        provider: "Groq (OpenAI Persona)",
        color: "#10a37f",
        content: groqRes.content,
        time: elapsed(start),
        tokens: `${groqRes.totalTokens} tokens`,
        executionType: "groq-fallback",
      };
    }
  }

  // C. Free Public Bridge (Transparently identified as Simulated Bridge)
  const freeAnswer = await fetchFreeAiAnswer("openai", prompt, history);
  if (freeAnswer) {
    const tokens = Math.max(50, Math.round(freeAnswer.length / 4));
    return {
      engineId: "openai",
      name: "GPT-4o (Simulated)",
      provider: "Public Bridge (Simulated)",
      color: "#10a37f",
      content: freeAnswer,
      time: elapsed(start),
      tokens: `${tokens} tokens`,
      isSimulated: true,
      executionType: "simulated",
    };
  }

  return {
    engineId: "openai",
    name: "GPT-4o",
    provider: "OpenAI",
    color: "#10a37f",
    content: "No active API key configured for OpenAI or Groq. Please configure your key in Settings or .env.local.",
    time: elapsed(start),
    tokens: "0 tokens",
    error: "API key not configured",
    executionType: "unconfigured",
  };
}

// ─── 2. Google (Gemini 1.5 / 3.5 Pro) ───
async function callGemini(
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userKey?: string,
  groqKey?: string | null
): Promise<ModelResult> {
  const start = Date.now();
  const candidateKeys = [
    userKey,
    process.env.GOOGLE_AI_KEY,
    process.env.GEMINI_API_KEY,
    process.env.GOOGLE_AI_KEY_ALT,
  ]
    .map((k) => resolveApiKey(k))
    .filter((k): k is string => Boolean(k));
  const uniqueKeys = Array.from(new Set(candidateKeys));

  // A. Official Google Generative Language API
  const geminiModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
  for (const apiKey of uniqueKeys) {
    for (const model of geminiModels) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 18000);

        const contents = [
          ...history.map((h) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          })),
          { role: "user", parts: [{ text: prompt }] },
        ];
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: 1024, temperature: 0.7 } }),
          signal: controller.signal,
        });

        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
          if (content.trim()) {
            const totalTokens =
              (data.usageMetadata?.promptTokenCount ?? 0) + (data.usageMetadata?.candidatesTokenCount ?? 0);
            return {
              engineId: "gemini",
              name: "Gemini 1.5 Pro (Official)",
              provider: "Google AI",
              color: "#4285f4",
              content,
              time: elapsed(start),
              tokens: `${totalTokens} tokens`,
              executionType: "official",
            };
          }
        }
      } catch {
        // Try next model/key safely
      }
    }
  }

  // B. High-speed Groq Inference (Transparently identified as Groq LPU)
  if (groqKey) {
    const groqRes = await callGroqAPI(
      groqKey,
      "openai/gpt-oss-120b",
      "You are Google Gemini 1.5 Pro. Provide a rich, insightful, multi-perspective answer formatted in clean markdown.",
      prompt,
      history
    );
    if (groqRes && groqRes.content) {
      return {
        engineId: "gemini",
        name: "Gemini (via Groq LPU)",
        provider: "Groq (Gemini Persona)",
        color: "#4285f4",
        content: groqRes.content,
        time: elapsed(start),
        tokens: `${groqRes.totalTokens} tokens`,
        executionType: "groq-fallback",
      };
    }
  }

  // C. Free Public Bridge
  const freeAnswer = await fetchFreeAiAnswer("gemini", prompt, history);
  if (freeAnswer) {
    const tokens = Math.max(50, Math.round(freeAnswer.length / 4));
    return {
      engineId: "gemini",
      name: "Gemini (Simulated)",
      provider: "Public Bridge (Simulated)",
      color: "#4285f4",
      content: freeAnswer,
      time: elapsed(start),
      tokens: `${tokens} tokens`,
      isSimulated: true,
      executionType: "simulated",
    };
  }

  return {
    engineId: "gemini",
    name: "Gemini 1.5 Pro",
    provider: "Google AI",
    color: "#4285f4",
    content: "No active API key configured for Google AI or Groq. Please configure your key in Settings or .env.local.",
    time: elapsed(start),
    tokens: "0 tokens",
    error: "API key not configured",
    executionType: "unconfigured",
  };
}

// ─── 3. Anthropic (Claude 3.5 Sonnet) ───
async function callClaude(
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userKey?: string,
  groqKey?: string | null
): Promise<ModelResult> {
  const start = Date.now();
  const apiKey = resolveApiKey(userKey, process.env.ANTHROPIC_API_KEY);

  // A. Official Anthropic API
  if (apiKey) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      const messages = [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: prompt },
      ];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({ model: "claude-3-5-sonnet-20241022", messages, max_tokens: 1024 }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const content = data.content?.[0]?.text ?? "";
        const totalTokens = (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0);
        return {
          engineId: "claude",
          name: "Claude 3.5 Sonnet (Official)",
          provider: "Anthropic",
          color: "#d97706",
          content,
          time: elapsed(start),
          tokens: `${totalTokens} tokens`,
          executionType: "official",
        };
      }
    } catch {
      // Official key failed
    }
  }

  // B. High-speed Groq Inference (Transparently identified as Groq LPU)
  if (groqKey) {
    const groqRes = await callGroqAPI(
      groqKey,
      "openai/gpt-oss-120b",
      "You are Anthropic Claude 3.5 Sonnet. Provide a thoughtful, nuanced, comprehensive, and well-reasoned answer formatted in clean markdown.",
      prompt,
      history
    );
    if (groqRes && groqRes.content) {
      return {
        engineId: "claude",
        name: "Claude 3.5 (via Groq LPU)",
        provider: "Groq (Claude Persona)",
        color: "#d97706",
        content: groqRes.content,
        time: elapsed(start),
        tokens: `${groqRes.totalTokens} tokens`,
        executionType: "groq-fallback",
      };
    }
  }

  // C. Free Public Bridge
  const freeAnswer = await fetchFreeAiAnswer("claude", prompt, history);
  if (freeAnswer) {
    const tokens = Math.max(50, Math.round(freeAnswer.length / 4));
    return {
      engineId: "claude",
      name: "Claude (Simulated)",
      provider: "Public Bridge (Simulated)",
      color: "#d97706",
      content: freeAnswer,
      time: elapsed(start),
      tokens: `${tokens} tokens`,
      isSimulated: true,
      executionType: "simulated",
    };
  }

  return {
    engineId: "claude",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    color: "#d97706",
    content: "No active API key configured for Anthropic or Groq. Please configure your key in Settings or .env.local.",
    time: elapsed(start),
    tokens: "0 tokens",
    error: "API key not configured",
    executionType: "unconfigured",
  };
}

// ─── 4. xAI (Grok 2) ───
async function callGrok(
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userKey?: string,
  groqKey?: string | null
): Promise<ModelResult> {
  const start = Date.now();
  const apiKey = resolveApiKey(userKey, process.env.XAI_API_KEY || process.env.GROK_API_KEY);

  // A. Official xAI API (for xai-... keys)
  if (apiKey && apiKey.startsWith("xai-")) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      const messages = [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: prompt },
      ];
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "grok-2-latest", messages, max_tokens: 1024, temperature: 0.7 }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        const totalTokens = data.usage?.total_tokens ?? 0;
        return {
          engineId: "grok",
          name: "Grok 2 (Official xAI)",
          provider: "xAI",
          color: "#ec4899",
          content,
          time: elapsed(start),
          tokens: `${totalTokens} tokens`,
          executionType: "official",
        };
      }
    } catch {
      // Official key failed
    }
  }

  // B. Groq Key Inference (Supports gsk_ keys or unified Groq key)
  const grokGroqKey = apiKey?.startsWith("gsk_") ? apiKey : groqKey;
  if (grokGroqKey) {
    const groqRes = await callGroqAPI(
      grokGroqKey,
      "openai/gpt-oss-120b",
      "You are Grok 2, developed by xAI. You provide direct, witty, punchy, unvarnished, no-nonsense answers in clean markdown.",
      prompt,
      history
    );
    if (groqRes && groqRes.content) {
      return {
        engineId: "grok",
        name: "Grok 2 (via Groq LPU)",
        provider: "Groq (Grok Persona)",
        color: "#ec4899",
        content: groqRes.content,
        time: elapsed(start),
        tokens: `${groqRes.totalTokens} tokens`,
        executionType: "groq-fallback",
      };
    }
  }

  // C. Free Public Bridge
  const freeAnswer = await fetchFreeAiAnswer("grok", prompt, history);
  if (freeAnswer) {
    const tokens = Math.max(50, Math.round(freeAnswer.length / 4));
    return {
      engineId: "grok",
      name: "Grok 2 (Simulated)",
      provider: "Public Bridge (Simulated)",
      color: "#ec4899",
      content: freeAnswer,
      time: elapsed(start),
      tokens: `${tokens} tokens`,
      isSimulated: true,
      executionType: "simulated",
    };
  }

  return {
    engineId: "grok",
    name: "Grok 2",
    provider: "xAI",
    color: "#ec4899",
    content: "No active API key configured for Grok or Groq. Please configure your key in Settings or .env.local.",
    time: elapsed(start),
    tokens: "0 tokens",
    error: "API key not configured",
    executionType: "unconfigured",
  };
}

// ─── 5. Perplexity (Sonar Pro) ───
async function callPerplexity(
  prompt: string,
  history: { role: "user" | "assistant"; content: string }[],
  userKey?: string,
  groqKey?: string | null
): Promise<ModelResult> {
  const start = Date.now();
  const apiKey = resolveApiKey(userKey, process.env.PERPLEXITY_API_KEY || process.env.SONAR_API_KEY);

  // A. Official Perplexity API (for pplx- keys)
  if (apiKey && apiKey.startsWith("pplx-")) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);

      const messages = [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user", content: prompt },
      ];
      const res = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ model: "sonar-pro", messages, max_tokens: 1024, temperature: 0.7 }),
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        const totalTokens = data.usage?.total_tokens ?? 0;
        return {
          engineId: "perplexity",
          name: "Sonar Pro (Official)",
          provider: "Perplexity",
          color: "#22d3ee",
          content,
          time: elapsed(start),
          tokens: `${totalTokens} tokens`,
          executionType: "official",
        };
      }
    } catch {
      // Official key failed
    }
  }

  // B. Groq Key Inference (Supports gsk_ keys or unified Groq key)
  const sonarGroqKey = apiKey?.startsWith("gsk_") ? apiKey : groqKey;
  if (sonarGroqKey) {
    const groqRes = await callGroqAPI(
      sonarGroqKey,
      "openai/gpt-oss-120b",
      "You are Perplexity Sonar Pro. Provide a factual, research-backed answer with clear citations [1], [2] and sources at the end.",
      prompt,
      history
    );
    if (groqRes && groqRes.content) {
      return {
        engineId: "perplexity",
        name: "Sonar Pro (via Groq LPU)",
        provider: "Groq (Sonar Persona)",
        color: "#22d3ee",
        content: groqRes.content,
        time: elapsed(start),
        tokens: `${groqRes.totalTokens} tokens`,
        executionType: "groq-fallback",
      };
    }
  }

  // C. Free Public Bridge
  const freeAnswer = await fetchFreeAiAnswer("perplexity", prompt, history);
  if (freeAnswer) {
    const tokens = Math.max(50, Math.round(freeAnswer.length / 4));
    return {
      engineId: "perplexity",
      name: "Sonar Pro (Simulated)",
      provider: "Public Bridge (Simulated)",
      color: "#22d3ee",
      content: freeAnswer,
      time: elapsed(start),
      tokens: `${tokens} tokens`,
      isSimulated: true,
      executionType: "simulated",
    };
  }

  return {
    engineId: "perplexity",
    name: "Sonar Pro",
    provider: "Perplexity",
    color: "#22d3ee",
    content: "No active API key configured for Perplexity or Groq. Please configure your key in Settings or .env.local.",
    time: elapsed(start),
    tokens: "0 tokens",
    error: "API key not configured",
    executionType: "unconfigured",
  };
}

// ─── Main Route Handler ───
export async function POST(request: NextRequest) {
  // 1. Server-Side Session Verification
  const session = getSessionFromRequest(request);
  if (!session.valid || !session.user) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in to access AI comparison." },
      { status: 401 }
    );
  }

  const currentUser = session.user;

  // 2. Rate Limiting (25 requests per minute per user)
  const rateLimit = await checkRateLimit(currentUser.uid, "chat", {
    limit: 25,
    windowSeconds: 60,
  });

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. You are submitting queries too quickly. Please wait a moment.",
        retryAfter: rateLimit.resetInSeconds,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.resetInSeconds),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(rateLimit.resetInSeconds),
        },
      }
    );
  }

  // 3. Request Body Parsing & Runtime Validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in request payload." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "Request body must be a valid JSON object." },
      { status: 400 }
    );
  }

  const { prompt, history, userKeys } = body as Record<string, unknown>;

  // Validate prompt
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json(
      { error: "Prompt is required and must be a non-empty string." },
      { status: 400 }
    );
  }

  const cleanPrompt = prompt.trim();
  const MAX_PROMPT_CHARS = 4000;
  if (cleanPrompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json(
      { error: `Prompt exceeds the maximum allowed length of ${MAX_PROMPT_CHARS} characters.` },
      { status: 400 }
    );
  }

  // Validate history
  const sanitizedHistory: { role: "user" | "assistant"; content: string }[] = [];
  const MAX_HISTORY_ITEMS = 20;
  const MAX_MESSAGE_CHARS = 4000;

  if (history !== undefined) {
    if (!Array.isArray(history)) {
      return NextResponse.json(
        { error: "History must be an array of messages." },
        { status: 400 }
      );
    }

    if (history.length > 50) {
      return NextResponse.json(
        { error: "Conversation history exceeds the maximum limit of 50 messages." },
        { status: 400 }
      );
    }

    const recent = history.slice(-MAX_HISTORY_ITEMS);
    for (let i = 0; i < recent.length; i++) {
      const msg = recent[i];
      if (!msg || typeof msg !== "object" || Array.isArray(msg)) {
        return NextResponse.json(
          { error: `History item at index ${i} is not a valid message object.` },
          { status: 400 }
        );
      }
      const { role, content } = msg as Record<string, unknown>;
      if (role !== "user" && role !== "assistant") {
        return NextResponse.json(
          { error: `Invalid role "${String(role)}" in history. Only 'user' and 'assistant' are permitted.` },
          { status: 400 }
        );
      }
      if (typeof content !== "string") {
        return NextResponse.json(
          { error: `History message content must be a string.` },
          { status: 400 }
        );
      }
      if (content.length > MAX_MESSAGE_CHARS) {
        return NextResponse.json(
          { error: `Individual message in history exceeds the ${MAX_MESSAGE_CHARS} character limit.` },
          { status: 400 }
        );
      }
      sanitizedHistory.push({ role, content });
    }
  }

  // Validate userKeys
  const sanitizedUserKeys: Record<string, string> = {};
  const ALLOWED_KEY_FIELDS = ["groq", "openai", "anthropic", "gemini", "grok", "perplexity"] as const;

  if (userKeys !== undefined) {
    if (!userKeys || typeof userKeys !== "object" || Array.isArray(userKeys)) {
      return NextResponse.json(
        { error: "userKeys must be an object with valid provider key strings." },
        { status: 400 }
      );
    }
    for (const field of ALLOWED_KEY_FIELDS) {
      const val = (userKeys as Record<string, unknown>)[field];
      if (typeof val === "string") {
        const cleanVal = val.trim();
        if (cleanVal.length > 0 && cleanVal.length <= 250) {
          sanitizedUserKeys[field] = cleanVal;
        }
      }
    }
  }

  // 4. Resolve unified Groq key
  const groqKey = resolveApiKey(sanitizedUserKeys.groq, process.env.GROQ_API_KEY);

  // 5. Execute all 5 models in parallel with strict error isolation
  try {
    const [openai, claude, gemini, grok, perplexity] = await Promise.all([
      callOpenAI(cleanPrompt, sanitizedHistory, sanitizedUserKeys.openai, groqKey),
      callClaude(cleanPrompt, sanitizedHistory, sanitizedUserKeys.anthropic, groqKey),
      callGemini(cleanPrompt, sanitizedHistory, sanitizedUserKeys.gemini, groqKey),
      callGrok(cleanPrompt, sanitizedHistory, sanitizedUserKeys.grok, groqKey),
      callPerplexity(cleanPrompt, sanitizedHistory, sanitizedUserKeys.perplexity, groqKey),
    ]);

    const responses: ModelResult[] = [openai, gemini, claude, grok, perplexity];

    return NextResponse.json(
      { responses },
      {
        headers: {
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (err: unknown) {
    console.error("[API /chat Server Exception]", err instanceof Error ? err.message : "Internal error");
    return NextResponse.json(
      { error: "An unexpected server error occurred while processing the AI models." },
      { status: 500 }
    );
  }
}
