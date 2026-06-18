import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  deckId?: string;
  deckName?: string;
};

export default function DeckPill({ deckId, deckName }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.deckNamePill}>
      <Text style={styles.textStyle}> {!deckId && !deckName ? "All decks" : deckName} </Text>
    </View>
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
