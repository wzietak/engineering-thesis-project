import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import { ExampleSource } from "@/models/card";
import { CARD_TYPE_OPTIONS } from "@/models/cardTypes";
import { globalCardRepository } from "@/repositories/globalCardRepository";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { theme } from "@/styles/theme";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const [deckId, setDeckId] = useState<null | number>(INITIAL_VALUES.deckId);
  const [tags, setTags] = useState(INITIAL_VALUES.tags);
  const [cardFront, setCardFront] = useState(INITIAL_VALUES.front);
  const [cardBack, setCardBack] = useState(INITIAL_VALUES.back);
  const [usageExample, setUsageExample] = useState(INITIAL_VALUES.usageExample);
  const [exampleSource, setExampleSource] = useState<ExampleSource>(
    INITIAL_VALUES.exampleSource,
  );

  const [items, setItems] = useState([{}]);
  const [decks, setDecks] = useState<{ label: string; value: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      globalDeckRepository.getDecks().then((decks) => {
        const formattedOptions = decks.map((deck) => {
          return { label: deck.name, value: deck.id };
        });
        setDecks(formattedOptions);
      });
    }, []),
  );

  const setDefaultStates = () => {
    setDeckId(INITIAL_VALUES.deckId);
    setCardType(INITIAL_VALUES.cardType);
    setCardFront(INITIAL_VALUES.front);
    setCardBack(INITIAL_VALUES.back);
    setTags(INITIAL_VALUES.tags);
    setErrorText(INITIAL_ERRORS);
  };

  const onSavePress = async () => {
    let isFormValid = true;
    if (deckId === null) {
      isFormValid = false;
      setErrorText((prevErrors) => ({
        ...prevErrors,
        deckNameErr: "Deck selection is required.",
      }));
    }
    if (cardType === "") {
      isFormValid = false;
      setErrorText((prevErrors) => ({
        ...prevErrors,
        cardTypeErr: "Card type selection is required.",
      }));
    }
    if (!cardFront.trim()) {
      isFormValid = false;
      setErrorText((prevErrors) => ({
        ...prevErrors,
        cardFrontErr: "Front of the card cannot be empty.",
      }));
    }
    if (!cardBack.trim()) {
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
      deckId: deckId,
      cardType: cardType,
      front: cardFront,
      back: cardBack,
      usageExample: usageExample,
      exampleSource: exampleSource,
      tags: [],
    };
    try {
      await globalCardRepository.createNewCard(cardData);
      setDefaultStates();
    } catch (error) {
      console.error("Error during creating new card", error);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.formText, { paddingTop: 0 }]}>Deck</Text>
        <DropDownPicker
          open={deckDropdownOpen}
          value={deckId}
          items={decks}
          setOpen={setDeckDropdownOpen}
          setValue={setDeckId}
          setItems={setDecks}
          onOpen={() => {
            Keyboard.dismiss;
            setTagsDropdownOpen(false);
            setCardTypeDropdownOpen(false);
          }}
          style={[
            styles.dropdown,
            {
              borderColor: errorText.deckNameErr ? "red" : theme.colors.primary,
            },
          ]}
          zIndex={10000}
          listMode="SCROLLVIEW"
          onChangeValue={() => {
            setDeckId(deckId);
            if (errorText.deckNameErr)
              setErrorText((prevErrors) => ({
                ...prevErrors,
                deckNameErr: INITIAL_ERRORS.deckNameErr,
              }));
          }}
        />
        {errorText.deckNameErr ? (
          <Text style={[styles.optionalText, { color: "red", paddingTop: 5 }]}>
            {errorText.deckNameErr}
          </Text>
        ) : null}

        <Text style={styles.formText}>Card type</Text>
        <DropDownPicker
          open={cardTypeDropdownOpen}
          value={cardType}
          items={CARD_TYPE_OPTIONS}
          setOpen={setCardTypeDropdownOpen}
          setValue={setCardType}
          onOpen={() => {
            Keyboard.dismiss;
            setDeckDropdownOpen(false);
            setTagsDropdownOpen(false);
          }}
          style={[
            styles.dropdown,
            {
              borderColor: errorText.cardTypeErr ? "red" : theme.colors.primary,
            },
          ]}
          listMode="SCROLLVIEW"
          onChangeValue={() => {
            setCardType(cardType);
            if (errorText.cardTypeErr)
              setErrorText((prevErrors) => ({
                ...prevErrors,
                cardTypeErr: INITIAL_ERRORS.cardTypeErr,
              }));
          }}
        />
        {errorText.cardTypeErr ? (
          <Text style={[styles.optionalText, { color: "red", paddingTop: 5 }]}>
            {errorText.deckNameErr}
          </Text>
        ) : null}

        <Text style={styles.formText}>Front</Text>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: errorText.cardFrontErr
                ? "red"
                : theme.colors.primary,
            },
          ]}
          value={cardFront}
          maxLength={50}
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
          <Text style={[styles.optionalText, { color: "red", paddingTop: 5 }]}>
            {errorText.cardFrontErr}
          </Text>
        ) : null}
        <Text style={styles.formText}>Back</Text>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: errorText.cardBackErr ? "red" : theme.colors.primary,
            },
          ]}
          value={cardBack}
          maxLength={50}
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
          <Text style={[styles.optionalText, { color: "red", paddingTop: 5 }]}>
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
          maxLength={100}
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
        <DropDownPicker
          open={tagsDropdownOpen}
          value={tags}
          items={items}
          setOpen={setTagsDropdownOpen}
          setValue={setTags}
          setItems={setItems}
          multiple={true}
          onOpen={() => {
            Keyboard.dismiss;
            setDeckDropdownOpen(false);
            setCardTypeDropdownOpen(false);
          }}
          style={[styles.dropdown, { marginBottom: 30 }]}
          listMode="SCROLLVIEW"
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <ConfirmationButton
          buttonText="Save"
          onPress={onSavePress}
        ></ConfirmationButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  formText: {
    paddingTop: 10,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.sm,
  },
  dropdown: {
    height: 45,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.primary,
  },
  textInput: {
    paddingHorizontal: 10,
    minHeight: 45,
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
});
