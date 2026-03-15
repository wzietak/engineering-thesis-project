import { theme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type Props = {
  style?: ViewStyle;
  buttonText: string;
};

export default function AssessmentButton({ style, buttonText }: Props) {
  return (
    <Pressable style={[styles.buttonPressable, style]}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
