import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmationButton from "./buttons/ConfirmationButton";

type Props = {
 noMoreCardsToReview?: boolean;
}

export default function EmptyDeckView({noMoreCardsToReview = false} : Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 40 }]}>
      <Text style={styles.titleText}>
        {noMoreCardsToReview ? "You're all caught up!" : "No cards here yet"}
      </Text>
      <Text style={styles.descriptionText}>
        {noMoreCardsToReview
          ? "No cards to review right now. Come back later."
          : "This deck is currently empty. Add some flashcards to start studying!"}
      </Text>
      <View style={{ flexGrow: 1 }}></View>
      <ConfirmationButton
        buttonText="Go back"
        style={{ width: "100%" }}
        onPress={router.back}
      ></ConfirmationButton>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
    },
    titleText: {
      paddingTop: 20,
      paddingBottom: 10,
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.lg,
      color: theme.colors.primary,
    },
    descriptionText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.sm,
      textAlign: "center",
      color: theme.colors.primary,
    },
  });
