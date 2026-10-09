import { CardDirection, ExerciseType, Grade } from "@/algorithm/FSRSTypes";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { ReviewableCard } from "@/repositories/flashcardReviewRepository";
import { AppTheme } from "@/styles/theme";
import { useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssessmentButton from "../buttons/AssessmentButton";
import ConfirmationButton from "../buttons/ConfirmationButton";
import FlashCardBack from "./FlashCardBack";
import ClozeFront from "./front types/ClozeFront";
import StandardFront from "./front types/StandardFront";
import TypeInFront from "./front types/TypeInFront";

export interface flashcardRef {
  showCardFront: () => void;
  showCardBack: () => void;
  isReversed: boolean;
}

type Props = {
  cardData: ReviewableCard;
  onNextCard: () => void;
  onAssessmentButtonPress: (grade: Grade, exerciseType: ExerciseType) => void;
  isButtonDisabled: boolean;
  ref: React.Ref<flashcardRef>;
  onCardFlip?: (isReversed: boolean) => void;
};

function drawExerciseType(card: ReviewableCard): ExerciseType {
  const availableTypes: ExerciseType[] = [
    ExerciseType.StandardCard,
    ExerciseType.TypeInCard,
  ];

  const exampleSentence = card.example_sentence?.trim().toLowerCase();
  const wordToFind = card.back.trim();

  console.log("CARD DIRECTION: ", card.card_direction);

  const canUseCloze = Boolean(
    exampleSentence &&
    wordToFind &&
    exampleSentence.includes(wordToFind) &&
    card.card_direction === CardDirection.Reverse,
  );

  if (canUseCloze) availableTypes.push(ExerciseType.ClozeCard);

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

  const exerciseType = useMemo(() => {
    const drawn = drawExerciseType(cardData);
    return drawn;
  }, [cardData.card_id]);

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
      {exerciseType === ExerciseType.TypeInCard ? (
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
      ) : exerciseType === ExerciseType.ClozeCard ? (
        <ClozeFront
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
          exampleSentence={cardData.example_sentence ?? ""}
          onSubmit={() => {
            Keyboard.dismiss();
            setIsReversed(true);
          }}
        ></ClozeFront>
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
          hideExampleSentenceAndBack={
            exerciseType === ExerciseType.ClozeCard ? true : false
          }
          frontText={cardData.front}
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
              await onAssessmentButtonPress(Grade.Again, exerciseType);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Hard"
            style={{ backgroundColor: theme.colors.grey_light }}
            onPress={async () => {
              setIsReversed(false);
              await onAssessmentButtonPress(Grade.Hard, exerciseType);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Good"
            style={{ backgroundColor: theme.colors.green }}
            onPress={async () => {
              setIsReversed(false);
              await onAssessmentButtonPress(Grade.Good, exerciseType);
              onNextCard();
            }}
            isDisabled={isButtonDisabled}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Easy"
            style={{ backgroundColor: theme.colors.lightblue }}
            onPress={async () => {
              setIsReversed(false);
              await onAssessmentButtonPress(Grade.Easy, exerciseType);
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
