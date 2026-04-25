import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NoDecksView() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 80 }]}>
      <Text style={styles.titleText}>No decks yet</Text>
      <Text style={styles.descriptionText}>
        Tap the "+" button in the bottom corner to create your first deck.
      </Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
    titleText: {
      paddingTop: 20,
      paddingBottom: 10,
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.lg,
      color: theme.colors.purple,
    },
    descriptionText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.sm,
      textAlign: "center",
      color: theme.colors.primary,
    },
  });
