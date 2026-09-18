import { useState, useRef, useCallback } from "react";
import type { EffectName } from "@/data/staticData";

export interface ActiveEffect {
  currentEffect: EffectName | null;
  currentEffectRef: React.MutableRefObject<EffectName | null>;
  setCurrentEffect: React.Dispatch<React.SetStateAction<EffectName | null>>;
  clearEffect: () => void;
  isMeowActive: boolean;
  setIsMeowActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useActiveEffect(): ActiveEffect {
  const [currentEffect, setCurrentEffect] = useState<EffectName | null>(null);
  const [isMeowActive, setIsMeowActive] = useState<boolean>(false);

  // Mirrors currentEffect so executeCommand can read latest value
  // without needing it as a useCallback dependency
  const currentEffectRef = useRef(currentEffect);
  currentEffectRef.current = currentEffect;

  const clearEffect = useCallback(() => setCurrentEffect(null), []);

  return { currentEffect, currentEffectRef, setCurrentEffect, clearEffect, isMeowActive, setIsMeowActive };
}
