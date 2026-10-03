"use client";
import { useEffect, useRef } from "react";
import { useGameStore } from "@/game/store";
import { loadSave, saveGame } from "@/persistence/save";
import type { GameSave } from "@/game/types";

export function useAutosave() {
  const hydrated = useGameStore((s) => s.hydrated);
  const snapRef = useRef<GameSave | null>(null);

  // hydrate once
  useEffect(() => {
    loadSave().then((s) => {
      if (s) useGameStore.getState().hydrate(s);
      else useGameStore.setState({ hydrated: true });
    });
  }, []);

  // collect snapshot
  const snapshot: GameSave = {
    screen: useGameStore((s) => s.screen),
    playerPos: useGameStore((s) => s.playerPos),
    currentLocation: useGameStore((s) => s.currentLocation),
    visited: useGameStore((s) => s.visited),
    villager: useGameStore((s) => s.villager),
    nanin: useGameStore((s) => s.nanin),
    reflection: useGameStore((s) => s.reflection),
    lang: useGameStore((s) => s.lang),
    updatedAt: new Date().toISOString(),
  } as GameSave;

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => {
      // avoid writing identical
      const key = JSON.stringify({ ...snapshot, updatedAt: "" });
      if (snapRef.current && JSON.stringify({ ...(snapRef.current as GameSave), updatedAt: "" }) === key) return;
      snapRef.current = { ...snapshot };
      saveGame({ ...snapshot });
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, snapshot.screen, snapshot.playerPos.x, snapshot.playerPos.y, snapshot.lang, JSON.stringify(snapshot.visited), JSON.stringify(snapshot.villager), JSON.stringify(snapshot.nanin), JSON.stringify(snapshot.reflection)]);
}
