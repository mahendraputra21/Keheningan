// ponytail: HTMLAudio + optional WebAudio Gain for fades; single manager avoids duplicates/offline cache via sw.js
type Scene = "home" | "landing" | "village" | "river" | "nanin" | "reflection";

type Targets = Record<"forest" | "daytime" | "river" | "bamboo", number>;

const SRC: Record<keyof Targets | "birds", string> = {
  forest: "/audio/forest-wind-and-birds.mp3",
  daytime: "/audio/daytime.mp3",
  river: "/audio/river-zen-flow.mp3",
  bamboo: "/audio/wind-bamboo-blowing.mp3",
  birds: "/audio/bird-singing.mp3",
};

// conservative: nature first, no music asset
const SCENE_TARGETS: Record<Scene, Targets> = {
  home:       { forest: 0.04, daytime: 0.02, river: 0,    bamboo: 0    }, // almost silent before gesture
  landing:    { forest: 0.07, daytime: 0.02, river: 0.03, bamboo: 0    }, // breathing before village: forest + subtle river
  village:    { forest: 0.18, daytime: 0.08, river: 0,    bamboo: 0    }, // forest primary, daytime soft layer
  river:      { forest: 0.07, daytime: 0.03, river: 0.26, bamboo: 0    }, // river dominant, forest very soft
  nanin:      { forest: 0.05, daytime: 0,    river: 0,    bamboo: 0.18 }, // bamboo quiet, forest subtle, birds reduced
  reflection: { forest: 0.02, daytime: 0,    river: 0.06, bamboo: 0.05 }, // substantially quieter; silence is part
};

// bird one-shot volume per scene (0 = disabled)
const BIRD_VOL: Record<Scene, number> = {
  home: 0,
  landing: 0.05,
  village: 0.14,
  river: 0.10,
  nanin: 0.035,
  reflection: 0,
};

class AmbienceManager {
  private els = new Map<string, HTMLAudioElement>();
  private gains = new Map<string, GainNode>();
  private ctx: AudioContext | null = null;
  private scene: Scene = "home";
  private riverMix = 0; // 0..1 when village blends to river
  private muted = false;
  private unlocked = false;
  private initialized = false;
  private fadeRaf: number | null = null;
  private birdTimer: number | null = null;
  private birdEl: HTMLAudioElement | null = null;
  private mutedListeners = new Set<(v: boolean) => void>();

  private get storageKey() { return "keheningan:muted"; }

  subscribeMuted(fn: (v: boolean) => void) {
    this.mutedListeners.add(fn);
    return () => this.mutedListeners.delete(fn);
  }
  private emitMuted() { for (const fn of this.mutedListeners) try { fn(this.muted); } catch {} }

  init() {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.muted = raw === "1";
    } catch {}
    // create loop els (no autoplay until unlock)
    for (const k of ["forest", "daytime", "river", "bamboo"] as const) {
      const a = new Audio(SRC[k]);
      a.loop = true;
      a.preload = "auto";
      a.crossOrigin = "anonymous";
      a.volume = 0;
      // @ts-ignore keep reference to allow GC check
      a.dataset.amb = k;
      this.els.set(k, a);
    }
    const b = new Audio(SRC.birds);
    b.loop = false;
    b.preload = "auto";
    b.volume = 0;
    this.birdEl = b;

    // try WebAudio for smoother ramps
    try {
      const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      if (Ctx) {
        this.ctx = new Ctx();
        if (this.ctx.state === "suspended") { /* resume on unlock */ }
        for (const k of ["forest", "daytime", "river", "bamboo"] as const) {
          const el = this.els.get(k)!;
          try {
            const src = this.ctx.createMediaElementSource(el);
            const g = this.ctx.createGain();
            g.gain.value = 0;
            src.connect(g).connect(this.ctx.destination);
            this.gains.set(k, g);
          } catch {
            // MediaElementSource may fail if already connected; ignore
          }
        }
      }
    } catch {}

