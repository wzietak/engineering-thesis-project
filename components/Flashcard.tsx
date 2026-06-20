import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

const getRelativeReviewTime = (isoString: string) => {
  if (!isoString) return "unknown";

  const now = new Date();
  const nextReviewDate = new Date(isoString);

  const currentDateWithoutTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const nextReviewWithoutTime = new Date(
    nextReviewDate.getFullYear(),
    nextReviewDate.getMonth(),
    nextReviewDate.getDate(),
  );

  const differenceInDays = Math.round(
    (nextReviewWithoutTime.getTime() - currentDateWithoutTime.getTime()) /
      (24 * 60 * 60 * 1000),
  );

  if (differenceInDays < 0) {
    const overdueDays = Math.abs(differenceInDays);
    if (overdueDays === 1) return `overdue by ${overdueDays} day`;
    if (overdueDays > 99) return `overdue`;
    return `overdue by ${overdueDays} days`;
  }
  if (differenceInDays > 0) {
    if (differenceInDays === 1) return "tomorrow";
    if (differenceInDays < 30) return `in ${differenceInDays} days`;
    if (differenceInDays >= 30) {
      const differenceInMonths = Math.floor(differenceInDays / 30);
      return `in ${differenceInMonths} months`;
    }
  }

  const exactDifferenceInMs = nextReviewDate.getTime() - now.getTime();
  if (exactDifferenceInMs <= 0) return "now";
  const hours = Math.floor(exactDifferenceInMs / (1000 * 60 * 60));
  const minutes = Math.floor(
    (exactDifferenceInMs % (1000 * 60 * 60)) / (1000 * 60),
  );
  const seconds = Math.floor((exactDifferenceInMs % (1000 * 60)) / 1000);
  if (hours > 0) return `in ${hours}h ${minutes}m`;
  if (minutes > 0) return `in ${minutes}m ${seconds}s`;
  return `in ${seconds}s`;
};

type Props = {
  cardId: string;
  cardFront: string;
  cardBack: string;
  deckName: string;
  nextReview: string;
  onPress?: () => void;
  onMoveLeft?: () => void;
};

export default function FlashcardComponent({
  cardId,
  cardFront,
  cardBack,
  deckName,
  nextReview,
  onPress,
  onMoveLeft,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={styles.cardContainer}>
      <Pressable style={styles.cardPressable} onPress={onPress}>
        <View style={[styles.halfContainer]}>
          <Text
            style={styles.cardFrontText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cardFront}
          </Text>
          <Text
            style={styles.cardBackText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cardBack}
          </Text>
        </View>

        <View style={[styles.halfContainer]}>
          <View style={styles.deckNamePill}>
            <Text style={styles.deckNameText}>{deckName}</Text>
          </View>

          <View
            style={{
              width: "100%",
              height: "65%",
              flexDirection: "column",
              alignItems: "flex-end",
              justifyContent: "flex-end",
            }}
          >
            <Text style={[styles.nextReviewText, { textAlign: "right" }]}>
              Next review:{" "}
              <Text
                style={[
                  styles.nextReviewText,
                  { fontFamily: theme.fontFamily.bold },
                ]}
              >
                {getRelativeReviewTime(nextReview)}
              </Text>
            </Text>
          </View>
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
      paddingRight: 30,
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
      width: "50%",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    deckNamePill: {
      padding: 3,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.lightpurple_alpha,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.borderRadius.sm,
      alignSelf: "flex-end",
    },
  });
