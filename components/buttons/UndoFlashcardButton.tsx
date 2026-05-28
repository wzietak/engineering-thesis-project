import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { Pressable, StyleSheet } from "react-native";

type Props = {
  onPress?: () => void | Promise<void>;
};

export default function UndoFlashcardButton({ onPress }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable onPress={onPress} hitSlop={6}>
      <Octicons name="undo" size={24} color={theme.colors.primary} />
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerContainer: {
      width: "100%",
      height: 100,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: theme.colors.background,
    },
    headerText: {
      fontSize: theme.fontSize.x_lg,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary,
    },
  });
