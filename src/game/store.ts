import { create } from "zustand";
import { defaultSave, detectLang, type GameSave, type Lang, type Screen } from "./types";
import { saveGame } from "@/persistence/save";

type Store = GameSave & {
  hydrated: boolean;
  setLang: (l: Lang) => void;
  setScreen: (s: Screen) => void;
  setPlayerPos: (x: number, y: number) => void;
  setVisited: (loc: string) => void;
  villagerAction: (kind: "speak" | "sit" | "river" | "leave") => void;
  nanInChoice: (idx: number) => void;
  nanInTea: () => void;
  reflectionSeen: () => void;
  reflectionDone: () => void;
  startNew: () => void;
  continueGame: () => void;
  hydrate: (s: GameSave) => void;
};

export const useGameStore = create<Store>((set, get) => ({
  ...defaultSave(detectLang()),
  hydrated: false,

  setLang: (lang) => {
    try { localStorage.setItem("keheningan.lang", lang); } catch {}
    try {
      const cur = get();
      const snap: GameSave = { screen: cur.screen, playerPos: cur.playerPos, currentLocation: cur.currentLocation, visited: cur.visited, villager: cur.villager, nanin: cur.nanin, reflection: cur.reflection, lang, updatedAt: new Date().toISOString() };
      saveGame(snap).catch(() => {});
    } catch {}
    set({ lang });
  },
  setScreen: (screen) => {
    set((st) => ({
      screen,
      visited: st.visited.includes(screen) ? st.visited : [...st.visited, screen],
      currentLocation: screen,
    }));
  },
  setPlayerPos: (x, y) => set({ playerPos: { x, y } }),
  setVisited: (loc) => set((s) => ({ visited: s.visited.includes(loc) ? s.visited : [...s.visited, loc] })),

  villagerAction: (kind) => {
    if (kind === "speak") set((s) => ({ villager: { ...s.villager, spoke: true } }));
    if (kind === "sit") set((s) => ({ villager: { ...s.villager, spoke: true, satTogether: true } }));
    if (kind === "river") set((s) => ({ villager: { ...s.villager, spoke: true, askedRiver: true } }));
  },
  nanInChoice: (idx) => set((s) => ({ nanin: { ...s.nanin, met: true, choice: idx } })),
  nanInTea: () => set((s) => ({ nanin: { ...s.nanin, met: true, teaShared: true } })),
  reflectionSeen: () => set((s) => ({ reflection: { ...s.reflection, seen: true } })),
  reflectionDone: () => set((s) => ({ reflection: { ...s.reflection, completed: true } })),

  startNew: () => {
    const lang = get().lang;
    set({ ...defaultSave(lang), hydrated: true, screen: "village" as Screen });
  },
  continueGame: () => {
    const s = get();
    if (s.screen === "home") set({ screen: "village" });
  },
  hydrate: (saved) => set({ ...saved, hydrated: true }),
}));
