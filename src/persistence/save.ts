import { openDB } from "idb";
import type { GameSave } from "@/game/types";

const DB = "keheningan";
const STORE = "save";
const KEY = "v1";

function db() {
  return openDB(DB, 1, { upgrade(db) { db.createObjectStore(STORE); } });
}

export async function loadSave(): Promise<GameSave | null> {
  try {
    const d = await db();
    const v = (await d.get(STORE, KEY)) as GameSave | undefined;
    if (v) return v;
  } catch {}
  try {
    const raw = localStorage.getItem("keheningan_save_v1");
    if (raw) return JSON.parse(raw) as GameSave;
  } catch {}
  return null;
}

export async function saveGame(s: GameSave): Promise<void> {
  s.updatedAt = new Date().toISOString();
  try {
    const d = await db();
    await d.put(STORE, s, KEY);
  } catch {}
  try { localStorage.setItem("keheningan_save_v1", JSON.stringify(s)); } catch {}
  try { localStorage.setItem("keheningan.lang", s.lang); } catch {}
}

export async function clearSave(): Promise<void> {
  try { const d = await db(); await d.delete(STORE, KEY); } catch {}
  try { localStorage.removeItem("keheningan_save_v1"); } catch {}
}
