import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme, theme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type Props = {
  style?: ViewStyle;
  buttonText: string;
  onPress?: () => void;
};

export default function AssessmentButton({ style, buttonText, onPress }: Props) {
  const { theme } = useAppTheme();
    const styles = createStyles(theme);
  return (
    <Pressable style={[styles.buttonPressable, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) => StyleSheet.create({
  buttonPressable: {
    height: 60,
    marginHorizontal: 2,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  buttonText: {
    alignSelf: "center",
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.sm,
  },
});
