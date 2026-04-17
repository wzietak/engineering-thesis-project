import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import { AuthContext } from "@/contexts/AuthContext";
import { DECK_LANGUAGES } from "@/models/deckLanguages";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { theme } from "@/styles/theme";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function addNewDeck() {
  const insets = useSafeAreaInsets();
  const session = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [deckName, setDeckName] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const DROPDOWN_ITEMS = [{ label: "None", value: "" }, ...DECK_LANGUAGES];

  const onSavePress = async () => {
    if (!deckName.trim()) {
      setErrorText("Deck name cannot be empty.");
      return;
    }
    const deckData = {
      name: deckName.trim(),
      language: selectedLanguage,
      user_id: session?.currentSession?.user.id as string
    };
    try {
      await globalDeckRepository.createNewDeck(deckData);
      router.back();
      if (Platform.OS === "android")
        ToastAndroid.show("New deck created!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error during creating new deck", error);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Although there is too little element make this a real scrollView, 
      I used ScrollView for the property 'keyboardShouldPersistTaps' which 
      enables more intuitive handling touches outside of the UI elements 
      and closing keyboard/other elements */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Text style={styles.formText}>Deck name</Text>
        <TextInput
          style={[
            styles.textInput,
            { borderColor: errorText ? "red" : theme.colors.primary },
          ]}
          maxLength={36}
          onFocus={() => {
            setDropdownOpen(false);
          }}
          value={deckName}
          onChangeText={(input) => {
            setDeckName(input);
            if (errorText) setErrorText("");
          }}
        />
        {errorText ? (
          <Text style={[styles.optionalText, { color: "red", paddingTop: 5 }]}>
            {errorText}
          </Text>
        ) : null}
        <View style={styles.dropdownTextContainer}>
          <Text style={styles.formText}>Deck language</Text>
          <Text style={styles.optionalText}>(Optional)</Text>
        </View>

        <DropDownPicker
          open={dropdownOpen}
          value={selectedLanguage}
          items={DROPDOWN_ITEMS}
          setOpen={setDropdownOpen}
          setValue={setSelectedLanguage}
          placeholder="Select language"
          style={[styles.dropdown, { marginBottom: 10 }]}
          listMode="SCROLLVIEW"
          onOpen={Keyboard.dismiss}
        />

        <Text
          style={[
            styles.optionalText,
            {
              alignSelf: "flex-start",
              color: theme.colors.purple,
              lineHeight: 20,
            },
          ]}
        >
          Select a target language to unlock AI-powered example sentences for
          this deck.
        </Text>
      </ScrollView>
      <ConfirmationButton
        buttonText="Save"
        style={{
          position: "absolute",
          width: "100%",
          bottom: insets.bottom + 40,
        }}
        onPress={onSavePress}
      ></ConfirmationButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  dropdownTextContainer: {
    paddingTop: 10,
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  formText: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.sm,
    alignSelf: "flex-start",
  },
  optionalText: {
    paddingHorizontal: 5,
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.x_sm,
    color: theme.colors.primary_light,
  },
  dropdown: {
    height: 45,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.primary,
    overflow: "hidden",
    justifyContent: "center",
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
});
