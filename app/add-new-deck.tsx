import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import { DECK_LANGUAGES } from "@/models/deckLanguages";
import { theme } from "@/styles/theme";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {};

export default function addNewDeck() {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Text style={styles.formText}>Deck name</Text>
      <TextInput style={styles.textInput} />
      <View style={styles.dropdownTextContainer}>
        <Text style={styles.formText}>Deck language</Text>
        <Text style={styles.optionalText}>(Optional)</Text>
      </View>

      <DropDownPicker
        open={open}
        value={value}
        items={DECK_LANGUAGES}
        setOpen={setOpen}
        setValue={setValue}
        placeholder="Select language"
        style={[styles.dropdown, { marginBottom: 10 }]}
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
        Select a target language to unlock AI-powered example sentences for this
        deck.
      </Text>
      <ConfirmationButton
        buttonText="Save"
        style={{
          position: "absolute",
          width: "100%",
          bottom: insets.bottom + 40,
        }}
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
  },
  textInput: {
    paddingHorizontal: 10,
    minHeight: 45,
    width: "100%",
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.regular,
  },
});
