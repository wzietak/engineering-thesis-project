import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  frontText: string;
  style?: ViewStyle;
  exampleSentence: string;
  onSubmit: () => void;
  isReversed: boolean;
  expectedAnswer: string;
};

export default function ClozeFront({
  frontText,
  style,
  exampleSentence,
  onSubmit,
  isReversed,
  expectedAnswer,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [userInput, setUserInput] = useState("");

  const answerIndex = exampleSentence
    .toLowerCase()
    .indexOf(expectedAnswer.toLowerCase());

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
      color: theme.colors.primary,
    },
  });
