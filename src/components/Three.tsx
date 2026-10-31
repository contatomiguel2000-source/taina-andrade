"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/** WebGL disponível? (sem WebGL, as seções mostram a foto no lugar do 3D) */
const subscribe = () => () => {};
let cached: boolean | null = null;
function getWebGL() {
  if (cached !== null) return cached;
  try {
    const c = document.createElement("canvas");
    cached = !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    cached = false;
  }
  return cached;
}
export function useWebGL() {
  return useSyncExternalStore(subscribe, getWebGL, () => false);
}

export const HeroScene = dynamic(() => import("./Scenes").then((m) => m.HeroScene), { ssr: false });
export const RingScene = dynamic(() => import("./Scenes").then((m) => m.RingScene), { ssr: false });
