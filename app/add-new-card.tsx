import { CARD_TYPE_OPTIONS } from "@/models/cardTypes";
import { MockDeckRepository } from "@/repositories/MockDeckRepository";
import { theme } from "@/styles/theme";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { useEffect, useState } from "react";
import {
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

export default function AddNewCard() {
  const insets = useSafeAreaInsets();

  const [openDeckDropdown, setOpenDeckDropdown] = useState(false);
  const [openCardTypeDropdown, setOpenCardTypeDropdown] = useState(false);
  const [openTagsDropdown, setOpenTagsDropdown] = useState(false);

  const [cardTypeValue, setCardTypeValue] = useState(null);
  const [deckNameValue, setDeckNameValue] = useState(null);
  const [tagsValue, setTagsValue] = useState(null);

  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
  ]);

  const [decks, setDecks] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    const decksRepository = new MockDeckRepository();
    decksRepository.getDecks().then((decks) => {
      const formattedOptions = decks.map((deck) => {
        return { label: deck.name, value: deck.id };
      });
      setDecks(formattedOptions);
    });
  }, []);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.formText, { paddingTop: 0 }]}>Deck</Text>
        <DropDownPicker
          open={openDeckDropdown}
          value={deckNameValue}
          items={decks}
          setOpen={setOpenDeckDropdown}
          setValue={setDeckNameValue}
          setItems={setDecks}
          disabled={false}
          style={styles.dropdown}
          zIndex={10000}
          listMode="SCROLLVIEW"
        />

        <Text style={styles.formText}>Card type</Text>
        <DropDownPicker
          open={openCardTypeDropdown}
          value={cardTypeValue}
          items={CARD_TYPE_OPTIONS}
          setOpen={setOpenCardTypeDropdown}
          setValue={setCardTypeValue}
          style={styles.dropdown}
          listMode="SCROLLVIEW"
        />

        <Text style={styles.formText}>Front</Text>
        <TextInput style={styles.textInput} />
        <Text style={styles.formText}>Back</Text>
        <TextInput style={styles.textInput} />
        <Text style={styles.formText}>Example of use</Text>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: theme.colors.purple,
              height: 80,
              textAlignVertical: "top",
            },
          ]}
          multiline={true}
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
          open={openTagsDropdown}
          value={tagsValue}
          items={items}
          setOpen={setOpenTagsDropdown}
          setValue={setTagsValue}
          setItems={setItems}
          multiple={true}
          style={[styles.dropdown, { marginBottom: 30 }]}
		  listMode="SCROLLVIEW"
        />
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.buttonPressable]}>
          <Text style={styles.buttonText}>Save</Text>
        </Pressable>
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
  buttonPressable: {
    maxHeight: 60,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.boxShadow.buttons,
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    alignSelf: "center",
    color: theme.colors.background,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.lg,
  },
});
