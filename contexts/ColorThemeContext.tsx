import {
  AppTheme,
  borderRadius,
  boxShadowDark,
  boxShadowLight,
  darkTheme,
  fontFamily,
  fontSize,
  lightTheme
} from "@/styles/theme";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";

type colorThemeContextType = {
  theme: AppTheme;
  setPreferredTheme: (theme: "dark" | "light" | "system") => void;
  preferredTheme: "dark" | "light" | "system";
};

export const ColorThemeContext = createContext<
  colorThemeContextType | undefined
>(undefined);

export default function ColorThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preferredTheme, setPreferredTheme] = useState<
    "dark" | "light" | "system"
  >("system");
  const colorScheme = useColorScheme();

  const activeColors = useMemo(() => {
    const activeTheme =
      preferredTheme === "system" ? (colorScheme ?? "light") : preferredTheme;
    return activeTheme === "light" ? lightTheme : darkTheme;
  }, [preferredTheme, colorScheme]);

  const currentTheme: AppTheme = {
    colors: activeColors,
    borderRadius,
    boxShadow: preferredTheme === "light" ? boxShadowLight : boxShadowDark,
    fontSize,
    fontFamily,
  };

  return (
    <ColorThemeContext.Provider
      value={{ theme: currentTheme, setPreferredTheme, preferredTheme }}
    >
      {children}
    </ColorThemeContext.Provider>
  );
}

export const useAppTheme = () => {
  const context = useContext(ColorThemeContext);
  if (context === undefined) throw new Error("Context is undefined!");
  return context;
};
