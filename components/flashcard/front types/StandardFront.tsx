import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  frontText: string;
  style?: ViewStyle;
};

export default function StandardFront({ frontText, style }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.frontText}>{frontText}</Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      width: "100%",
      alignItems: "center",
    },
    frontText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.lg,
      textAlign: "center",
    },
  });
