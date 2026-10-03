"use client";
import { useGameStore } from "@/game/store";

export function LanguageToggle() {
  const lang = useGameStore((s) => s.lang);
  const setLang = useGameStore((s) => s.setLang);
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur-md shadow-sm px-2 py-1 text-[11px] tracking-[0.16em] font-medium">
      <button
        onClick={() => setLang("id")}
        className={`px-1.5 py-0.5 rounded-full transition-colors ${lang === "id" ? "text-[#0e0d0c] bg-[#F1EEE5]" : "text-[#494740]/60 hover:text-[#1c1c17]"}`}
      >
        ID
      </button>
      <span className="text-[#CAC6BD] select-none">|</span>
      <button
        onClick={() => setLang("en")}
        className={`px-1.5 py-0.5 rounded-full transition-colors ${lang === "en" ? "text-[#0e0d0c] bg-[#F1EEE5]" : "text-[#494740]/60 hover:text-[#1c1c17]"}`}
      >
        EN
      </button>
    </div>
  );
}
