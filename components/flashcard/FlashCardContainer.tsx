import {
  ReviewableCard
} from "@/algorithm/flashcardReviewRepository.ts";
import { CardDirection, Grade } from "@/algorithm/FSRSTypes";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssessmentButton from "../buttons/AssessmentButton";
import ConfirmationButton from "../buttons/ConfirmationButton";
import FlashCardBack from "./FlashCardBack";
import StandardFront from "./front types/StandardFront";

type Props = {
  cardData: ReviewableCard;
  onNextCard: () => void;
  onAssessmentButtonPress: (grade: Grade) => void;
  isButtonDisabled : boolean;
};

export default function FlashCardContainer({
  cardData,
  onNextCard,
  onAssessmentButtonPress, isButtonDisabled
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [isReversed, setIsReversed] = useState(false);

  return (
    <View
      style={[styles.flashCardContainer, { paddingBottom: insets.bottom + 40 }]}
    >
      <StandardFront
        frontText={
          cardData.card_direction === CardDirection.Forward
            ? cardData.front
            : cardData.back
        }
        style={{ flexGrow: isReversed ? 0 : 1 }}
      ></StandardFront>
      {isReversed && (
        <FlashCardBack
          backText={
            cardData.card_direction === CardDirection.Forward
              ? cardData.back
              : cardData.front
          }
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
              onAssessmentButtonPress(Grade.Again);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Hard"
            style={{ backgroundColor: theme.colors.grey_light }}
            onPress={() => {
              setIsReversed(false);
              onAssessmentButtonPress(Grade.Hard);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Good"
            style={{ backgroundColor: theme.colors.green }}
            onPress={() => {
              setIsReversed(false);
              onAssessmentButtonPress(Grade.Good);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Easy"
            style={{ backgroundColor: theme.colors.lightblue }}
            onPress={() => {
              setIsReversed(false);
              onAssessmentButtonPress(Grade.Easy);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
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
