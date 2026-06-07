import Flashcard from "@/components/Flashcard";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { StyleSheet, View } from "react-native";

export default function browseCards() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.mainContainer}>
      <Flashcard
        cardId=""
        cardFront="łyżka"
        cardBack="spoon"
        deckName="Angielski"
        nextReview="2026-06-07T17:42:09.000Z"
      ></Flashcard>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      flexDirection: "column",
      paddingHorizontal: 20,
    },
  });
