import { useEffect, useState } from "react";
import { Maximize, Minimize, WifiOff } from "lucide-react";
import HummingbirdWorkspace from "./components/HummingbirdWorkspace";
import { catalogVideos } from "./data/catalog";
import { isDemoMode } from "./mockApi";

const guestUser = {
  uid: "guest",
  email: "guest@demo.local",
  displayName: "Guest Student",
  role: "student" as const,
};

export default function Product({ onBackToHome }: { onBackToHome?: () => void } = {}) {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    setDemoMode(isDemoMode.active);
  }, []);

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
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="h-[100dvh] w-full bg-[#faf8f5] overflow-hidden">
      <HummingbirdWorkspace
        user={guestUser}
        lang={lang}
        onLangChange={setLang}
        onBackToHome={onBackToHome || (() => window.scrollTo({ top: 0, behavior: "smooth" }))}
        catalogVideos={catalogVideos}
      />

      {demoMode && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[3000] flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a1612]/85 text-white text-[10px] font-black tracking-wide shadow-lg backdrop-blur select-none">
          <WifiOff className="w-3 h-3 text-[#e07a5f]" />
          <span>{lang === "ar" ? "وضع تجريبي دون اتصال" : "DEMO MODE · OFFLINE"}</span>
        </div>
      )}

      <button
        onClick={toggleFullscreen}
        className="fixed bottom-4 right-4 rtl:right-auto rtl:left-4 z-[3000] w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-[#e8e2d9] shadow-lg flex items-center justify-center text-[#5c554d] hover:text-[#c45a3a] hover:bg-white transition active:scale-95"
        title={
          isFullscreen
            ? lang === "ar"
              ? "الخروج من وضع ملء الشاشة"
              : "Exit fullscreen"
            : lang === "ar"
            ? "ملء الشاشة"
            : "Enter fullscreen"
        }
      >
        {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
      </button>
    </div>
  );
}
