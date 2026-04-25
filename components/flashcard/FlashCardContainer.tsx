import { useAppTheme } from "@/contexts/ColorThemeContext";
import { Card } from "@/models/card";
import { AppTheme } from "@/styles/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssessmentButton from "../buttons/AssessmentButton";
import ConfirmationButton from "../buttons/ConfirmationButton";
import FlashCardBack from "./FlashCardBack";
import StandardFront from "./front types/StandardFront";

type Props = {
  cardData: Card;
  onNextCard: () => void;
};

export default function FlashCardContainer({ cardData, onNextCard }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [isReversed, setIsReversed] = useState(false);
  return (
    <View
      style={[styles.flashCardContainer, { paddingBottom: insets.bottom + 40 }]}
    >
      <StandardFront
        frontText={cardData.front}
        style={{ flexGrow: isReversed ? 0 : 1 }}
      ></StandardFront>
      {isReversed && (
        <FlashCardBack
          backText={cardData.back}
          exampleSentence={cardData.example_sentence as string}
        ></FlashCardBack>
      )}
      {!isReversed && (
        <ConfirmationButton
          buttonText="Show answer"
          onPress={() => setIsReversed(true)}
        ></ConfirmationButton>
      )}
      {isReversed && (
        <View style={styles.footer}>
          <AssessmentButton
            buttonText="Again"
            style={{ backgroundColor: theme.colors.red }}
            onPress={() => {
              setIsReversed(false);
              onNextCard();
            }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Hard"
            style={{ backgroundColor: theme.colors.grey_light }}
            onPress={() => {
              setIsReversed(false);
              onNextCard();
            }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Good"
            style={{ backgroundColor: theme.colors.green }}
            onPress={() => {
              setIsReversed(false);
              onNextCard();
            }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Easy"
            style={{ backgroundColor: theme.colors.lightblue }}
            onPress={() => {
              setIsReversed(false);
              onNextCard();
            }}
          ></AssessmentButton>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    flashCardContainer: {
      flex: 1,
      flexGrow: 1,
      flexDirection: "column",
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: theme.colors.background,
    },
    footer: {
      width: "100%",
      flexDirection: "row",
      alignContent: "space-between",
    },
  });
