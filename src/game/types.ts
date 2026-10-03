export type Lang = "id" | "en";
export type Screen = "home" | "village" | "villager" | "nanin" | "reflection";

export interface VillagerState {
  spoke: boolean;
  satTogether: boolean;
  askedRiver: boolean;
}
export interface NanInState {
  met: boolean;
  choice: number | null; // 0,1,2
  teaShared: boolean;
}
export interface ReflectionState {
  seen: boolean;
  completed: boolean;
}

export interface GameSave {
  screen: Screen;
  playerPos: { x: number; y: number }; // 0..1 normalized
  currentLocation: string;
  visited: string[];
  villager: VillagerState;
  nanin: NanInState;
  reflection: ReflectionState;
  lang: Lang;
  updatedAt: string;
}

export const defaultSave = (lang: Lang = "id"): GameSave => ({
  screen: "home",
  playerPos: { x: 0.3, y: 0.72 },
  currentLocation: "home",
  visited: [],
  villager: { spoke: false, satTogether: false, askedRiver: false },
  nanin: { met: false, choice: null, teaShared: false },
  reflection: { seen: false, completed: false },
  lang,
  updatedAt: new Date().toISOString(),
});

export function detectLang(): Lang {
  if (typeof navigator === "undefined") return "id";
  const n = navigator.language.toLowerCase();
  if (n.startsWith("en")) return "en";
  return "id";
}
