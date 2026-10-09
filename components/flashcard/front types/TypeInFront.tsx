import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  frontText: string;
  isReversed: boolean;
  onSubmit: () => void;
  style?: ViewStyle;
  expectedAnswer: string;
};

type CharMatch = "correct" | "incorrect" | "missing";

interface Character {
  char: string;
  status: CharMatch;
}

function checkCharacterMatches(userInput: string, expectedAnswer: string) {
  const user = userInput.trim();
  const expected = expectedAnswer.trim();

  const isExactSubstring = expected.includes(user);

  const n = user.length;
  const m = expected.length;

  const matrix: number[][] = Array.from({ length: n + 1 }, () =>
    Array(m + 1).fill(0),
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (user[i - 1].toLowerCase() === expected[j - 1].toLocaleLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1] + 1;
      } else {
        matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
      }
    }
  }

  const lcsLength = matrix[n][m];

  if (!isExactSubstring) {
    const maxLength = Math.max(n, m);
    const userPrecision = lcsLength / n;
    const similarityRatio = lcsLength / maxLength;
    if (similarityRatio < 0.4 && userPrecision < 0.7) {
      return user
        .split("")
        .map((char): Character => ({ char, status: "incorrect" }));
    }
  }

  let i = n;
  let j = m;

  const result: Character[] = [];

  while (i > 0 || j > 0) {
    if (j > 0 && matrix[i][j - 1] === matrix[i][j]) {
      if (result.length === 0 || result[0].char !== "-") {
        result.unshift({ char: "-", status: "missing" });
      }
      j--;
    } else if (i > 0 && matrix[i - 1][j] === matrix[i][j]) {
      result.unshift({ char: user[i - 1], status: "incorrect" });
      i--;
    } else if (
      i > 0 &&
      j > 0 &&
      user[i - 1].toLowerCase() === expected[j - 1].toLowerCase()
    ) {
      result.unshift({ char: user[i - 1], status: "correct" });
      i--;
      j--;
    }
    // else if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
    //   // if (result.length === 0 || result[0].char !== "-") {
    //   //   result.unshift({ char: "-", status: "missing" });
    //   // }
    //   // j--;
    // }
    // else if (i > 0) {
    //   result.unshift({ char: user[i - 1], status: "incorrect" });
    //   i--;
    // }
  }

  return result;
}

export default function TypeInFront({
  frontText,
  isReversed,
  onSubmit,
  style,
  expectedAnswer,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [userInput, setUserInput] = useState<string>("...");

  const hasInput = userInput.trim().length > 0;

  const charactersMatches: Character[] = useMemo(() => {
    if (!isReversed || !hasInput) return [];
    return checkCharacterMatches(userInput, expectedAnswer);
  }, [isReversed, userInput, expectedAnswer]);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.frontText}>{frontText}</Text>
      {!isReversed ? (
        <TextInput
          style={styles.textInput}
          onChangeText={(input) => setUserInput(input)}
          multiline={false}
          maxLength={100}
          textAlign="center"
          placeholder="Type your answer..."
          placeholderTextColor={theme.colors.grey}
          onSubmitEditing={onSubmit}
        ></TextInput>
      ) : (
        <View
          style={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Text
            style={[
              styles.frontText,
              {
                marginTop: 30,
                fontFamily: theme.fontFamily.bold,
                fontSize: theme.fontSize.x_sm,
                color: theme.colors.grey,
              },
            ]}
          >
            Your answer
          </Text>
          <Text style={[styles.frontText, styles.userInput]}>
            {charactersMatches.length > 0 ? (
              charactersMatches.map((token, index) => {
                if (token.status === "correct") {
                  return (
                    <Text key={index} style={styles.charCorrect}>
                      {token.char}
                    </Text>
                  );
                }
                if (token.status === "incorrect") {
                  return (
                    <Text key={index} style={styles.charIncorrect}>
                      {token.char}
                    </Text>
                  );
                }

                return (
                  <Text key={index} style={styles.charMissing}>
                    {token.char}
                  </Text>
                );
              })
            ) : (
              <Text style={[styles.frontText, styles.userInput]}> ... </Text>
            )}
          </Text>
          <Octicons
            name="arrow-down"
            size={24}
            color={theme.colors.primary}
            style={{ alignSelf: "center" }}
          />
        </View>
      )}
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
    textInput: {
      width: "100%",
      marginVertical: 10,
      paddingHorizontal: 10,
      minHeight: 50,
      maxHeight: 80,
      borderBottomWidth: 1,
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.md,
    },
    userInput: {
      width: "100%",
      paddingTop: 5,
      marginBottom: 10,
      minHeight: 50,
      maxHeight: 80,
      fontFamily: theme.fontFamily.bold,
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      borderColor: theme.colors.grey,
    },
    charCorrect: {
      backgroundColor: theme.colors.green,
    },
    charMissing: {
      backgroundColor: theme.colors.grey,
    },
    charIncorrect: {
      backgroundColor: theme.colors.red,
    },
  });
