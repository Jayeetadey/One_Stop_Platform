"use client";

import SimpleChatGPTAuth from "@/components/auth/SimpleChatGPTAuth";

export default function AuthPage() {
  return <SimpleChatGPTAuth onSuccess={() => (window.location.href = "/")} />;
}
