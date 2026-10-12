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

  const cleanAnswer = expectedAnswer.trim();
  const cleanSentence = exampleSentence.trim();

  const answerIndex = cleanSentence
    .toLowerCase()
    .indexOf(cleanAnswer.toLowerCase());

  const before = cleanSentence.slice(0, answerIndex);
  const after = cleanSentence.slice(answerIndex + cleanAnswer.length);

  const isInputCorrect =
    userInput.trim().toLowerCase() === cleanAnswer.toLowerCase();

  return (
    <View style={[styles.container, style]}>
      <Text>
        <Text
          style={[
            styles.exampleSentence,
            {
              color: isReversed ? theme.colors.blue : theme.colors.primary,
            },
          ]}
        >
          {before}
        </Text>
        {!isReversed ? (
          <Text
            style={[
              styles.exampleSentence,
              {
                color: isReversed ? theme.colors.blue : theme.colors.primary,
              },
            ]}
          >
            ...............
          </Text>
        ) : (
          <Text
            style={[
              styles.exampleSentence,
              {
                color: isReversed ? theme.colors.blue : theme.colors.primary,
                fontFamily: theme.fontFamily.bold,
              },
            ]}
          >
            {expectedAnswer}
          </Text>
        )}

        <Text
          style={[
            styles.exampleSentence,
            {
              color: isReversed ? theme.colors.blue : theme.colors.primary,
            },
          ]}
        >
          {after}
        </Text>
      </Text>
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
      fontSize: theme.fontSize.md,
      textAlign: "center",
      color: theme.colors.primary,
    },
    exampleSentence: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.lg,
      textAlign: "center",
      color: theme.colors.primary,
    },
  });
