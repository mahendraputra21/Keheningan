"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { useGameStore } from "@/game/store";
import { useAutosave } from "@/hooks/useAutosave";
import { t } from "@/content/i18n";
import { clearSave } from "@/persistence/save";
import { ambience } from "@/audio/ambience";

function useMutedSync() {
  return useSyncExternalStore(
    (cb) => ambience.subscribeMuted(cb),
    () => ambience.isMuted(),
    () => false,
  );
}

/* ---------- Shared header pills — Stitch exact ---------- */
function LangPillHeader() {
  const lang = useGameStore((s) => s.lang);
  const setLang = useGameStore((s) => s.setLang);
  return (
    <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-full text-on-surface">
      <button
        aria-label="Pilih Bahasa Indonesia"
        onClick={() => setLang("id")}
        className={`font-label-sm text-label-sm px-1.5 py-0.5 tracking-widest transition-colors ${lang === "id" ? "text-primary font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-[1px] after:bg-primary" : "text-on-surface-variant/60 hover:text-on-surface"}`}
        type="button"
      >
        ID
      </button>
      <span className="font-label-sm text-label-sm text-outline-variant px-0.5 select-none">|</span>
      <button
        aria-label="Switch to English"
        onClick={() => setLang("en")}
        className={`font-label-sm text-label-sm px-1.5 py-0.5 tracking-widest transition-colors ${lang === "en" ? "text-primary font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-[1px] after:bg-primary" : "text-on-surface-variant/60 hover:text-on-surface"}`}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
function LangPillHome() {
  const lang = useGameStore((s) => s.lang);
  const setLang = useGameStore((s) => s.setLang);
  const toggle = () => setLang(lang === "id" ? "en" : "id");
  return (
    <button
      aria-label="Ganti Bahasa / Switch Language"
      onClick={toggle}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container/70 backdrop-blur-md shadow-sm active:scale-95 transition-all text-on-surface"
      type="button"
    >
      <span className={`font-label-sm text-label-sm tracking-widest transition-colors ${lang === "id" ? "font-semibold text-primary" : "font-light text-on-surface-variant"}`}>ID</span>
      <span className="text-outline-variant font-light text-label-sm">/</span>
      <span className={`font-label-sm text-label-sm tracking-widest transition-colors ${lang === "en" ? "font-semibold text-primary" : "font-light text-on-surface-variant"}`}>EN</span>
    </button>
  );
}
function AppHeader({ title, showBack, onBack }: { title: string; showBack?: boolean; onBack?: () => void }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_12px_rgba(36,35,33,0.03)]">
      <div className="h-16 px-margin-mobile flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          {showBack ? (
            <button aria-label="Kembali perlahan" onClick={onBack} className="min-w-[44px] min-h-[44px] -ml-2 flex items-center justify-center text-primary active:opacity-60 transition-opacity" type="button">
              <span className="material-symbols-outlined text-[22px]">arrow_back</span>
            </button>
          ) : null}
          {/* Stitch brand: original was lh3 logo — offline use enso + text per exact composition */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Keheningan" className="h-7 w-auto object-contain hidden sm:block" src="/enzo.png" />
          <span className="font-headline-sm text-headline-sm tracking-wide text-primary leading-none">{title}</span>
        </div>
        <div className="flex items-center gap-space-sm">
          <LangPillHeader />
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
function BottomNav({ active }: { active: "village" | "nanin" | "reflection" }) {
  const setScreen = useGameStore((s) => s.setScreen);
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/85 backdrop-blur-xl shadow-[0_-4px_20px_rgba(36,35,33,0.03)]">
      <div className="flex justify-between items-center h-14 px-margin-mobile">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
          <span className="font-label-sm text-label-sm text-on-surface-variant tracking-widest lowercase">hening • offline ready</span>
        </div>
        <div className="flex items-center gap-space-xs">
          <button onClick={() => setScreen("village")} aria-label="Desa" className={`flex items-center justify-center min-w-[44px] min-h-[44px] px-2 transition-colors tracking-widest ${active === "village" ? "text-primary opacity-100 font-medium" : "text-on-surface-variant/60 hover:text-on-surface font-label-sm text-label-sm"}`}>
            <span className={`w-2 h-2 rounded-full border inline-block ${active === "village" ? "border-primary bg-primary" : "border-on-surface-variant/40"}`} />
          </button>
          <button onClick={() => setScreen("nanin")} aria-label="Guru Nan In" className={`flex items-center justify-center min-w-[44px] min-h-[44px] px-2 transition-colors font-label-sm text-label-sm tracking-widest ${active === "nanin" ? "text-primary opacity-100 font-medium" : "text-on-surface-variant/60 hover:text-on-surface"}`}>
            <span className={`w-2 h-2 rounded-full border inline-block ${active === "nanin" ? "border-primary bg-primary" : "border-on-surface-variant/40"}`} />
          </button>
          <button onClick={() => setScreen("reflection")} aria-label="Sungai Refleksi" className={`flex items-center justify-center min-w-[44px] min-h-[44px] px-2 transition-colors font-label-sm text-label-sm tracking-widest ${active === "reflection" ? "text-primary opacity-100 font-medium" : "text-on-surface-variant/60 hover:text-on-surface"}`}>
            <span className={`w-2 h-2 rounded-full border inline-block ${active === "reflection" ? "border-primary bg-primary" : "border-on-surface-variant/40"}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ---------- Home — Stitch screen_1 exact ---------- */
function HomeScreen() {
  const lang = useGameStore((s) => s.lang);
  const screen = useGameStore((s) => s.screen);
  const visited = useGameStore((s) => s.visited);
  const startNew = useGameStore((s) => s.startNew);
  const continueGame = useGameStore((s) => s.continueGame);
  const [confirm, setConfirm] = useState(false);
  const muted = useMutedSync();
  const hasSave = visited.length > 0 || screen !== "home";
  const doContinue = () => continueGame();
  const doNew = () => { clearSave().then(() => startNew()); };
  useEffect(() => { ambience.setScene("home"); }, []);
  return (
    <main className="flex-1 flex flex-col relative w-full pt-safe pb-safe bg-surface">
      <div className="flex flex-col w-full relative overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="w-full h-full bg-cover bg-center opacity-85 transition-opacity duration-1000 scale-[1.03]" style={{ backgroundImage: "url('/stitch/screen_1_wash.jpg')" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-surface/40 to-surface/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent" />
          <div className="absolute inset-0 bg-surface/20 backdrop-blur-[0.5px]" />
        </div>
        <div className="flex flex-col justify-between w-full px-margin-mobile py-space-md min-h-[780px] max-w-md mx-auto relative z-10" style={{ minHeight: "calc(100dvh - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px))" }}>
          <header className="flex items-center justify-between w-full pt-1">
            <LangPillHome />
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-tertiary-container/10 font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase">無為</span>
              <button aria-label="Heningkan Audio / Mute Atmosphere" onClick={() => ambience.toggleMuted()} className={`w-9 h-9 rounded-full bg-surface-container/70 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm transition-all active:scale-90 ${muted ? "opacity-60" : ""}`} type="button">
                <span className="material-symbols-outlined text-[18px]">{muted ? "volume_off" : "volume_down"}</span>
              </button>
            </div>
          </header>
          <div className="flex flex-col items-center justify-center text-center my-auto py-space-md">
            <div className="relative w-36 h-36 flex items-center justify-center mb-space-sm group">
              <div className="absolute inset-0 rounded-full bg-secondary-container/20 blur-xl animate-pulse" />
              <Image alt="Ensō Zen Circle Brush Stroke" className="relative w-32 h-32 object-contain drop-shadow-sm transition-transform duration-[4000ms] ease-in-out group-hover:scale-105" src="/enzo.png" width={128} height={128} priority />
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile tracking-[0.28em] text-primary uppercase pl-2 mb-1.5">Keheningan</h1>
            <p className="font-body-md text-body-md text-on-surface-variant italic max-w-xs">{t(lang, "subtitle")}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-[1px] w-6 bg-outline-variant/40" />
              <span className="font-label-sm text-label-sm text-outline tracking-[0.2em] uppercase">{t(lang, "chapter")}</span>
              <span className="h-[1px] w-6 bg-outline-variant/40" />
            </div>
          </div>
          <div className="flex flex-col w-full gap-space-sm mb-2">
            {hasSave ? (
              <div className="flex flex-col w-full gap-2">
                <button onClick={doContinue} className="group w-full py-3.5 px-space-md rounded-lg bg-primary-container text-on-primary shadow-md active:translate-y-[1px] hover:opacity-90 flex items-center justify-between transition-all" type="button">
                  <div className="flex flex-col text-left">
                    <span className="font-label-md text-label-md tracking-[0.16em] uppercase text-surface">{t(lang, "continue")}</span>
                    <span className="font-body-sm text-body-sm text-on-primary-container font-light line-clamp-1">{lang === "id" ? "Tepi Aliran Seserahan • 24m lalu" : "Whispering Stream • moments ago"}</span>
                  </div>
                  <span className="material-symbols-outlined text-surface transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>
                <button onClick={() => setConfirm(true)} className="w-full py-3 px-space-md rounded-lg bg-surface-container-high/80 backdrop-blur-sm text-on-surface shadow-sm active:scale-[0.99] hover:bg-surface-container flex items-center justify-center transition-all" type="button">
                  <span className="font-label-md text-label-md tracking-[0.18em] uppercase text-on-surface">{t(lang, "restart")}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2">
                <button onClick={doNew} className="w-full py-3 px-space-md rounded-lg bg-primary-container text-on-primary shadow-md active:translate-y-[1px] hover:opacity-90 flex items-center justify-center transition-all" type="button">
                  <span className="font-label-md text-label-md tracking-[0.18em] uppercase text-surface">{t(lang, "start")}</span>
                </button>
                <p className="text-center font-body-sm text-body-sm text-outline/80 scale-95">{t(lang, "savedHint")}</p>
              </div>
            )}
            <div className="flex flex-col items-center justify-center pt-1 text-center">
              {hasSave ? (
                <button onClick={() => setConfirm(true)} className="font-label-sm text-label-sm tracking-widest text-on-surface-variant/80 hover:text-primary transition-colors py-1 inline-flex items-center gap-1 group" type="button">
                  <span>{lang === "id" ? "MULAI DARI AWAL" : "NEW JOURNEY"}</span>
                  <span className="material-symbols-outlined text-[14px] text-outline group-hover:text-primary transition-colors">refresh</span>
                </button>
              ) : null}
              {hasSave ? <span className="font-body-sm text-body-sm text-outline/80 scale-95">{lang === "id" ? "Mulai dari awal & reset kemajuan lokal" : "Begin anew & reset local progress"}</span> : null}
            </div>
          </div>
          <footer className="flex flex-col items-center text-center gap-1.5 pt-2">
            <div className="inline-flex items-center gap-1.5 text-on-surface-variant/75">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm tracking-wider">{t(lang, "savedHint")}</span>
            </div>
            <p className="font-body-sm text-body-sm text-outline italic">円相 • {lang === "id" ? "Tidak ada yang perlu dicapai di sini" : "Nothing to achieve here"}</p>
          </footer>
        </div>
      </div>
      {confirm && (
        <div className="fixed inset-0 z-50 bg-inverse-surface/30 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-[340px] rounded-xl bg-surface p-6 shadow-xl border border-surface-variant text-center">
            <p className="font-headline-sm text-headline-sm text-primary">{t(lang, "restartConfirm")}</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirm(false)} className="flex-1 rounded-lg border border-outline-variant py-2.5 font-label-sm text-label-sm tracking-widest text-on-surface-variant">{t(lang, "cancel")}</button>
              <button onClick={() => { setConfirm(false); doNew(); }} className="flex-1 rounded-lg bg-primary py-2.5 font-label-sm text-label-sm tracking-widest text-on-primary">{t(lang, "confirm")}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------- Village — Stitch screen_2 exact + game wiring ---------- */
function VillageScreen() {
  const lang = useGameStore((s) => s.lang);
  const playerPos = useGameStore((s) => s.playerPos);
  const setPlayerPos = useGameStore((s) => s.setPlayerPos);
  const setScreen = useGameStore((s) => s.setScreen);
  const villagerAction = useGameStore((s) => s.villagerAction);
  const muted = useMutedSync();
  const [moving, setMoving] = useState(false);
  const [narrativeKey, setNarrativeKey] = useState<"default" | "talk" | "sit" | "observe">("default");

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const nx = Math.min(0.92, Math.max(0.08, x));
    const ny = Math.min(0.86, Math.max(0.18, y));
    setMoving(true);
    setPlayerPos(nx, ny);
    setTimeout(() => setMoving(false), 420);
  };
  // Hotspots aligned to Stitch canvas positions (single coordinate space)
  const dist = (ax: number, ay: number) => Math.hypot(playerPos.x - ax, playerPos.y - ay);
  const nearVillager = dist(0.84, 0.62) < 0.18;
  const nearStone = dist(0.44, 0.72) < 0.16;
  // river proximity: gradual 0..1 based on distance to stepping stone (river)
  const riverMix = Math.max(0, Math.min(1, 1 - dist(0.44, 0.72) / 0.38));
  useEffect(() => { ambience.setVillageRiverMix(riverMix); }, [riverMix]);

  const narratives: Record<string, string> = {
    id: {
      default: "Langkah pelan. Gemericik air sungai jernih membasahi bebatuan bulat. Di seberang aliran, asap tipis membubung lembut dari serambi kayu Guru Nan In.",
      talk: "“Air mengalir tanpa tergesa, anak muda. Bila hatimu tenang, cangkir teh yang kosong akan segera terisi.” — bisik Pak Tua sambil tersenyum.",
      sit: "Engkau hening sejenak di tepi batu. Desau angin di daun willow mengendapkan segala riak pikiran yang resah.",
      observe: "Permukaan air memantulkan puncak bukit yang diselimuti kabut halus. Di kejauhan, lentera kayu di teras gubuk telah dinyalakan.",
    } as unknown as string,
    en: {
      default: "Slow steps. The clear mountain stream murmurs over smooth stones. Beyond the water, gentle smoke drifts from Master Nan In's porch.",
      talk: "“Water flows without haste, wanderer. When the mind settles, the empty teacup is ready.” — whispers the Elder softly.",
      sit: "You rest in silence on the damp stone. Willow wind settles every restless ripple of thought.",
      observe: "The water mirrors mist-clad hilltops. Far away, a wooden lantern glows on the hut veranda.",
    } as unknown as string,
  };
  const narrativeText = (narratives[lang] as unknown as Record<string, string>)[narrativeKey] ?? (narratives[lang] as unknown as Record<string, string>).default;

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      <AppHeader title="Keheningan" />
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 bg-surface">
        <div className="flex flex-col w-full relative select-none">
          {/* Painting viewport — Stitch exact 620px */}
          <div onClick={handleTap} className="relative w-full h-[620px] overflow-hidden bg-surface-container-low shadow-[0_12px_32px_-8px_rgba(36,35,33,0.06)] cursor-pointer" id="painting-viewport">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Desa Lembah Embun" className="absolute inset-0 w-full h-full object-cover object-[32%_center] transition-transform duration-1000 ease-out" src="/stitch/village_landscape.png" onError={(e) => { (e.target as HTMLImageElement).src = "/stitch/screen_2_village_exploration_mobile__screen.png"; }} />
            <div className="absolute inset-0 bg-gradient-to-b from-surface/40 via-transparent to-surface/90 pointer-events-none" />
            <div className="absolute inset-0 bg-surface/10 mix-blend-multiply pointer-events-none" />
            <div className="absolute top-4 inset-x-margin-mobile flex items-center justify-between z-20 pointer-events-auto">
              <div className="flex items-center gap-space-xs bg-surface/85 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">{t(lang, "locVillage")}</span>
              </div>
              <button aria-label="Pengaturan Suara Hening" onClick={(e) => { e.stopPropagation(); ambience.toggleMuted(); }} className={`w-8 h-8 rounded-lg bg-surface/85 backdrop-blur-md text-primary flex items-center justify-center shadow-sm transition-opacity ${muted ? "opacity-50" : "hover:opacity-80"}`} type="button">
                <span className="material-symbols-outlined text-[18px]">{muted ? "volume_off" : "volume_down"}</span>
              </button>
            </div>
            <div className="absolute top-[38%] left-[28%] z-10 pointer-events-none flex flex-col items-center opacity-85">
              <div className="w-1.5 h-1.5 rounded-full bg-surface-variant animate-ping" />
              <span className="font-label-sm text-label-sm text-on-surface-variant/80 tracking-widest mt-1 bg-surface/75 px-1.5 py-0.5 rounded-sm backdrop-blur-xs">{lang === "id" ? "Asap Teh Nan In" : "Nan In's Tea Smoke"}</span>
            </div>
            {nearVillager && (
              <div className="absolute top-[62%] right-[16%] z-20">
                <button onClick={(e) => { e.stopPropagation(); setScreen("villager"); }} className="group flex items-center gap-1.5 bg-surface/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-primary shadow-sm hover:bg-surface transition-all animate-[fadeIn_300ms_ease]" type="button">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse scale-110" />
                  <span className="font-label-sm text-label-sm text-primary font-medium tracking-widest">{lang === "id" ? "Pak Tua • Duduk" : "Elder • Sit"}</span>
                </button>
              </div>
            )}
            {nearStone && (
              <div className="absolute bottom-[28%] left-[44%] z-20">
                <button onClick={(e) => { e.stopPropagation(); setScreen("reflection"); }} className="flex items-center gap-1.5 bg-surface/90 backdrop-blur-md px-2 py-1 rounded-lg text-on-surface hover:bg-surface transition-all shadow-sm animate-[fadeIn_300ms_ease]" type="button">
                  <span className="material-symbols-outlined text-[14px] text-secondary">water_drop</span>
                  <span className="font-label-sm text-label-sm tracking-widest">{lang === "id" ? "Batu Pijakan" : "Stepping Stone"}</span>
                </button>
              </div>
            )}
            <div className="absolute bottom-[16%] z-20 flex flex-col items-center pointer-events-none" style={{ left: `calc(${playerPos.x * 100}% - 24px)` }} id="player-anchor">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-60" />
                <span className={`w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center backdrop-blur-xs transition-transform ${moving ? "scale-110" : ""}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-xs" />
                </span>
              </div>
              <div className="mt-1 bg-surface/90 px-2 py-0.5 rounded-sm backdrop-blur-md shadow-xs">
                <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">{lang === "id" ? "Pengelana" : "Traveler"}</span>
              </div>
            </div>
            <div className="absolute inset-0 pointer-events-none z-[5]" id="ink-ripple-slot" />
            <div className="absolute bottom-4 left-margin-mobile z-20 pointer-events-none">
              <p className="font-label-sm text-label-sm text-on-surface-variant/75 tracking-widest flex items-center gap-1.5 bg-surface/70 px-2 py-1 rounded-lg backdrop-blur-xs">
                <span className="material-symbols-outlined text-[14px]">touch_app</span>
                {t(lang, "tapHint")}
              </p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setScreen("nanin"); }} className="absolute top-0 left-[18%] right-[18%] h-[34%] z-10" aria-label="Nan In engawa" type="button" />
          </div>
          {/* Washi Drawer Panel — Stitch exact (action ribbon + story card) */}
          <div className="px-margin-mobile pt-space-md pb-space-lg flex flex-col gap-space-sm bg-surface">
            <div className="flex items-center gap-2 overflow-x-auto pb-1" id="action-ribbon">
              {nearVillager ? (
                <>
                  <button onClick={() => { setNarrativeKey("talk"); villagerAction("speak"); setScreen("villager"); }} className="px-3 py-1.5 rounded-lg bg-primary text-surface flex items-center gap-1.5 transition-colors shadow-xs shrink-0" type="button">
                    <span className="material-symbols-outlined text-[16px]">chat_bubble_outline</span>
                    <span className="font-label-sm text-label-sm tracking-widest uppercase font-medium">{t(lang, "talkVillager")}</span>
                  </button>
                  <span className="font-label-sm text-label-sm text-on-surface-variant/60 tracking-widest whitespace-nowrap ml-1">{lang === "id" ? "· dekat Pak Tua" : "· near Elder"}</span>
                </>
              ) : nearStone ? (
                <>
                  <button onClick={() => setScreen("reflection")} className="px-3 py-1.5 rounded-lg bg-primary text-surface flex items-center gap-1.5 transition-colors shadow-xs shrink-0" type="button">
                    <span className="material-symbols-outlined text-[16px]">water_drop</span>
                    <span className="font-label-sm text-label-sm tracking-widest uppercase font-medium">{lang === "id" ? "Batu Pijakan" : "Stepping Stone"}</span>
                  </button>
                  <span className="font-label-sm text-label-sm text-on-surface-variant/60 tracking-widest whitespace-nowrap ml-1">{lang === "id" ? "· renungkan aliran" : "· contemplate"}</span>
                </>
              ) : (
                <>
                  <button onClick={() => { setNarrativeKey("sit"); villagerAction("sit"); }} className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary flex items-center gap-1.5 transition-colors shadow-xs shrink-0" type="button">
                    <span className="material-symbols-outlined text-[16px] text-secondary">self_improvement</span>
                    <span className="font-label-sm text-label-sm tracking-widest uppercase font-medium">{t(lang, "sitStream")}</span>
                  </button>
                  <button onClick={() => setNarrativeKey("observe")} className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary flex items-center gap-1.5 transition-colors shadow-xs shrink-0" type="button">
                    <span className="material-symbols-outlined text-[16px] text-secondary">visibility</span>
                    <span className="font-label-sm text-label-sm tracking-widest uppercase font-medium">{lang === "id" ? "Lihat" : "Observe"}</span>
                  </button>
                  <div className="h-4 w-[1px] bg-outline-variant/30 mx-1 shrink-0" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant/70 tracking-widest whitespace-nowrap">{lang === "id" ? "Nafas Tenang" : "Gentle Breath"}</span>
                </>
              )}
            </div>
            <div className="bg-surface-container p-space-md rounded-xl flex flex-col gap-space-sm shadow-[0_12px_32px_-8px_rgba(36,35,33,0.06)]" id="story-card">
              <div className="flex items-center gap-space-xs text-secondary">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm uppercase tracking-widest">{lang === "id" ? "Catatan Jalan" : "Wayfarer's Note"}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-relaxed">{narrativeText}</p>
              <button onClick={() => setScreen("nanin")} className="mt-1 w-full bg-primary-container text-on-primary py-3 px-4 rounded-lg flex items-center justify-between hover:opacity-90 transition-opacity">
                <span className="font-label-md text-label-md tracking-widest font-medium">{t(lang, "visitNanIn")}</span>
                <span className="material-symbols-outlined text-[18px]">east</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <BottomNav active="village" />
    </div>
  );
}

