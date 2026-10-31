"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatGPTInterface from "@/components/chat/ChatGPTInterface";
import { isAuthenticated, syncSession } from "@/lib/auth";

export default function ComparisonPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    syncSession().then((user) => {
      if (!isMounted) return;
      if (!user && !isAuthenticated()) {
        router.replace("/?auth=signin");
      } else {
        setAuthorized(true);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0f131c] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#8083ff]/30 border-t-[#8083ff] rounded-full animate-spin" />
      </div>
    );
  }

  return <ChatGPTInterface />;
}
