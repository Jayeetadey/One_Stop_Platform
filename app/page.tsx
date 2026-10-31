"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProviderBar from "@/components/landing/ProviderBar";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { isAuthenticated, syncSession } from "@/lib/auth";

function LandingContent() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Open auth modal automatically if URL contains ?auth=signin
    if (searchParams.get("auth") === "signin") {
      setAuthModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check initial auth state & sync with server session cookie
    if (isAuthenticated()) {
      setIsAuth(true);
    }
    syncSession().then((user) => {
      setIsAuth(!!user);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0f131c] text-[#dfe2ee] flex flex-col items-center justify-between selection:bg-[#8083ff]/30 selection:text-white relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#8083ff]/10 via-[#4cd7f6]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 flex flex-col items-center">
        <LandingNav
          onOpenSignIn={() => setAuthModalOpen(true)}
          isAuthenticated={isAuth}
        />
        <HeroSection
          onOpenSignIn={() => setAuthModalOpen(true)}
          isAuthenticated={isAuth}
        />
        <ProviderBar />
        <FeaturesGrid />
        <HowItWorks />
        <CTABanner
          onOpenSignIn={() => setAuthModalOpen(true)}
          isAuthenticated={isAuth}
        />
      </main>

      <Footer />

      {/* Production-Ready 6-Box OTP Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0f131c] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#8083ff]/30 border-t-[#8083ff] rounded-full animate-spin" />
        </div>
      }
    >
      <LandingContent />
    </Suspense>
  );
}
