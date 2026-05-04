import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { ExampleSource } from "@/models/card";
import { CARD_TYPE_OPTIONS } from "@/models/CardTypes";
import { Deck } from "@/models/deck";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useFocusEffect } from "expo-router";
import { useCallback, useContext, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import DropdownSelect from "react-native-input-select";
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
  });

  const [deckDropdownOpen, setDeckDropdownOpen] = useState(false);
  const [cardTypeDropdownOpen, setCardTypeDropdownOpen] = useState(false);
  const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false);

  const [cardType, setCardType] = useState(INITIAL_VALUES.cardType);
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

  const session = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      const user_id = session?.currentSession?.user.id;
      if (!user_id) return;
      globalDeckRepository.getDecks(user_id).then((decks) => {
        return setRawDecks(decks);
      });
    }, [session?.currentSession?.user.id]),
  );

  const formattedOptions = rawDecks
    .map((deck: Deck) => {
      return { label: deck.name, value: deck.id };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  const getDeckData = (deck_id: string) => {
    return rawDecks.find((deck) => deck.id === deck_id);
  };

  const setDefaultStates = () => {
    setDeckId(INITIAL_VALUES.deckId);
    setCardType(INITIAL_VALUES.cardType);
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
    try {
      await globalCardRepository.createNewCard(cardData);
      setDefaultStates();
      if (Platform.OS === "android")
        ToastAndroid.show("Card added!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error during creating new card", error);
    }
  };

  return (
    <SafeAreaProvider>
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
                console.log(deckData);
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
            selectedValue={cardType ? (cardType as string) : undefined}
            onValueChange={(value) => {
              setCardType(value as string);
              if (errorText.cardTypeErr)
                setErrorText((prevErrors) => ({
                  ...prevErrors,
                  cardTypeErr: INITIAL_ERRORS.cardTypeErr,
                }));
            }}
            primaryColor={theme.colors.purple}
            isMultiple={false}
            isSearchable={false}
            dropdownStyle={{
              ...styles.dropdown,
              borderColor: errorText.cardTypeErr
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
            onFocus={() => {
              setDeckDropdownOpen(false);
              setCardTypeDropdownOpen(false);
              setTagsDropdownOpen(false);
            }}
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
            onFocus={() => {
              setDeckDropdownOpen(false);
              setCardTypeDropdownOpen(false);
              setTagsDropdownOpen(false);
            }}
            onChangeText={(input) => {
              setCardBack(input);
              if (errorText.cardBackErr)
                setErrorText((prevErrors) => ({
                  ...prevErrors,
                  cardBackErr: INITIAL_ERRORS.cardBackErr,
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
                borderColor: theme.colors.purple,
                height: 70,
                textAlignVertical: "top",
              },
            ]}
            multiline={true}
            value={usageExample}
            maxLength={150}
            onFocus={() => {
              setDeckDropdownOpen(false);
              setCardTypeDropdownOpen(false);
              setTagsDropdownOpen(false);
            }}
            onChangeText={(input) => {
              setUsageExample(input);
            }}
          />
          <Pressable style={styles.genwithAIContent}>
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
              {" Generate with AI "}
            </Text>
          </Pressable>
          <Text style={[styles.formText, { paddingTop: 0 }]}>Tags</Text>
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
          />
        </ScrollView>
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
  });
