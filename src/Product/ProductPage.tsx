import React, { useState, useEffect } from "react";
import { Maximize, Minimize, ArrowLeft } from "lucide-react";
import HummingbirdProduct from "./HummingbirdProduct";
import "./styles.css";

const guestUser = {
  uid: "guest",
  email: "guest@demo.local",
  displayName: "Guest Student",
  role: "student" as const,
};

export default function ProductPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
      } catch {
        // ignore
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="product-page-root">
      {/* Brand Header Bar */}
      <div className="bg-[#ffffff] border-b border-[#f0ebe4] px-4 md:px-6 py-3 flex items-center justify-between z-10 shrink-0">
        {/* Left: Logo + Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 45" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 10 L48 22.5 L15 35 Z" stroke="#c45a3a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M81 10 L48 22.5 L81 35 Z" stroke="#c45a3a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="28" cy="22.5" r="4" fill="#c45a3a" />
              <circle cx="68" cy="22.5" r="4" fill="#c45a3a" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1 select-none">
            <span className="text-[17px] font-black text-[#1a1612]">Helper</span>
            <span className="text-[15px] font-bold text-[#c45a3a]">Hummingbird</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div className="bg-[#f5f0ea] border border-[#e8e2d9] rounded-full p-0.5 flex items-center w-24 h-9">
            <button
              onClick={() => setLang("en")}
              className={`flex-1 text-center text-[10px] font-black py-1.5 rounded-full transition-all ${
                lang === "en"
                  ? "bg-white text-[#1a1612] shadow-sm"
                  : "text-[#8a8278] hover:text-[#1a1612]"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ar")}
              className={`flex-1 text-center text-[10px] font-black py-1.5 rounded-full transition-all`}
              style={{ fontFamily: "Noto Sans Arabic" }}
            >
              <span className={lang === "ar" ? "text-[#1a1612] font-black" : "text-[#8a8278]"}>عربي</span>
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-[#f5f0ea] border border-[#e8e2d9] hover:bg-[#e8e2d9] flex items-center justify-center text-[#5c554d] hover:text-[#c45a3a] transition shadow-sm"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Back to Helper */}
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[#8a8278] hover:text-[#c45a3a] bg-[#f5f0ea] hover:bg-[#e8e2d9] px-3 py-2 rounded-full transition-all shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Helper</span>
          </a>
        </div>
      </div>

      {/* Hummingbird Product */}
      <div className="product-page-content">
        <HummingbirdProduct
          user={guestUser}
          lang={lang}
          onBackToHome={() => { window.location.href = "/"; }}
          catalogVideos={[]}
        />
      </div>
    </div>
  );
}
