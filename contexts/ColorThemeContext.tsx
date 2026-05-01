import {
  AppTheme,
  borderRadius,
  boxShadowDark,
  boxShadowLight,
  darkTheme,
  fontFamily,
  fontSize,
  lightTheme,
} from "@/styles/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type themeOption = "dark" | "light" | "system";

type colorThemeContextType = {
  theme: AppTheme;
  setPreferredTheme: (value: themeOption) => void;
  preferredTheme: themeOption;
  actualTheme: string;
};

export const ColorThemeContext = createContext<
  colorThemeContextType | undefined
>(undefined);

export default function ColorThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preferredTheme, setPreferredTheme] = useState<themeOption>("system");
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getPreferredTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem("preferredTheme");
        if (theme !== null) {
          setPreferredTheme(theme as themeOption);
        }
      } catch (error) {}
    };
    getPreferredTheme();
  }, []);

  const setThemeOnChange = async (value: themeOption) => {
    try {
      setPreferredTheme(value);
      await AsyncStorage.setItem("preferredTheme", value);
    } catch (error) {}
  };

  const actualTheme = useMemo(() => {
    if (preferredTheme === "system") {
      return colorScheme ?? "light";
    }
    return preferredTheme;
  }, [preferredTheme, colorScheme]);

  const currentTheme: AppTheme = {
    colors: actualTheme === "dark" ? darkTheme : lightTheme,
    borderRadius,
    boxShadow: actualTheme === "light" ? boxShadowLight : boxShadowDark,
    fontSize,
    fontFamily,
  };

  return (
    <ColorThemeContext.Provider
      value={{
        theme: currentTheme,
        setPreferredTheme: setThemeOnChange,
        preferredTheme,
        actualTheme,
      }}
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
