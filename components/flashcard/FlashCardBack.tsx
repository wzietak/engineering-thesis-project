import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  backText: string;
  exampleSentence: string;
  AIgenerated?: boolean;
};
export default function FlashCardBack({
  backText,
  exampleSentence,
  AIgenerated = false,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.container}>
      <View style={styles.separator}></View>
      <Text style={styles.backText}>{backText}</Text>
      <Text
        style={[
          styles.backTextSentence,
          { color: AIgenerated ? theme.colors.purple : theme.colors.blue },
        ]}
      >
        {exampleSentence}
      </Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      width: "100%",
    },
    separator: {
      marginVertical: 20,
      height: 1,
      backgroundColor: theme.colors.grey,
      borderRadius: theme.borderRadius.lg,
    },
    backText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.lg,
      textAlign: "center",
    },
    backTextSentence: {
      paddingTop: 10,
      fontFamily: theme.fontFamily.italic,
      fontSize: theme.fontSize.sm,
      textAlign: "center",
    },
  });
