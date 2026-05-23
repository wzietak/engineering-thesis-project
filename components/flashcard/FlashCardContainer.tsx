import { FSRS } from "@/algorithm/FSRS";
import { FSRSState } from "@/algorithm/FSRSState";
import { CardDirection, Grade } from "@/algorithm/FSRSTypes";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { FrontType } from "@/models/FrontTypes";
import {
  ReviewableCard,
  saveCardReview,
} from "@/repositories/flashcardReviewRepository.ts";
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
};

export default function FlashCardContainer({ cardData, onNextCard }: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [isReversed, setIsReversed] = useState(false);

  const fsrs = new FSRS();

  const previousCardState: FSRSState = {
    id: cardData.id,
    card_id: cardData.card_id,
    card_direction: cardData.card_direction,
    stability: cardData.stability,
    difficulty: cardData.difficulty,
    last_review: cardData.last_review,
    next_review: cardData.next_review,
    interval_days: cardData.interval_days,
    state: cardData.state,
    reps: cardData.reps,
    lapses: cardData.lapses,
    updated_at: cardData.updated_at,
  };

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
              const { updatedCardState, retrievability } =
                fsrs.calculateCardState(previousCardState, Grade.Again);
              saveCardReview(previousCardState, updatedCardState, {
                grade: Grade.Again,
                retrievability_at_review: retrievability
                  ? retrievability
                  : null,
                exercise_type: FrontType.STANDARD,
                reviewed_at: new Date().toISOString(),
              });
              onNextCard();
            }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Hard"
            style={{ backgroundColor: theme.colors.grey_light }}
            onPress={() => {
              setIsReversed(false);
              const { updatedCardState, retrievability } =
                fsrs.calculateCardState(previousCardState, Grade.Hard);
              saveCardReview(previousCardState, updatedCardState, {
                grade: Grade.Hard,
                retrievability_at_review: retrievability
                  ? retrievability
                  : null,
                exercise_type: FrontType.STANDARD,
                reviewed_at: new Date().toISOString(),
              });
              onNextCard();
            }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Good"
            style={{ backgroundColor: theme.colors.green }}
            onPress={() => {
              setIsReversed(false);
              const { updatedCardState, retrievability } =
                fsrs.calculateCardState(previousCardState, Grade.Good);
              saveCardReview(previousCardState, updatedCardState, {
                grade: Grade.Good,
                retrievability_at_review: retrievability
                  ? retrievability
                  : null,
                exercise_type: FrontType.STANDARD,
                reviewed_at: new Date().toISOString(),
              });
              onNextCard();
            }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Easy"
            style={{ backgroundColor: theme.colors.lightblue }}
            onPress={() => {
              setIsReversed(false);
              const { updatedCardState, retrievability } =
                fsrs.calculateCardState(previousCardState, Grade.Easy);
              saveCardReview(previousCardState, updatedCardState, {
                grade: Grade.Easy,
                retrievability_at_review: retrievability
                  ? retrievability
                  : null,
                exercise_type: FrontType.STANDARD,
                reviewed_at: new Date().toISOString(),
              });
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
