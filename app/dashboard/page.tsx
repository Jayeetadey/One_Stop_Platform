import ChatGPTInterface from "@/components/chat/ChatGPTInterface";

export const metadata = {
  title: "OneStop — 5 Frontier AI Models in One Simple Chat",
  description: "Simple ChatGPT-style interface querying GPT-4o, Claude 3.5, Gemini 1.5, Grok 2, and Sonar Pro simultaneously.",
};

export default function DashboardPage() {
  return <ChatGPTInterface />;
}
