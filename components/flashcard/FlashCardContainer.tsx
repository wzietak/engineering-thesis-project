import { theme } from "@/styles/theme";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AssessmentButton from "../buttons/AssessmentButton";
import ConfirmationButton from "../buttons/ConfirmationButton";
import FlashCardBack from "./FlashCardBack";
import StandardFront from "./front types/StandardFront";

export default function FlashCardContainer() {
  const insets = useSafeAreaInsets();
  const [isReverted, setIsReverted] = useState(false);
  return (
    <View
      style={[styles.flashCardContainer, { paddingBottom: insets.bottom + 40 }]}
    >
      <StandardFront
        frontText="widelec"
        style={{ flexGrow: isReverted ? 0 : 1 }}
      ></StandardFront>
      {isReverted && <FlashCardBack backText="fork" exampleSentence="I like my fork"></FlashCardBack>}
      {!isReverted && (
        <ConfirmationButton
          buttonText="Show answer"
          onPress={() => setIsReverted(true)}
        ></ConfirmationButton>
      )}
      {isReverted && (
        <View style={styles.footer}>
          <AssessmentButton
            buttonText="Again"
            style={{ backgroundColor: theme.colors.red }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Hard"
            style={{ backgroundColor: theme.colors.grey_light }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Good"
            style={{ backgroundColor: theme.colors.green }}
          ></AssessmentButton>
          <AssessmentButton
            buttonText="Easy"
            style={{ backgroundColor: theme.colors.lightblue }}
          ></AssessmentButton>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
