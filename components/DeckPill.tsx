import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  deckId?: string;
  deckName?: string;
  onPress: () => void;
};

export default function DeckPill({ deckId, deckName, onPress }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <Pressable style={styles.deckNamePill} onPress={onPress}>
      <Text style={styles.textStyle}>
        {" "}
        {!deckId && !deckName ? "All decks" : deckName}{" "}
      </Text>
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    deckNamePill: {
      height: 30,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.borderRadius.md,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      //   alignSelf: "center",
    },
    textStyle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary,
    },
  });
