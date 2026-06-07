import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  cardId: string;
  cardFront: string;
  cardBack: string;
  deckName: string;
  nextReview: string;
  onPress?: () => void;
  onMoveLeft?: () => void;
};

export default function Flashcard({
  cardId,
  cardFront,
  cardBack,
  deckName,
  nextReview,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.cardContainer}>
      <Pressable style={styles.cardPressable}>
        <View style={styles.halfContainer}>
          <Text style={styles.cardFrontText}>{cardFront}</Text>
          <Text style={styles.cardBackText}>{cardBack}</Text>
        </View>

        <View style={styles.halfContainer}>
          <View style={styles.deckNamePill}>
            <Text style={styles.deckNameText}>{deckName}</Text>
          </View>

          <Text style={styles.nextReviewText}>
            Next review: {new Date(nextReview).toLocaleTimeString()}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    cardContainer: {
      marginVertical: 5,
      padding: 10,
      height: 90,
      borderRadius: theme.borderRadius.sm,
      borderStyle: "solid",
      borderColor: theme.colors.blue,
      borderWidth: 1,
      backgroundColor: theme.colors.background,
    },
    cardPressable: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cardFrontText: {
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
    },
    cardBackText: {
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary,
    },
    deckNameText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: "black",
    },
    nextReviewText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary,
    },
    halfContainer: {
      height: "100%",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    deckNamePill: {
      padding: 3,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.lightpurple,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-end",
    },
  });
