import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  frontText: string;
  isReversed: boolean;
  onSubmit: () => void;
  style?: ViewStyle;
};

function checkCharacterMatches(userInput: string, expectedAnswer: string) {}

export default function TypeInFront({
  frontText,
  isReversed,
  onSubmit,
  style,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [userInput, setUserInput] = useState<string>("...");
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
                // backgroundColor: "red",
              },
            ]}
          >
            Your answer
          </Text>
          <Text
            style={[
              styles.frontText,
              {
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
            ]}
          >
            {userInput}
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
  });
