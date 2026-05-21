import { useState, useEffect, useRef } from "react";
import { defaultTheme, themeNames } from "@/themes/themes";
import type { ThemeName } from "@/themes/themes";

export interface TerminalTheme {
  currentThemeName: ThemeName;
  currentThemeNameRef: React.MutableRefObject<ThemeName>;
  setCurrentThemeName: React.Dispatch<React.SetStateAction<ThemeName>>;
}

const THEME_STORAGE_KEY = "themeName";

export function useTheme(): TerminalTheme {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    // Validate that the stored value is still a valid theme name
    if (stored && (themeNames as readonly string[]).includes(stored)) {
      return stored as ThemeName;
    }
    return defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, currentThemeName);
  }, [currentThemeName]);

  // Mirrors currentThemeName so executeCommand can read latest value
  // without needing it as a useCallback dependency
  const currentThemeNameRef = useRef(currentThemeName);
  currentThemeNameRef.current = currentThemeName;

  return { currentThemeName, currentThemeNameRef, setCurrentThemeName };
}