/* ---------- Villager — Stitch screen_3 exact ---------- */
function VillagerScreen() {
  const lang = useGameStore((s) => s.lang);
  const villager = useGameStore((s) => s.villager);
  const villagerAction = useGameStore((s) => s.villagerAction);
  const setScreen = useGameStore((s) => s.setScreen);
  const [replyKey, setReplyKey] = useState<"sit" | "river" | null>(null);
  const muted = useMutedSync();
  useEffect(() => { ambience.setScene("river"); }, []);
  const doAction = (k: "sit" | "river") => {
    villagerAction(k === "sit" ? "sit" : "river");
    setReplyKey(k);
  };
  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      <AppHeader title="Villager Interaction" showBack onBack={() => setScreen("village")} />
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
        <div className="flex flex-col w-full relative overflow-hidden select-none">
          <div className="relative w-full h-[330px] overflow-hidden">
            <div className="w-full h-full bg-cover bg-center scale-[1.02]" style={{ backgroundImage: "url('/stitch/village_landscape.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-surface" />
            <div className="absolute inset-0 bg-surface/20 backdrop-blur-[1px]" />
            <div className="absolute top-4 left-margin-mobile flex items-center gap-space-xs z-10">
              <span className="px-2.5 py-1 rounded bg-surface/90 backdrop-blur-md text-secondary font-label-sm text-label-sm shadow-sm tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                {lang === "id" ? "Tepi Sungai • Suara Air Tenang" : "Riverbank • Murmuring Waters"}
              </span>
            </div>
            <div className="absolute top-4 right-margin-mobile z-10">
              <button aria-label="Heningkan Audio / Mute Atmosphere" onClick={() => ambience.toggleMuted()} className={`w-9 h-9 rounded-full bg-surface/90 backdrop-blur-md text-primary flex items-center justify-center shadow-sm active:scale-95 transition-all ${muted ? "opacity-50" : ""}`} type="button">
                <span className={`material-symbols-outlined text-[19px] transition-all ${muted ? "text-on-surface-variant/40" : "text-secondary"}`}>{muted ? "volume_off" : "water_drop"}</span>
              </button>
            </div>
            <div className="absolute -bottom-2 inset-x-0 flex justify-center items-end pointer-events-none">
              <div className="relative w-44 h-48 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full text-outline-variant/30 animate-[spin_60s_linear_infinite]" fill="none" stroke="currentColor" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="44" strokeDasharray="190 70" strokeLinecap="round" strokeWidth="1.5" />
                </svg>
                <div className="relative w-36 h-36 rounded-full overflow-hidden bg-surface-container-low shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover object-top opacity-95" alt="Pak Tua Penjaga Air" src="/stitch/screen_3_portrait_clean.jpg" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
                </div>
                <div className="absolute bottom-2 right-6 px-1.5 py-0.5 rounded bg-surface/95 shadow-sm text-on-surface-variant font-label-sm text-label-sm tracking-wider">侘寂</div>
              </div>
            </div>
          </div>
          <div className="relative z-20 px-margin-mobile py-space-md flex flex-col gap-space-md bg-surface">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm tracking-[0.18em] text-secondary uppercase">{t(lang, "villagerRole")}</span>
              <h2 className="font-headline-sm text-headline-sm text-primary tracking-wide">{t(lang, "villagerName")}</h2>
            </div>
            <div className="flex flex-col gap-3 pl-3 border-l-2 border-surface-variant/60">
              <p className="font-headline-sm text-headline-sm text-primary leading-relaxed italic">{t(lang, "villagerQuote")}</p>
              <p className="font-body-md text-body-md text-on-surface-variant/70 leading-relaxed">{t(lang, "villagerNarration")}</p>
            </div>
            {replyKey && (
              <div id="contemplation-reply" className="rounded-xl bg-surface-container-low border border-surface-variant px-4 py-3 font-body-md text-body-md text-primary leading-relaxed animate-[fadeIn_400ms_ease]">
                {replyKey === "sit" ? t(lang, "replySit") : t(lang, "replyRiver")}
              </div>
            )}
            <div className="flex flex-col gap-2">
              <button onClick={() => doAction("sit")} className={`w-full group text-left px-4 py-3 rounded-lg flex items-center justify-between shadow-sm transition-all ${villager.satTogether ? "bg-primary border border-primary text-surface" : "bg-surface-container hover:bg-surface-variant/70 text-primary border border-transparent active:scale-[0.99]"}`} type="button">
                <span className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-label-sm ${villager.satTogether ? "bg-surface/20 text-surface" : "bg-secondary-container/70 text-on-secondary-container"}`}>一</span>
                  <span className={`font-body-md text-body-md tracking-wide ${villager.satTogether ? "text-surface" : "text-primary"}`}>{t(lang, "choiceSit")}</span>
                </span>
                <span className={`material-symbols-outlined text-[18px] ${villager.satTogether ? "text-surface" : "text-outline group-hover:text-primary"}`}>{villager.satTogether ? "check" : "self_improvement"}</span>
              </button>
              <button onClick={() => doAction("river")} className={`w-full group text-left px-4 py-3 rounded-lg flex items-center justify-between shadow-sm transition-all ${villager.askedRiver ? "bg-primary border border-primary text-surface" : "bg-surface-container hover:bg-surface-variant/70 text-primary border border-transparent active:scale-[0.99]"}`} type="button">
                <span className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-label-sm ${villager.askedRiver ? "bg-surface/20 text-surface" : "bg-secondary-container/70 text-on-secondary-container"}`}>二</span>
                  <span className={`font-body-md text-body-md tracking-wide ${villager.askedRiver ? "text-surface" : "text-primary"}`}>{t(lang, "choiceRiver")}</span>
                </span>
                <span className={`material-symbols-outlined text-[18px] ${villager.askedRiver ? "text-surface" : "text-outline group-hover:text-primary"}`}>{villager.askedRiver ? "check" : "waves"}</span>
              </button>
              <button onClick={() => setScreen("village")} className="w-full group text-left px-4 py-3 rounded-lg bg-surface-container hover:bg-surface-variant/70 active:scale-[0.99] transition-all flex items-center justify-between shadow-sm border border-transparent" type="button">
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-surface-dim text-on-surface-variant flex items-center justify-center text-[12px] font-label-sm">三</span>
                  <span className="font-body-md text-body-md text-on-surface-variant font-light tracking-wide">{t(lang, "choiceLeave")}</span>
                </span>
                <span className="material-symbols-outlined text-outline-variant text-[18px] group-hover:text-primary">north_east</span>
              </button>
            </div>
            <div className="w-full mt-1 flex items-center justify-center gap-2 px-3 py-2 rounded bg-surface-container-high/40">
              <span className="font-headline-sm text-headline-sm text-secondary font-normal">侘</span>
              <span className="font-label-sm text-label-sm text-outline-variant select-none">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider">{lang === "id" ? "Keindahan dalam kesederhanaan bersahaja" : "Wabi — Finding peace in humble simplicity"}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Nan In — Stitch screen_4 exact ---------- */
function NanInScreen() {
  const lang = useGameStore((s) => s.lang);
  const nanin = useGameStore((s) => s.nanin);
  const nanInChoice = useGameStore((s) => s.nanInChoice);
  const nanInTea = useGameStore((s) => s.nanInTea);
  const setScreen = useGameStore((s) => s.setScreen);
  useEffect(() => { ambience.setScene("nanin"); }, []);
  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      <AppHeader title="Nan In Zen Dialogue" showBack onBack={() => setScreen("village")} />
      <main className="flex-1 flex flex-col relative w-full pt-16 bg-surface">
        <div className="flex flex-col w-full pb-safe">
          <div className="relative w-full aspect-[4/3] max-h-72 overflow-hidden bg-surface-container-high">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="w-full h-full object-cover object-center saturate-[0.85] contrast-[0.95]" alt="Nan In engawa" src="/stitch/screen_4_engawa.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
            <div className="absolute top-4 left-margin-mobile flex flex-col items-start gap-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface/75 backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm tracking-widest text-primary uppercase">{t(lang, "locNanin")}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant/80 pl-0.5 backdrop-blur-sm">{t(lang, "ambientNanin")}</p>
            </div>
            <div className="absolute bottom-3 right-margin-mobile flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container/80 backdrop-blur-md">
              <span className="material-symbols-outlined text-[14px] text-secondary animate-pulse">air</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider">{lang === "id" ? "Uap Teh Menyatu" : "Tea Steam Ascending"}</span>
            </div>
          </div>
          <div className="px-margin-mobile -mt-4 relative z-10 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary-container flex items-center justify-center text-on-primary">
                  <span className="font-headline-sm text-headline-sm text-[12px] leading-none">南</span>
                </div>
                <span className="font-label-md text-label-md tracking-widest uppercase text-primary font-medium">{t(lang, "naninName")}</span>
              </div>
              <div className="flex items-center gap-1 opacity-60">
                <span className="material-symbols-outlined text-[13px] text-secondary">check_circle</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{t(lang, "savedQuiet")}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 pl-3 bg-gradient-to-r from-surface-variant/50 to-transparent rounded-lg py-3">
              <p className="font-body-md text-body-md text-on-surface-variant/70 italic leading-relaxed">{t(lang, "naninD1")}</p>
              <p className="font-body-md text-body-md text-on-surface-variant/40 tracking-widest">· · ·</p>
              <p className="font-body-md text-body-md text-on-surface-variant/80 italic leading-relaxed">{t(lang, "naninD2")}</p>
              <div className="pt-2">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-wide leading-tight">{t(lang, "theQuestion")}</h2>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              {[0, 1, 2].map((i) => {
                const selected = nanin.choice === i;
                return (
                  <button key={i} onClick={() => nanInChoice(i)} className={`text-left rounded-xl border px-4 py-3.5 flex flex-col gap-1 transition-all ${selected ? "bg-primary border-primary shadow-sm selected" : "bg-surface-container-low border-surface-variant hover:bg-surface-container"} group`} type="button">
                    <span className="flex items-start justify-between gap-3 w-full">
                      <span className="flex flex-col gap-1 flex-1">
                        <span className={`font-headline-sm text-headline-sm ${selected ? "text-surface" : "text-primary"}`}>{t(lang, `opt${i + 1}`)}</span>
                        <span className={`font-body-sm text-body-sm leading-relaxed ${selected ? "text-surface/70" : "text-on-surface-variant/70"}`}>{t(lang, `opt${i + 1}Sub`)}</span>
                      </span>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 shrink-0 transition-colors ${selected ? "bg-surface" : "bg-surface-container-high group-[.selected]:bg-primary"}`}>
                        <span className={`w-2 h-2 rounded-full ${selected ? "bg-primary opacity-100" : "bg-on-primary opacity-0 group-[.selected]:opacity-100"} transition-opacity`} />
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            {nanin.choice !== null && (
              <div className="rounded-xl bg-surface-container-low border border-surface-variant p-4 flex flex-col items-center text-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[28px]">local_cafe</span>
                <p className="font-body-md text-body-md text-on-surface leading-relaxed max-w-xs">{nanin.teaShared ? t(lang, "teaDone") : lang === "id" ? "Uap mengepul pelan. Cangkir masih setengah kosong — ruang untukmu." : "Steam rises slowly. The cup half empty — room for you."}</p>
                {!nanin.teaShared ? (
                  <button onClick={() => nanInTea()} className="mt-2 rounded-full bg-primary text-on-primary px-6 py-2.5 font-label-md text-label-md tracking-[0.14em] uppercase shadow-sm active:scale-[0.98] transition-transform flex items-center gap-2" type="button">
                    <span className="material-symbols-outlined text-[16px] text-secondary-fixed">water_drop</span>
                    {t(lang, "pourTea")} <span>🍵</span>
                  </button>
                ) : (
                  <span className="font-label-sm text-label-sm tracking-widest text-secondary uppercase">{lang === "id" ? "— Teh telah dituang —" : "— Tea poured —"}</span>
                )}
                <div className="flex gap-2 pt-2 flex-wrap justify-center">
                  <button onClick={() => setScreen("reflection")} className="rounded-full bg-primary text-on-primary border border-primary px-4 py-2 font-label-sm text-label-sm tracking-widest">→ {t(lang, "reflectionTag")}</button>
                  <button onClick={() => setScreen("village")} className="rounded-full bg-surface border border-outline-variant/30 px-4 py-2 font-label-sm text-label-sm tracking-widest text-primary">{t(lang, "returnVillage")}</button>
                </div>
              </div>
            )}
            {nanin.choice === null && (
              <button onClick={() => setScreen("village")} className="self-center font-label-sm text-label-sm tracking-widest text-on-surface-variant/60 hover:text-on-surface py-2" type="button">← {t(lang, "back")}</button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- Reflection — Stitch screen_5 exact ---------- */
function ReflectionScreen() {
  const lang = useGameStore((s) => s.lang);
  const setScreen = useGameStore((s) => s.setScreen);
  const reflectionSeen = useGameStore((s) => s.reflectionSeen);
  const reflectionDone = useGameStore((s) => s.reflectionDone);
  const [breathingIn, setBreathingIn] = useState(true);
  useEffect(() => { ambience.setScene("reflection"); }, []);
  useEffect(() => { reflectionSeen(); }, [reflectionSeen]);
  useEffect(() => {
    const id = setInterval(() => setBreathingIn((v) => !v), 3200);
    return () => clearInterval(id);
  }, []);
  const advance = () => { reflectionDone(); setScreen("village"); };
  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      <AppHeader title="Keheningan" />
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 bg-surface">
        <div className="flex flex-col w-full relative select-none overflow-hidden cursor-pointer" id="reflection-viewport" onClick={(e) => { if (!(e.target as HTMLElement).closest("button") && !(e.target as HTMLElement).closest("a")) advance(); }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg className="absolute -top-20 -left-20 w-96 h-96 opacity-35 blur-2xl text-secondary-container" fill="currentColor" viewBox="0 0 200 200"><path d="M42.7,-68.8C54.8,-60.4,63.7,-47.9,70.1,-34.2C76.5,-20.5,80.4,-5.6,78.2,8.6C76,22.8,67.6,36.4,57.1,47.8C46.6,59.3,34,68.7,19.6,73.4C5.2,78.1,-11,78.2,-25.7,73.1C-40.4,68,-53.7,57.7,-63.9,44.7C-74.1,31.7,-81.2,15.8,-80.6,0.3C-80,-15.2,-71.7,-30.4,-61,-42.6C-50.3,-54.9,-37.2,-64.1,-23.5,-70.6C-9.8,-77,4.6,-80.7,18.8,-77.8C33,-74.9,30.6,-77.2,42.7,-68.8Z" transform="translate(100 100)" /></svg>
            <svg className="absolute bottom-10 -right-24 w-[380px] h-[380px] opacity-25 blur-3xl text-surface-variant" fill="currentColor" viewBox="0 0 200 200"><path d="M44.5,-61.2C57.4,-53.1,67.5,-40.3,73.2,-25.6C78.9,-10.9,80.2,5.7,75.9,20.8C71.5,35.9,61.4,49.4,48.2,58.8C35,68.1,18.7,73.3,1.6,71.1C-15.5,68.9,-30.9,59.3,-44.6,48.3C-58.3,37.3,-70.2,24.8,-74.5,9.6C-78.7,-5.6,-75.3,-23.4,-66.4,-37.6C-57.5,-51.7,-43.1,-62.1,-28.4,-68.7C-13.7,-75.2,1.3,-77.9,15.9,-75.6C30.5,-73.3,31.6,-69.3,44.5,-61.2Z" transform="translate(100 100)" /></svg>
            <div className="absolute inset-x-0 top-1/3 h-44 bg-gradient-to-b from-transparent via-secondary-fixed/20 to-transparent opacity-60" />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-between px-margin-mobile py-space-lg min-w-0" style={{ minHeight: "calc(100vh - 8.5rem)" }}>
            <div className="flex flex-col items-center gap-space-xs text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container rounded-lg shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase">{t(lang, "reflectionTag")}</span>
              </div>
              <span className="font-label-sm text-label-sm tracking-widest text-outline uppercase opacity-75">Babak V • Sungai Hening</span>
            </div>
            <div className="relative flex flex-col items-center justify-center my-space-md w-full max-w-xs">
              <div className="relative w-56 h-56 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-secondary-fixed-dim/30 blur-xl transition-all duration-1000 scale-95 opacity-50" />
                <Image alt="Ensō circle — breath" className="relative w-48 h-48 object-contain select-none pointer-events-none drop-shadow-sm transition-transform duration-[4000ms] ease-in-out" src="/enzo.png" width={192} height={192} priority style={{ transform: breathingIn ? "scale(1.02)" : "scale(0.96)" }} />
                <div className="absolute w-2 h-2 rounded-full bg-primary/20 pointer-events-none" />
              </div>
              <div className="mt-space-sm flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-outline opacity-40" />
                <p className="font-label-sm text-label-sm tracking-widest text-on-surface-variant/80 italic text-center">{breathingIn ? t(lang, "breatheIn") : t(lang, "breatheOut")}</p>
                <span className="w-1 h-1 rounded-full bg-outline opacity-40" />
              </div>
            </div>
            <div className="relative w-full max-w-md bg-surface-container-low/90 backdrop-blur-md rounded-xl p-space-md shadow-sm flex flex-col items-center text-center">
              <div className="w-6 h-0.5 bg-outline-variant rounded-full mb-space-sm opacity-60" />
              <blockquote className="flex flex-col items-center gap-space-sm">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-wide font-normal">{t(lang, "reflectionQuote")}</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xs leading-relaxed">{t(lang, "reflectionSub")}</p>
                <span className="font-body-sm text-body-sm text-outline italic">— {t(lang, "reflectionAuthor")} —</span>
              </blockquote>
              <button onClick={advance} className="mt-space-md w-full rounded-lg bg-primary text-on-primary py-3 px-space-md font-label-md text-label-md tracking-[0.16em] uppercase shadow-sm active:scale-[0.99] transition-transform flex items-center justify-center gap-2" type="button">
                <span>{t(lang, "reflectionAction")}</span>
                <span className="material-symbols-outlined text-[16px] opacity-80">east</span>
              </button>
              <span className="font-body-sm text-body-sm text-outline/70 mt-2">{t(lang, "reflectionHint")}</span>
            </div>
          </div>
        </div>
      </main>
      <BottomNav active="reflection" />
    </div>
  );
}

export default function Page() {
  const hydrated = useGameStore((s) => s.hydrated);
  const screen = useGameStore((s) => s.screen);
  const lang = useGameStore((s) => s.lang);
  useAutosave();
  useEffect(() => { if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {}); }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  if (!hydrated) return <div className="min-h-[100dvh] bg-surface flex items-center justify-center font-label-sm text-label-sm tracking-widest text-outline">memuat…</div>;
  if (screen === "home") return <HomeScreen />;
  if (screen === "village") return <VillageScreen />;
  if (screen === "villager") return <VillagerScreen />;
  if (screen === "nanin") return <NanInScreen />;
  if (screen === "reflection") return <ReflectionScreen />;
  return <HomeScreen />;
}
