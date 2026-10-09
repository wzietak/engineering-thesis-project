import { CardDirection, Grade } from "@/algorithm/FSRSTypes";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { ReviewableCard } from "@/repositories/flashcardReviewRepository";
import { AppTheme } from "@/styles/theme";
import { useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssessmentButton from "../buttons/AssessmentButton";
import ConfirmationButton from "../buttons/ConfirmationButton";
import FlashCardBack from "./FlashCardBack";
import StandardFront from "./front types/StandardFront";
import TypeInFront from "./front types/TypeInFront";

export interface flashcardRef {
  showCardFront: () => void;
  showCardBack: () => void;
  isReversed: boolean;
}

export type ExerciseType = "standard" | "type_in" | "cloze";

type Props = {
  cardData: ReviewableCard;
  onNextCard: () => void;
  onAssessmentButtonPress: (grade: Grade) => void;
  isButtonDisabled: boolean;
  ref: React.Ref<flashcardRef>;
  onCardFlip?: (isReversed: boolean) => void;
};

function drawExerciseType(card: ReviewableCard): ExerciseType {
  // if(card.card_direction === CardType.REVERSED) ;
  const availableTypes: ExerciseType[] = ["standard", "type_in"];

  const exampleSentence = card.example_sentence?.trim().toLowerCase();
  const wordToFind = card.back;

  const canUseCloze = Boolean(
    exampleSentence &&
    wordToFind &&
    exampleSentence.includes(wordToFind) &&
    card.card_direction === CardDirection.Forward,
  );

  if (canUseCloze) availableTypes.push("cloze");

  const randomIndex = Math.floor(Math.random() * availableTypes.length);
  return availableTypes[randomIndex];
}

export default function FlashCardContainer({
  cardData,
  onNextCard,
  onAssessmentButtonPress,
  isButtonDisabled,
  ref,
  onCardFlip,
}: Props) {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [isReversed, setIsReversed] = useState(false);
  const exerciseType = useMemo(
    () => drawExerciseType(cardData),
    [cardData.card_id],
  );

  //Ref added to give parent component control over isReversed state
  useImperativeHandle(ref, () => {
    return {
      showCardFront: () => setIsReversed(false),
      showCardBack: () => setIsReversed(true),
      isReversed: isReversed,
    };
  }, [isReversed]);

  //useEffect added to pass isReversed state to the parent component on its value change
  useEffect(() => {
    if (onCardFlip) {
      onCardFlip(isReversed);
    }
  }, [isReversed]);

  return (
    <View
      style={[styles.flashCardContainer, { paddingBottom: insets.bottom + 40 }]}
    >
      {exerciseType === "type_in" ? (
        <TypeInFront
          frontText={
            cardData.card_direction === CardDirection.Forward
              ? cardData.front
              : cardData.back
          }
          style={{ flexGrow: isReversed ? 0 : 1 }}
          isReversed={isReversed}
          expectedAnswer={
            cardData.card_direction === CardDirection.Forward
              ? cardData.back
              : cardData.front
          }
          onSubmit={() => {
            Keyboard.dismiss();
            setIsReversed(true);
          }}
        ></TypeInFront>
      ) : (
        <StandardFront
          frontText={
            cardData.card_direction === CardDirection.Forward
              ? cardData.front
              : cardData.back
          }
          style={{ flexGrow: isReversed ? 0 : 1 }}
        ></StandardFront>
      )}

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
          disabled={false}
        ></ConfirmationButton>
      )}
      {isReversed && (
        <View style={styles.footer}>
          <AssessmentButton
            buttonText="Again"
            style={{ backgroundColor: theme.colors.red }}
            onPress={async () => {
              setIsReversed(false);
              await onAssessmentButtonPress(Grade.Again);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Hard"
            style={{ backgroundColor: theme.colors.grey_light }}
            onPress={async () => {
              setIsReversed(false);
              await onAssessmentButtonPress(Grade.Hard);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Good"
            style={{ backgroundColor: theme.colors.green }}
            onPress={async () => {
              setIsReversed(false);
              await onAssessmentButtonPress(Grade.Good);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Easy"
            style={{ backgroundColor: theme.colors.lightblue }}
            onPress={async () => {
              setIsReversed(false);
              await onAssessmentButtonPress(Grade.Easy);
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
