import { createNewCardState } from "@/algorithm/flashcardReviewRepository.ts";
import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import LoadingScreen from "@/components/LoadingScreen";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { Card, ExampleSource } from "@/models/card";
import { CARD_TYPE_OPTIONS, CardType } from "@/models/CardTypes";
import { Deck } from "@/models/deck";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { generateSentence } from "@/services/aiService";
import { AppTheme } from "@/styles/theme";
import { eventProvider } from "@/utils/eventProvider";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import DropdownSelect from "react-native-input-select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const INITIAL_VALUES = {
  deckId: null,
  cardType: "",
  front: "",
  back: "",
  usageExample: "",
  exampleSource: "user" as ExampleSource,
  tags: [],
};

const INITIAL_ERRORS = {
  deckNameErr: "",
  cardTypeErr: "",
  cardFrontErr: "",
  cardBackErr: "",
  AIGeneratingError: "",
};

export default function AddNewCard() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const [errorText, setErrorText] = useState({
    deckNameErr: "",
    cardTypeErr: "",
    cardFrontErr: "",
    cardBackErr: "",
    AIGeneratingError: "",
  });

  const [cardType, setCardType] = useState<CardType | string>(
    INITIAL_VALUES.cardType,
  );
  const [deckId, setDeckId] = useState<null | string>(INITIAL_VALUES.deckId);
  const [tags, setTags] = useState(INITIAL_VALUES.tags);
  const [cardFront, setCardFront] = useState(INITIAL_VALUES.front);
  const [cardBack, setCardBack] = useState(INITIAL_VALUES.back);
  const [usageExample, setUsageExample] = useState(INITIAL_VALUES.usageExample);
  const [exampleSource, setExampleSource] = useState<ExampleSource>(
    INITIAL_VALUES.exampleSource,
  );
  const [rawDecks, setRawDecks] = useState<Deck[]>([]);
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const { cardId } = useLocalSearchParams<{ cardId: string }>();
  const [isEditMode, setIsEditMode] = useState(cardId ? true : false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialDeckId, setInitialDeckId] = useState<string>();
  const [isAIthinking, setIsAIThinking] = useState(false);

  const session = useContext(AuthContext);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const user_id = session?.currentSession?.user.id;
      if (!user_id) return;
      globalDeckRepository.getDecks(user_id).then((decks) => {
        return setRawDecks(decks);
      });
    }, [session?.currentSession?.user.id]),
  );

  useEffect(() => {
    if (cardId) {
      const getCard = async () => {
        try {
          const userId = session?.currentSession?.user.id;
          const card: Card | null = await globalCardRepository.getCardById(
            cardId,
            userId as string,
          );
          if (card === null) router.back();
          else {
            navigation.setOptions({ title: "Edit card" });
            setIsEditMode(true);
            setDeckId(card.deck_id);
            setCardType(card.card_type);
            setCardFront(card.front);
            setCardBack(card.back);
            setUsageExample(card.example_sentence ?? "");
            setInitialDeckId(card.deck_id);
          }
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      };
      getCard();
    } else {
      setIsLoading(false);
      setIsEditMode(false);
    }
  }, [cardId]);



  const formattedOptions = rawDecks
    .map((deck: Deck) => {
      return { label: deck.name, value: deck.id };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const getDeckData = (deck_id: string) => {
    return rawDecks.find((deck) => deck.id === deck_id);
  };

  const setDefaultStates = () => {
    setCardFront(INITIAL_VALUES.front);
    setCardBack(INITIAL_VALUES.back);
    setUsageExample(INITIAL_VALUES.usageExample);
    setTags(INITIAL_VALUES.tags);
    setErrorText(INITIAL_ERRORS);
  };

  const onSavePress = async () => {
    let isFormValid = true;
    const cardFrontCleaned = cardFront.trim().replaceAll(/\n{2,}/g, "\n");
    const cardBackCleaned = cardBack.trim().replaceAll(/\n{2,}/g, "\n");
    const usageExampleCleaned = usageExample.trim().replaceAll(/\n{2,}/g, "\n");

    if (deckId === null || deckId === "") {
      isFormValid = false;
      setErrorText((prevErrors) => ({
        ...prevErrors,
        deckNameErr: "Deck selection is required.",
      }));
    }
    if (cardType === "" || cardType === null) {
      isFormValid = false;
      setErrorText((prevErrors) => ({
        ...prevErrors,
        cardTypeErr: "Card type selection is required.",
      }));
    }
    if (!cardFrontCleaned) {
      isFormValid = false;
      setErrorText((prevErrors) => ({
        ...prevErrors,
        cardFrontErr: "Front of the card cannot be empty.",
      }));
    }
    if (!cardBackCleaned) {
      isFormValid = false;
      setErrorText((prevErrors) => ({
        ...prevErrors,
        cardBackErr: "Back of the card cannot be empty.",
      }));
    }

    if (!isFormValid || deckId == null) {
      return;
    }

    try {
      if (!isEditMode) {
        const cardData = {
          deck_id: deckId,
          card_type: cardType,
          front: cardFrontCleaned,
          back: cardBackCleaned,
          example_sentence: usageExampleCleaned,
          example_source: exampleSource,
          user_id: session?.currentSession?.user.id as string,
          tags: [],
        };

        const result = await globalCardRepository.createNewCard(cardData);
        if (cardType === CardType.BASIC_AND_REVERSED) {
          await createNewCardState(result.id, CardType.BASIC);
          await createNewCardState(result.id, CardType.REVERSED);
        } else {
          await createNewCardState(result.id, cardType as CardType);
        }
        setDefaultStates();
        if (Platform.OS === "android")
          ToastAndroid.show("Card added!", ToastAndroid.SHORT);
      } else {
        const cardData = {
          id: cardId,
          deck_id: deckId,
          card_type: cardType,
          front: cardFrontCleaned,
          back: cardBackCleaned,
          example_sentence: usageExampleCleaned,
          example_source: exampleSource,
          user_id: session?.currentSession?.user.id as string,
          tags: [],
          is_deleted: false,
        };

        const updatedCard = await globalCardRepository.updateCard(cardData);
        if (updatedCard) {
          if (updatedCard.deck_id !== initialDeckId) {
            eventProvider.emit("onCardRemovedFromSession", updatedCard.id);
          } else {
            eventProvider.emit("onCardEdited", updatedCard);
          }
          router.back();
        }

        if (Platform.OS === "android")
          ToastAndroid.show("Changes saved", ToastAndroid.SHORT);
      }
    } catch (error) {}
  };

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        {isLoading ? (
          <LoadingScreen></LoadingScreen>
        ) : (
          <KeyboardAwareScrollView
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableAutomaticScroll={true}
            enableOnAndroid={true}
          >
            <Text style={[styles.formText, { paddingTop: 0 }]}>Deck</Text>
            <DropdownSelect
              placeholder="Select deck"
              options={formattedOptions}
              selectedValue={deckId ? (deckId as string) : undefined}
              onValueChange={(value) => {
                setDeckId(value as string);
                if (errorText.deckNameErr)
                  setErrorText((prevErrors) => ({
                    ...prevErrors,
                    deckNameErr: INITIAL_ERRORS.deckNameErr,
                  }));
                if (value) {
                  const deckData = getDeckData(value as string);
                  setSourceLanguage(deckData?.source_language ?? "");
                  setTargetLanguage(deckData?.target_language ?? "");
                }
              }}
              primaryColor={theme.colors.purple}
              isMultiple={false}
              isSearchable={true}
              dropdownStyle={{
                ...styles.dropdown,
                borderColor: errorText.deckNameErr
                  ? theme.colors.error
                  : theme.colors.primary,
              }}
              dropdownContainerStyle={{ marginBottom: 0 }}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedItemStyle={{ color: theme.colors.primary }}
              dropdownIconStyle={styles.dropdownIcon}
              dropdownIcon={
                <Octicons
                  name="chevron-down"
                  size={24}
                  color={theme.colors.primary}
                />
              }
              searchControls={{
                textInputStyle: styles.dropdowntextInput,
                textInputProps: { placeholderTextColor: theme.colors.primary },
              }}
              modalControls={{
                modalOptionsContainerStyle: {
                  backgroundColor: theme.colors.background,
                },
              }}
              checkboxControls={{
                checkboxUnselectedColor: theme.colors.background,
                checkboxStyle: { borderColor: theme.colors.primary },
                checkboxLabelStyle: { color: theme.colors.primary },
              }}
              listEmptyComponent={
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontFamily: theme.fontFamily.regular,
                    }}
                  >
                    No options available
                  </Text>
                </View>
              }
            />
            {errorText.deckNameErr ? (
              <Text
                style={[
                  styles.optionalText,
                  { color: theme.colors.error, paddingTop: 5 },
                ]}
              >
                {errorText.deckNameErr}
              </Text>
            ) : null}

            <Text style={styles.formText}>Card type</Text>
            <DropdownSelect
              placeholder="Select card type"
              options={CARD_TYPE_OPTIONS}
              selectedValue={cardType ? (cardType as CardType) : undefined}
              onValueChange={(value) => {
                setCardType(value as CardType);
                if (errorText.cardTypeErr)
                  setErrorText((prevErrors) => ({
                    ...prevErrors,
                    cardTypeErr: INITIAL_ERRORS.cardTypeErr,
                  }));
              }}
              disabled={isEditMode}
              dropdownHelperTextStyle={{
                color: theme.colors.primary,
                fontFamily: theme.fontFamily.regular,
              }}
              primaryColor={theme.colors.purple}
              isMultiple={false}
              isSearchable={false}
              dropdownStyle={{
                ...(isEditMode ? styles.dropdown : styles.dropdownDisabled),
                borderColor: errorText.cardTypeErr
                  ? theme.colors.error
                  : isEditMode
                    ? theme.colors.grey
                    : theme.colors.primary,
              }}
              dropdownContainerStyle={{ marginBottom: 0 }}
              placeholderStyle={
                isEditMode
                  ? styles.dropdownPlaceholderDisabled
                  : styles.dropdownPlaceholder
              }
              selectedItemStyle={{ color: theme.colors.primary }}
              dropdownIconStyle={styles.dropdownIcon}
              dropdownIcon={
                <Octicons
                  name="chevron-down"
                  size={24}
                  color={isEditMode ? theme.colors.grey : theme.colors.primary}
                />
              }
              modalControls={{
                modalOptionsContainerStyle: {
                  backgroundColor: theme.colors.background,
                },
              }}
              checkboxControls={{
                checkboxUnselectedColor: theme.colors.background,
                checkboxStyle: { borderColor: theme.colors.primary },
                checkboxLabelStyle: { color: theme.colors.primary },
              }}
            />
            {errorText.cardTypeErr ? (
              <Text
                style={[
                  styles.optionalText,
                  { color: theme.colors.error, paddingTop: 5 },
                ]}
              >
                {errorText.cardTypeErr}
              </Text>
            ) : null}

            {isEditMode ? (
              <Text
                style={[
                  styles.optionalText,
                  {
                    alignSelf: "flex-start",
                    color: theme.colors.primary,
                    lineHeight: 20,
                    paddingTop: 10,
                  },
                ]}
              >
                {isEditMode
                  ? "Card type cannot be changed after creation."
                  : null}
              </Text>
            ) : null}

            <View style={styles.inputTextContainer}>
              <Text style={styles.formText}>Front</Text>
              {sourceLanguage !== "" ? (
                <Text style={[styles.optionalText, { paddingTop: 10 }]}>
                  ({sourceLanguage})
                </Text>
              ) : null}
            </View>
            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: errorText.cardFrontErr
                    ? theme.colors.error
                    : theme.colors.primary,
                },
              ]}
              multiline={true}
              value={cardFront}
              maxLength={100}
              onChangeText={(input) => {
                setCardFront(input);
                if (errorText.cardFrontErr)
                  setErrorText((prevErrors) => ({
                    ...prevErrors,
                    cardFrontErr: INITIAL_ERRORS.cardFrontErr,
                  }));
              }}
            />
            {errorText.cardFrontErr ? (
              <Text
                style={[
                  styles.optionalText,
                  { color: theme.colors.error, paddingTop: 5 },
                ]}
              >
                {errorText.cardFrontErr}
              </Text>
            ) : null}
            <View style={styles.inputTextContainer}>
              <Text style={styles.formText}>Back</Text>
              {targetLanguage !== "" ? (
                <Text style={[styles.optionalText, { paddingTop: 10 }]}>
                  ({targetLanguage})
                </Text>
              ) : null}
            </View>

            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: errorText.cardBackErr
                    ? theme.colors.error
                    : theme.colors.primary,
                },
              ]}
              multiline={true}
              value={cardBack}
              maxLength={100}
              onChangeText={(input) => {
                setCardBack(input);
                if (errorText.cardBackErr)
                  setErrorText((prevErrors) => ({
                    ...prevErrors,
                    cardBackErr: INITIAL_ERRORS.cardBackErr,
                  }));
                if (errorText.AIGeneratingError)
                  setErrorText((prevErrors) => ({
                    ...prevErrors,
                    AIGeneratingError: INITIAL_ERRORS.AIGeneratingError,
                  }));
              }}
            />
            {errorText.cardBackErr ? (
              <Text
                style={[
                  styles.optionalText,
                  { color: theme.colors.error, paddingTop: 5 },
                ]}
              >
                {errorText.cardBackErr}
              </Text>
            ) : null}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 10,
              }}
            >
              <Text style={[styles.formText, { paddingTop: 0 }]}>
                Example of use
              </Text>
              <Text style={styles.optionalText}>(Optional)</Text>
            </View>

            <TextInput
              style={[
                styles.textInput,
                {
                  borderColor: targetLanguage
                    ? theme.colors.purple
                    : theme.colors.primary,
                  height: 70,
                  textAlignVertical: "top",
                },
              ]}
              editable={!isAIthinking}
              multiline={true}
              value={usageExample}
              maxLength={150}
              onChangeText={(input) => {
                setUsageExample(input);
                setExampleSource("user");
                if (errorText.AIGeneratingError)
                  setErrorText((prevErrors) => ({
                    ...prevErrors,
                    AIGeneratingError: INITIAL_ERRORS.AIGeneratingError,
                  }));
              }}
            />
            {errorText.AIGeneratingError ? (
              <Text
                style={[
                  styles.optionalText,
                  { color: theme.colors.error, paddingTop: 5 },
                ]}
              >
                {errorText.AIGeneratingError}
              </Text>
            ) : null}
            {targetLanguage ? (
              <Pressable
                disabled={isAIthinking ? true : false}
                style={styles.genwithAIContent}
                onPress={async () => {
                  setErrorText((prevErrors) => ({
                    ...prevErrors,
                    AIGeneratingError: INITIAL_ERRORS.AIGeneratingError,
                  }));
                  if (!cardBack || cardBack.trim() === "") {
                    setErrorText((prevErrors) => ({
                      ...prevErrors,
                      cardBackErr: "Back of the card cannot be empty.",
                    }));
                    return;
                  }
                  setIsAIThinking(true);
                  try {
                    const exampleSentence = await generateSentence(
                      targetLanguage,
                      cardBack,
                    );
                    if (exampleSentence["isValid"] === false) {
                      if (exampleSentence["errorReason"] === "gibberish") {
                        setErrorText((prevErrors) => ({
                          ...prevErrors,
                          AIGeneratingError:
                            "This doesn't look like a valid word or expression. Please check for typos and try again.",
                        }));
                      } else if (
                        exampleSentence["errorReason"] === "wrong_language"
                      ) {
                        setErrorText((prevErrors) => ({
                          ...prevErrors,
                          AIGeneratingError: `Please ensure your term or expression is in the target language (${targetLanguage}).`,
                        }));
                      } else if (
                        exampleSentence["errorReason"] === "wrong_length"
                      ) {
                        setErrorText((prevErrors) => ({
                          ...prevErrors,
                          AIGeneratingError:
                            "Please enter a single word or a short expression (max 5 words) rather than a full sentence.",
                        }));
                      }
                    } else {
                      setUsageExample(exampleSentence["sentence"]);
                      setExampleSource("ai");
                    }
                  } catch (error: any) {
                    switch (error.message) {
                      case "quota_exceeded":
                        if (Platform.OS === "android") {
                          ToastAndroid.show(
                            "Too many requests",
                            ToastAndroid.SHORT,
                          );
                        }
                        break;
                      case "api_error":
                        if (Platform.OS === "android") {
                          ToastAndroid.show("API Error", ToastAndroid.SHORT);
                        }
                        break;
                    }
                  } finally {
                    setIsAIThinking(false);
                  }
                }}
              >
                <SimpleLineIcons
                  name="magic-wand"
                  size={24}
                  color={theme.colors.purple}
                  style={{
                    textShadowRadius: 30,
                    textShadowColor: theme.colors.purple_alpha,
                  }}
                />
                <Text
                  style={[
                    styles.formText,
                    {
                      paddingHorizontal: 10,
                      color: theme.colors.purple,
                      textShadowRadius: 30,
                      textShadowColor: theme.colors.purple_alpha,
                    },
                  ]}
                >
                  {isAIthinking ? "Generating..." : " Generate with AI "}
                </Text>
              </Pressable>
            ) : null}

            {/* <Text style={[styles.formText, { paddingTop: 0 }]}>Tags</Text>
          <DropdownSelect
            placeholder="Add tags"
            options={[]}
            selectedValue={undefined}
            onValueChange={() => {}}
            primaryColor={theme.colors.purple}
            isMultiple={true}
            isSearchable={true}
            dropdownStyle={{
              ...styles.dropdown,
              borderColor: errorText.deckNameErr
                ? theme.colors.error
                : theme.colors.primary,
            }}
            dropdownContainerStyle={{ marginBottom: 10 }}
            placeholderStyle={styles.dropdownPlaceholder}
            selectedItemStyle={{ color: theme.colors.primary }}
            dropdownIconStyle={styles.dropdownIcon}
            dropdownIcon={
              <Octicons
                name="chevron-down"
                size={24}
                color={theme.colors.primary}
              />
            }
            searchControls={{
              textInputStyle: styles.dropdowntextInput,
              textInputProps: { placeholderTextColor: theme.colors.primary },
            }}
            modalControls={{
              modalOptionsContainerStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
            checkboxControls={{
              checkboxUnselectedColor: theme.colors.background,
              checkboxStyle: { borderColor: theme.colors.primary },
              checkboxLabelStyle: { color: theme.colors.primary },
            }}
            listEmptyComponent={
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    color: theme.colors.primary,
                    fontFamily: theme.fontFamily.regular,
                  }}
                >
                  No options available
                </Text>
              </View>
            }
          /> */}
          </KeyboardAwareScrollView>
        )}
        <View style={styles.buttonContainer}>
          <ConfirmationButton
            buttonText="Save"
            onPress={onSavePress}
            style={{ boxShadow: "" }}
          ></ConfirmationButton>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: "100%",
      flex: 1,
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      width: "100%",
      paddingHorizontal: 20,
    },
    formText: {
      paddingTop: 10,
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.sm,
      color: theme.colors.primary,
    },
    dropdown: {
      height: 50,
      minHeight: 45,
      paddingVertical: 0,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
    textInput: {
      paddingHorizontal: 10,
      minHeight: 50,
      maxHeight: 80,
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.regular,
    },
    genwithAIContent: {
      maxHeight: 45,
      paddingTop: 5,
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonContainer: {
      height: 100,
      width: "100%",
      paddingHorizontal: 20,
      paddingTop: 10,
      backgroundColor: theme.colors.background,
      boxShadow: theme.boxShadow.bottomContainer,
    },
    optionalText: {
      paddingHorizontal: 5,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary_light,
    },
    dropdownPlaceholder: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.regular,
    },
    dropdownIcon: {
      top: "50%",
      right: 15,
      paddingRight: 0,
      transform: [{ translateY: -12 }], //I had to use translate as dropdown library doesn't allow to use other props to align dropdown icon to center
    },
    dropdowntextInput: {
      height: 50,
      minHeight: 45,
      paddingVertical: 0,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.background,
      color: theme.colors.primary,
      borderColor: theme.colors.primary,
      fontFamily: theme.fontFamily.regular,
      borderRadius: theme.borderRadius.sm,
    },
    inputTextContainer: {
      flexDirection: "row",
      alignSelf: "flex-start",
      alignItems: "center",
    },
    dropdownDisabled: {
      height: 50,
      minHeight: 45,
      paddingVertical: 0,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      borderColor: theme.colors.grey,
      backgroundColor: theme.colors.background,
    },
    dropdownPlaceholderDisabled: {
      color: theme.colors.grey,
      fontFamily: theme.fontFamily.regular,
    },
  });