    // unlock on first gesture
    const unlock = () => this.unlock();
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("touchstart", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    // also listen for visibility
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.pauseBird();
      else if (this.unlocked && !this.muted) this.scheduleBird();
    });
    window.addEventListener("pagehide", () => this.dispose());
  }

  isMuted() { return this.muted; }

  setMuted(v: boolean) {
    this.muted = v;
    try { localStorage.setItem(this.storageKey, v ? "1" : "0"); } catch {}
    this.emitMuted();
    if (v) {
      this.fadeToZero(1200);
      this.pauseBird();
    } else {
      if (!this.unlocked) this.unlock();
      else {
        this.applyScene(this.scene, this.riverMix);
        this.scheduleBird();
      }
    }
  }

  toggleMuted() { this.setMuted(!this.muted); return this.muted; }

  private async unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    try { if (this.ctx && this.ctx.state === "suspended") await this.ctx.resume(); } catch {}
    // start loops muted then fade to current scene
    for (const el of this.els.values()) {
      try {
        // must play after gesture; catch autoplay rejection
        const p = el.play();
        if (p && typeof (p as Promise<void>).catch === "function") (p as Promise<void>).catch(() => {});
      } catch {}
    }
    if (this.muted) {
      this.setVolumesImmediate({ forest:0, daytime:0, river:0, bamboo:0 });
    } else {
      this.applyScene(this.scene, this.riverMix);
      this.scheduleBird();
    }
  }

  setScene(scene: Scene, riverMix = 0) {
    this.init();
    this.scene = scene;
    this.riverMix = Math.max(0, Math.min(1, riverMix));
    if (!this.unlocked) {
      // still set volumes to 0 until gesture; ensure els exist
      return;
    }
    if (this.muted) return;
    this.applyScene(scene, this.riverMix);
    this.scheduleBird();
  }

  // village helper: 0 = village, 1 = river
  setVillageRiverMix(mix: number) {
    const t = Math.max(0, Math.min(1, mix));
    this.init();
    this.scene = "village";
    this.riverMix = t;
    if (!this.unlocked || this.muted) return;
    const v = SCENE_TARGETS.village;
    const r = SCENE_TARGETS.river;
    const targets: Targets = {
      forest: v.forest * (1 - t) + r.forest * t,
      daytime: v.daytime * (1 - t) + r.daytime * t,
      river: v.river * (1 - t) + r.river * t,
      bamboo: 0,
    };
    const dur = t > 0.5 ? 2800 : 2200;
    this.fadeTo(targets, dur);
    this.scheduleBirdForMix(t);
  }

  private applyScene(scene: Scene, mix: number) {
    // village with river blend is handled via setVillageRiverMix directly; avoid recursion
    if (scene === "village" && mix > 0) {
      const t = Math.max(0, Math.min(1, mix));
      const v = SCENE_TARGETS.village;
      const r = SCENE_TARGETS.river;
      const targets: Targets = {
        forest: v.forest * (1 - t) + r.forest * t,
        daytime: v.daytime * (1 - t) + r.daytime * t,
        river: v.river * (1 - t) + r.river * t,
        bamboo: 0,
      };
      const dur = t > 0.5 ? 2800 : 2200;
      this.fadeTo(targets, dur);
      this.scheduleBirdForMix(t);
      return;
    }
    const targets = SCENE_TARGETS[scene];
    const dur = scene === "reflection" ? 3500 : scene === "home" ? 1800 : 2600;
    this.fadeTo(targets, dur);
  }

  private fadeTo(targets: Targets, durationMs: number) {
    if (this.muted) {
      this.fadeToZero(durationMs);
      return;
    }
    // cancel prior
    if (this.fadeRaf !== null) {
      cancelAnimationFrame(this.fadeRaf);
      this.fadeRaf = null;
    }
    const start = performance.now();
    const starts = new Map<string, number>();
    for (const k of Object.keys(targets) as (keyof Targets)[]) {
      starts.set(k, this.readVol(k));
    }
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 2); // easeOut
      for (const k of Object.keys(targets) as (keyof Targets)[]) {
        const s = starts.get(k) ?? 0;
        const t = targets[k];
        this.writeVol(k, s + (t - s) * eased);
      }
      if (p < 1) this.fadeRaf = requestAnimationFrame(step);
      else this.fadeRaf = null;
    };
    this.fadeRaf = requestAnimationFrame(step);
  }

  private fadeToZero(dur: number) {
    const zeros: Targets = { forest:0, daytime:0, river:0, bamboo:0 };
    if (this.fadeRaf !== null) { cancelAnimationFrame(this.fadeRaf); this.fadeRaf = null; }
    const start = performance.now();
    const starts = new Map<string, number>();
    for (const k of Object.keys(zeros) as (keyof Targets)[]) starts.set(k, this.readVol(k));
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 2);
      for (const k of Object.keys(zeros) as (keyof Targets)[]) {
        const s = starts.get(k) ?? 0;
        this.writeVol(k, s * (1 - eased));
      }
      if (p < 1) this.fadeRaf = requestAnimationFrame(step);
      else {
        this.fadeRaf = null;
        // pause loops to save battery but keep unlocked
        for (const el of this.els.values()) { try { el.pause(); } catch {} }
      }
    };
    this.fadeRaf = requestAnimationFrame(step);
  }

  private readVol(k: keyof Targets): number {
    const g = this.gains.get(k);
    if (g) return g.gain.value;
    const el = this.els.get(k);
    return el ? el.volume : 0;
  }

  private writeVol(k: keyof Targets, v: number) {
    const clamped = Math.max(0, Math.min(1, v));
    const g = this.gains.get(k);
    const el = this.els.get(k);
    if (g) {
      try { g.gain.setValueAtTime(clamped, this.ctx ? this.ctx.currentTime : 0); } catch { g.gain.value = clamped; }
      // keep element nominally at 1 when using gain path
      if (el && el.volume !== 1) el.volume = 1;
      // ensure playing
      if (el && el.paused && clamped > 0.001 && this.unlocked && !this.muted) {
        const p = el.play();
        if (p && typeof (p as Promise<void>).catch === "function") (p as Promise<void>).catch(() => {});
      }
    } else if (el) {
      el.volume = clamped;
      if (el.paused && clamped > 0.001 && this.unlocked && !this.muted) {
        const p = el.play();
        if (p && typeof (p as Promise<void>).catch === "function") (p as Promise<void>).catch(() => {});
      }
    }
  }

  private setVolumesImmediate(t: Targets) {
    for (const k of Object.keys(t) as (keyof Targets)[]) this.writeVol(k, t[k]);
  }

  private pauseBird() {
    if (this.birdTimer !== null) { window.clearTimeout(this.birdTimer); this.birdTimer = null; }
  }

  private scheduleBird() {
    this.pauseBird();
    const vol = BIRD_VOL[this.scene];
    if (vol <= 0 || this.muted || !this.unlocked) return;
    // village mixes river: reduce birds slightly when riverMix high
    const riverFactor = this.scene === "village" ? this.riverMix : 0;
    const adjVol = vol * (1 - riverFactor * 0.25);
    // intervals: village 18-35s, river 25-45s, nanin 40-70s
    let min = 18000, max = 35000;
    if (this.scene === "landing") { min = 40000; max = 60000; }
    else if (this.scene === "river") { min = 25000; max = 45000; }
    else if (this.scene === "nanin") { min = 40000; max = 70000; }
    else if (this.scene === "reflection" || this.scene === "home") return;
    const delay = min + Math.random() * (max - min);
    this.birdTimer = window.setTimeout(() => this.playBird(adjVol), delay);
  }

  // when village blends to river, reschedule with adjusted timing
  private scheduleBirdForMix(mix: number) {
    this.pauseBird();
    if (this.muted || !this.unlocked) return;
    const base = BIRD_VOL.village * (1 - mix * 0.25) + BIRD_VOL.river * mix * 0.5;
    if (base <= 0.01) return;
    const min = 20000 + mix * 8000;
    const max = 35000 + mix * 10000;
    const delay = min + Math.random() * (max - min);
    this.birdTimer = window.setTimeout(() => this.playBird(base), delay);
  }

  private async playBird(vol: number) {
    if (!this.birdEl || this.muted || vol <= 0) { this.scheduleBird(); return; }
    try {
      this.birdEl.currentTime = 0;
      this.birdEl.volume = Math.max(0, Math.min(1, vol));
      const p = this.birdEl.play();
      if (p && typeof (p as Promise<void>).catch === "function") await (p as Promise<void>).catch(() => {});
      const dur = isFinite(this.birdEl.duration) && this.birdEl.duration > 0 ? this.birdEl.duration * 1000 : 4000;
      window.setTimeout(() => this.scheduleBird(), dur + 800);
    } catch {
      this.scheduleBird();
    }
  }

  dispose() {
    this.pauseBird();
    if (this.fadeRaf !== null) { cancelAnimationFrame(this.fadeRaf); this.fadeRaf = null; }
    for (const el of this.els.values()) { try { el.pause(); el.src = ""; } catch {} }
    if (this.birdEl) try { this.birdEl.pause(); } catch {}
    try { if (this.ctx) this.ctx.close(); } catch {}
  }
}

export const ambience = new AmbienceManager();
export type { Scene };
