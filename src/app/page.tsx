"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/game/store";
import { ambience } from "@/audio/ambience";
import { dict } from "@/content/i18n";
import type { Lang } from "@/game/types";

function useMutedSync() {
  return useSyncExternalStore(
    (cb) => ambience.subscribeMuted(cb),
    () => ambience.isMuted(),
    () => false,
  );
}

function LangToggle() {
  const lang = useGameStore((s) => s.lang);
  const setLang = useGameStore((s) => s.setLang);
  return (
    <div className="flex items-center gap-1 font-label-sm text-label-sm tracking-wider text-on-surface-variant select-none">
      <button
        onClick={() => setLang("id")}
        className={`transition-colors duration-300 ${lang === "id" ? "text-on-surface font-medium" : "text-on-surface-variant font-light hover:text-on-surface"}`}
        type="button"
      >
        ID
      </button>
      <span className="text-outline-variant font-light">|</span>
      <button
        onClick={() => setLang("en")}
        className={`transition-colors duration-300 ${lang === "en" ? "text-on-surface font-medium" : "text-on-surface-variant font-light hover:text-on-surface"}`}
        type="button"
      >
        EN
      </button>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const lang = useGameStore((s) => s.lang);
  const muted = useMutedSync();
  const [modalOpen, setModalOpen] = useState(false);
  const t = (k: string) => dict[lang][k] ?? dict.id[k] ?? k;

  // hydrate lang from persistence without blocking render (ID → EN must survive refresh and / → /game)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem("keheningan_save_v1");
        if (raw) {
          const s = JSON.parse(raw) as { lang?: string };
          if ((s.lang === "id" || s.lang === "en") && !cancelled && s.lang !== useGameStore.getState().lang) {
            useGameStore.setState({ lang: s.lang as Lang });
            return;
          }
        }
      } catch {}
      try {
        const v = localStorage.getItem("keheningan.lang");
        if ((v === "id" || v === "en") && !cancelled && v !== useGameStore.getState().lang) {
          useGameStore.setState({ lang: v as Lang });
          return;
        }
      } catch {}
      try {
        const { loadSave } = await import("@/persistence/save");
        const saved = await loadSave();
        if (saved && (saved.lang === "id" || saved.lang === "en") && !cancelled && saved.lang !== useGameStore.getState().lang) {
          useGameStore.setState({ lang: saved.lang });
        }
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  useEffect(() => {
    ambience.setScene("landing");
  }, []);

  // lock scroll when modal open
  useEffect(() => {
    if (modalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  // close modal on Escape
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen]);

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md antialiased">
      {/* Header — Stitch exact */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
        <div className="h-20 w-full px-margin-mobile lg:px-margin flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Keheningan" className="h-8 w-auto object-contain" src="/landing/enso.png" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-wide select-none">
              Keheningan <span className="font-headline-sm text-headline-sm text-on-surface-variant font-light">円相</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-space-lg">
            <a className="font-label-md tracking-widest uppercase transition-colors duration-300 bg-surface-container-high text-on-surface rounded-lg px-2 py-1" href="#dunia">{t("landing.navDunia")}</a>
            <a className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md tracking-widest uppercase transition-colors duration-300 px-2 py-1" href="#perjalanan">{t("landing.navPerjalanan")}</a>
            <a className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md tracking-widest uppercase transition-colors duration-300 px-2 py-1" href="#filosofi">{t("landing.navFilosofi")}</a>
          </nav>
          <div className="flex items-center gap-space-md">
            <button
              aria-label={t("landing.soundToggleAria")}
              onClick={() => ambience.toggleMuted()}
              className="hidden sm:flex items-center gap-space-xs px-space-sm py-1.5 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all duration-300"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">{muted ? "volume_off" : "air"}</span>
              <span className="font-label-sm text-label-sm tracking-wide">{muted ? t("landing.pillSilent") : t("landing.pillSound")}</span>
            </button>
            <LangToggle />
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full selection:bg-secondary-fixed selection:text-on-secondary-fixed">
          {/* SECTION 1: HERO */}
          <section className="relative w-full -mt-20 min-h-[92vh] flex flex-col items-center justify-between text-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Pemandangan desa pegunungan berkabut bergaya lukisan sumi-e washi jepang"
                className="w-full h-full object-cover object-center filter saturate-[0.88] brightness-[0.98]"
                src="/landing/hero-landscape.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-surface/70 via-surface/40 to-surface" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-surface/30 to-surface/90" />
            </div>
            <div className="relative z-10 w-full max-w-4xl box-border px-margin-mobile lg:px-margin mx-auto pt-36 lg:pt-44 flex flex-col items-center">
              <div className="relative mb-6 group cursor-default">
                <div className="w-24 h-24 sm:w-28 sm:h-28 relative flex items-center justify-center transition-transform duration-1000 ease-out hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Lambang Ensō Kuas Tinta Hitam"
                    className="w-full h-full object-contain opacity-90 drop-shadow-[0_8px_20px_rgba(22,10,4,0.12)] animate-[pulse_7s_ease-in-out_infinite]"
                    src="/landing/enso.png"
                  />
                </div>
              </div>
              <div className="flex items-center gap-space-sm mb-3 max-w-full flex-wrap justify-center box-border">
                <span className="w-6 h-[1px] bg-outline-variant" />
                <span className="font-label-sm text-label-sm tracking-[0.24em] text-on-surface-variant uppercase text-center break-words">{t("landing.eyebrow")}</span>
                <span className="w-6 h-[1px] bg-outline-variant" />
              </div>
              <h1 className="font-headline-xl-mobile text-headline-xl-mobile sm:font-headline-xl sm:text-headline-xl text-primary tracking-[0.03em] sm:tracking-[0.14em] font-normal mb-1 w-full max-w-full box-border break-words px-2 sm:px-0 text-center">KEHENINGAN</h1>
              <p className="font-headline-sm text-headline-sm text-on-surface-variant tracking-[0.22em] font-light mb-6 w-full max-w-full box-border break-words px-2 sm:px-0 text-center">円 相</p>
              <p className="font-body-lg text-body-lg text-on-surface-variant w-full max-w-xl box-border mx-auto italic mb-10 leading-relaxed font-light break-words px-2 sm:px-0 text-center">
                {t("landing.heroQuote")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-xl mx-auto box-border px-2 sm:px-0">
                <a
                  className="w-full sm:w-auto min-h-[48px] min-w-0 box-border px-8 py-3.5 rounded bg-primary text-on-primary font-label-md text-label-md tracking-[0.18em] uppercase transition-all duration-500 hover:bg-primary-container hover:-translate-y-0.5 shadow-[0_12px_32px_-8px_rgba(36,35,33,0.18)] flex items-center justify-center gap-space-xs"
                  href="#dunia"
                >
                  <span>{t("landing.ctaStart")}</span>
                  <span className="material-symbols-outlined text-[16px]">east</span>
                </a>
                <a
                  className="w-full sm:w-auto min-h-[48px] min-w-0 box-border px-8 py-3.5 rounded bg-surface/70 backdrop-blur-sm text-on-surface font-label-md text-label-md tracking-[0.18em] uppercase transition-all duration-500 hover:bg-surface-container-high hover:text-primary flex items-center justify-center text-center"
                  href="#dunia"
                >{t("landing.ctaSeeWorld")}</a>
              </div>
            </div>
            <div className="relative z-10 pb-10 flex flex-col items-center w-full max-w-full box-border px-4">
              <button
                onClick={() => ambience.toggleMuted()}
                className="inline-flex flex-wrap justify-center items-center max-w-[calc(100vw-2rem)] box-border gap-space-xs px-4 py-2 rounded-full bg-surface-container/70 backdrop-blur-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all duration-300 cursor-pointer text-center"
                type="button"
                aria-label={t("landing.soundBadgeAria")}
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-secondary ${muted ? "" : "animate-ping"}`} />
                <span className="font-label-sm text-label-sm tracking-widest uppercase">{t("landing.soundLabel")}</span>
                <span className="text-outline-variant font-light">·</span>
                <span className="font-label-sm text-label-sm text-outline tracking-wider">{muted ? t("landing.soundOn") : t("landing.soundMute")}</span>
              </button>
              <div className="mt-4 flex flex-col items-center opacity-40">
                <span className="w-[1px] h-8 bg-on-surface animate-bounce" />
              </div>
            </div>
          </section>

          {/* SECTION 2: MA */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center py-12 lg:py-16">
              <span className="font-label-sm text-label-sm tracking-[0.28em] text-on-surface-variant uppercase mb-6 opacity-75">{t("landing.maTag")}</span>
              <blockquote className="font-headline-md text-headline-md text-on-surface font-light leading-relaxed mb-8">
                {t("landing.maQuote")}
              </blockquote>
              <div className="w-12 h-[1px] bg-outline-variant mb-8" />
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto leading-loose">
                {t("landing.maBody")}
              </p>
            </div>
          </section>

          {/* SECTION 3: DUNIA */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface-container-low" id="dunia">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                <div>
                  <span className="font-label-sm text-label-sm tracking-[0.24em] text-secondary uppercase block mb-2">{t("landing.duniaEyebrow")}</span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-normal">{t("landing.duniaTitle")}</h2>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md font-light">
                  {t("landing.duniaDesc")}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-7 bg-surface p-8 lg:p-10 rounded-lg flex flex-col justify-between shadow-[0_12px_32px_-8px_rgba(36,35,33,0.05)] transition-all duration-700 hover:shadow-[0_16px_36px_-6px_rgba(36,35,33,0.08)] group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase px-2 py-1 bg-surface-container rounded">{t("landing.card1Tag")}</span>
                    <span className="font-headline-sm text-headline-sm text-outline-variant font-light">{t("landing.card1Place")}</span>
                  </div>
                  <div className="h-56 lg:h-72 w-full rounded bg-surface-container-high overflow-hidden mb-6 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Gubuk kayu bersahaja tepi sungai desa pegunungan tradisional sumi-e"
                      className="w-full h-full object-cover object-[30%_65%] transition-transform duration-1000 group-hover:scale-105"
                      src="/landing/hero-landscape.jpg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="font-label-sm text-label-sm text-on-surface bg-surface/90 backdrop-blur-md px-3 py-1 rounded">{t("landing.card1Badge")}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-normal">{t("landing.card1Title")}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant font-light leading-relaxed">
                      {t("landing.card1Body")}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-5 bg-surface p-8 lg:p-10 rounded-lg flex flex-col justify-between shadow-[0_12px_32px_-8px_rgba(36,35,33,0.05)] transition-all duration-700 hover:shadow-[0_16px_36px_-6px_rgba(36,35,33,0.08)] group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase px-2 py-1 bg-surface-container rounded">{t("landing.card2Tag")}</span>
                    <span className="font-headline-sm text-headline-sm text-outline-variant font-light">{t("landing.card2Place")}</span>
                  </div>
                  <div className="h-44 lg:h-52 w-full rounded bg-surface-container-high overflow-hidden mb-6 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Bebatuan licin berlumut menyeberangi aliran air jernih sungai pegunungan sumi-e"
                      className="w-full h-full object-cover object-[70%_80%] transition-transform duration-1000 group-hover:scale-105"
                      src="/landing/hero-landscape.jpg"
                    />
                    <div className="absolute inset-0 bg-surface/10" />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-normal">{t("landing.card2Title")}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant font-light leading-relaxed">
                      {t("landing.card2Body")}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-5 bg-surface p-8 lg:p-10 rounded-lg flex flex-col justify-between shadow-[0_12px_32px_-8px_rgba(36,35,33,0.05)] transition-all duration-700 hover:shadow-[0_16px_36px_-6px_rgba(36,35,33,0.08)] group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase px-2 py-1 bg-surface-container rounded">{t("landing.card3Tag")}</span>
                    <span className="font-headline-sm text-headline-sm text-outline-variant font-light">{t("landing.card3Place")}</span>
                  </div>
                  <div className="p-6 rounded bg-surface-container-low mb-6 flex flex-col gap-3">
                    <span className="material-symbols-outlined text-secondary text-3xl">local_cafe</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface italic">{t("landing.card3Quote")}</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">{t("landing.card3QuoteSub")}</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-normal">{t("landing.card3Title")}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant font-light leading-relaxed">
                      {t("landing.card3Body")}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-7 bg-surface p-8 lg:p-10 rounded-lg flex flex-col justify-between shadow-[0_12px_32px_-8px_rgba(36,35,33,0.05)] transition-all duration-700 hover:shadow-[0_16px_36px_-6px_rgba(36,35,33,0.08)] group">
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-label-sm text-label-sm tracking-widest text-on-surface-variant uppercase px-2 py-1 bg-surface-container rounded">{t("landing.card4Tag")}</span>
                    <span className="font-headline-sm text-headline-sm text-outline-variant font-light">{t("landing.card4Place")}</span>
                  </div>
                  <div className="h-44 lg:h-52 w-full rounded bg-surface-container-high overflow-hidden mb-6 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Jalan setapak tanah basah diiringi pohon willow dan rumput liar di pedesaan fajar"
                      className="w-full h-full object-cover object-[20%_60%] transition-transform duration-1000 group-hover:scale-105"
                      src="/landing/hero-landscape.jpg"
                    />
                    <div className="absolute inset-0 bg-surface/20" />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2 font-normal">{t("landing.card4Title")}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant font-light leading-relaxed">
                      {t("landing.card4Body")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: PERJALANAN */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface" id="perjalanan">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <span className="font-label-sm text-label-sm tracking-[0.24em] text-secondary uppercase block mb-3">{t("landing.ritualTag")}</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface font-normal mb-4">{t("landing.ritualTitle")}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant font-light max-w-xl mx-auto">
                  {t("landing.ritualDesc")}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                <div className="bg-surface-container-low p-6 rounded flex flex-col items-center text-center transition-all duration-300 hover:bg-surface-container">
                  <span className="font-headline-lg text-headline-lg text-primary mb-2 opacity-80">{t("landing.stepWalkKanji")}</span>
                  <span className="font-label-md text-label-md tracking-[0.16em] uppercase text-on-surface font-semibold mb-2">{t("landing.stepWalkTitle")}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-light leading-relaxed">{t("landing.stepWalkBody")}</p>
                </div>
                <div className="bg-surface-container-low p-6 rounded flex flex-col items-center text-center transition-all duration-300 hover:bg-surface-container">
                  <span className="font-headline-lg text-headline-lg text-primary mb-2 opacity-80">{t("landing.stepMeetKanji")}</span>
                  <span className="font-label-md text-label-md tracking-[0.16em] uppercase text-on-surface font-semibold mb-2">{t("landing.stepMeetTitle")}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-light leading-relaxed">{t("landing.stepMeetBody")}</p>
                </div>
                <div className="bg-surface-container-low p-6 rounded flex flex-col items-center text-center transition-all duration-300 hover:bg-surface-container">
                  <span className="font-headline-lg text-headline-lg text-primary mb-2 opacity-80">{t("landing.stepHearKanji")}</span>
                  <span className="font-label-md text-label-md tracking-[0.16em] uppercase text-on-surface font-semibold mb-2">{t("landing.stepHearTitle")}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-light leading-relaxed">{t("landing.stepHearBody")}</p>
                </div>
                <div className="bg-surface-container-low p-6 rounded flex flex-col items-center text-center transition-all duration-300 hover:bg-surface-container">
                  <span className="font-headline-lg text-headline-lg text-primary mb-2 opacity-80">{t("landing.stepStopKanji")}</span>
                  <span className="font-label-md text-label-md tracking-[0.16em] uppercase text-on-surface font-semibold mb-2">{t("landing.stepStopTitle")}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-light leading-relaxed">{t("landing.stepStopBody")}</p>
                </div>
                <div className="bg-surface-container-low p-6 rounded flex flex-col items-center text-center transition-all duration-300 hover:bg-surface-container">
                  <span className="font-headline-lg text-headline-lg text-primary mb-2 opacity-80">{t("landing.stepSeeKanji")}</span>
                  <span className="font-label-md text-label-md tracking-[0.16em] uppercase text-on-surface font-semibold mb-2">{t("landing.stepSeeTitle")}</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant font-light leading-relaxed">{t("landing.stepSeeBody")}</p>
                </div>
              </div>
              <div className="mt-14 p-6 bg-surface-container rounded-lg flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-xl">self_improvement</span>
                  </div>
                  <div>
                    <h4 className="font-headline-sm text-headline-sm text-on-surface font-normal">{t("landing.breathTitle")}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{t("landing.breathDesc")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{t("landing.breathIn")}</span>
                  <div className="w-32 sm:w-48 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-1/2 animate-[pulse_4s_ease-in-out_infinite]" />
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">{t("landing.breathOut")}</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 5: FILOSOFI */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface-container-low relative overflow-hidden" id="filosofi">
            <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
              <div className="w-56 h-56 sm:w-72 sm:h-72 relative flex items-center justify-center mb-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Lingkaran Ensō Kuas Tinta Hitam Zen Simbol Ketaksempurnaan"
                  className="w-full h-full object-contain filter contrast-125 opacity-85 transition-transform duration-1000 hover:rotate-12"
                  src="/landing/enso.png"
                />
              </div>
              <span className="font-headline-sm text-headline-sm text-primary tracking-[0.24em] font-light mb-3">円 相</span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface font-normal mb-6">{t("landing.ensoQuote")}</h3>
              <div className="max-w-2xl text-on-surface-variant font-body-lg text-body-lg leading-loose font-light space-y-4">
                <p>
                  {t("landing.ensoP1")}
                </p>
                <p className="text-body-md font-body-md text-on-surface-variant/90">
                  {t("landing.ensoP2")}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-space-sm mt-10">
                <div className="px-4 py-2 bg-surface rounded text-on-surface-variant font-label-sm text-label-sm tracking-widest uppercase shadow-sm">{t("landing.wabi")}</div>
                <div className="px-4 py-2 bg-surface rounded text-on-surface-variant font-label-sm text-label-sm tracking-widest uppercase shadow-sm">{t("landing.yugen")}</div>
                <div className="px-4 py-2 bg-surface rounded text-on-surface-variant font-label-sm text-label-sm tracking-widest uppercase shadow-sm">{t("landing.mu")}</div>
              </div>
            </div>
          </section>

          {/* SECTION 6: INVITATION */}
          <section className="w-full py-space-xl px-margin-mobile lg:px-margin bg-surface text-center">
            <div className="max-w-3xl mx-auto py-10 flex flex-col items-center">
              <span className="font-label-sm text-label-sm tracking-[0.28em] text-secondary uppercase mb-4">{t("landing.inviteTag")}</span>
              <h2 className="font-headline-xl text-headline-xl text-primary font-normal mb-6">{t("landing.inviteTitle")}</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant font-light max-w-lg mx-auto mb-10 leading-relaxed">
                {t("landing.inviteBody")}
              </p>
              <div className="flex flex-col items-center gap-space-md w-full max-w-sm">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full py-4 px-8 rounded bg-primary text-on-primary font-label-md text-label-md tracking-[0.2em] uppercase transition-all duration-500 hover:bg-primary-container hover:-translate-y-1 shadow-[0_16px_36px_-6px_rgba(36,35,33,0.2)] flex items-center justify-center gap-space-xs group"
                  type="button"
                >
                  <span>{t("landing.inviteCta")}</span>
                  <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1">explore</span>
                </button>
                <p className="font-body-sm text-body-sm text-outline tracking-wide">{t("landing.inviteHint")}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 w-full border-t-0">
                <div className="flex flex-col items-center gap-1.5 p-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">wifi_off</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">{t("landing.featOfflineTitle")}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">{t("landing.featOfflineBody")}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">save</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">{t("landing.featSavedTitle")}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">{t("landing.featSavedBody")}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">no_accounts</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">{t("landing.featNoAccountTitle")}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">{t("landing.featNoAccountBody")}</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">translate</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-medium uppercase tracking-wider">{t("landing.featBilingualTitle")}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">{t("landing.featBilingualBody")}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="w-full bg-surface-container-low py-space-xl">
        <div className="w-full px-margin-mobile lg:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-sm">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-wide">
              Keheningan <span className="text-on-surface-variant font-light">円相</span>
            </span>
            <span className="hidden md:inline text-outline-variant">·</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant italic">{t("landing.footerTagline")}</span>
          </div>
          <div className="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant tracking-widest uppercase">
            <span>{t("landing.footerRight")}</span>
          </div>
        </div>
      </footer>

      {/* Journey modal — Stitch exact visual */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4 transition-opacity duration-500 ${modalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModalOpen(false);
        }}
        role="dialog"
        aria-modal="true"
        aria-label={t("landing.modalAria")}
      >
        <div className={`bg-surface p-8 sm:p-10 rounded-lg max-w-md w-full shadow-[0_24px_48px_rgba(22,10,4,0.18)] transition-transform duration-500 text-center flex flex-col items-center ${modalOpen ? "scale-100" : "scale-95"}`}>
          <div className="w-16 h-16 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="Ensō" className="w-full h-full object-contain" src="/landing/enso.png" />
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface font-normal mb-2">{t("landing.modalTitle")}</h3>
          <p className="font-body-md text-body-md text-on-surface-variant font-light mb-8 leading-relaxed">
            {t("landing.modalBody")}
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={() => router.push("/game")}
              className="w-full py-3 bg-primary text-on-primary rounded font-label-md text-label-md uppercase tracking-widest transition hover:bg-primary-container"
              type="button"
            >{t("landing.modalEnter")}</button>
            <button
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider hover:text-on-surface transition"
              type="button"
            >{t("landing.modalBack")}</button>
          </div>
        </div>
      </div>

      <style>{`html{scroll-behavior:smooth}
      @media (prefers-reduced-motion: reduce) { html{scroll-behavior:auto} }`}</style>
    </div>
  );
}
