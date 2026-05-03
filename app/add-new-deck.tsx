import ConfirmationButton from "@/components/buttons/ConfirmationButton";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { DECK_LANGUAGES } from "@/models/deckLanguages";
import { globalDeckRepository } from "@/repositories/globalDeckRepository";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { useContext, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import DropdownSelect from "react-native-input-select";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function addNewDeck() {
  const insets = useSafeAreaInsets();
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const session = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [errorText, setErrorText] = useState("");

  const [deckName, setDeckName] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("");

  const onSavePress = async () => {
    if (!deckName.trim()) {
      setErrorText("Deck name cannot be empty.");
      return;
    }
    const deckData = {
      name: deckName.trim(),
      source_language: sourceLanguage,
      target_language: targetLanguage,
      user_id: session?.currentSession?.user.id as string,
    };
    try {
      await globalDeckRepository.createNewDeck(deckData);
      router.back();
      if (Platform.OS === "android")
        ToastAndroid.show("New deck created!", ToastAndroid.SHORT);
    } catch (error: any) {
      if (error.message === "DECK_NAME_ALREADY EXISTS") {
        setErrorText("A deck with this name already exists.");
      }
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
            {
              borderColor: errorText
                ? theme.colors.error
                : theme.colors.primary,
            },
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
          <Text
            style={[
              styles.optionalText,
              { color: theme.colors.error, paddingTop: 5 },
            ]}
          >
            {errorText}
          </Text>
        ) : null}
        <View style={styles.dropdownTextContainer}>
          <Text style={styles.formText}>Deck languages</Text>
          <Text style={styles.optionalText}>(Optional)</Text>
        </View>
        <DropdownSelect
          placeholder="Source language"
          options={DECK_LANGUAGES}
          selectedValue={
            sourceLanguage ? (sourceLanguage as string) : undefined
          }
          onValueChange={(value) => {
            setSourceLanguage(value as string);
          }}
          primaryColor={theme.colors.purple}
          isMultiple={false}
          isSearchable={false}
          dropdownStyle={styles.dropdown}
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
        <DropdownSelect
          placeholder="Target language"
          options={DECK_LANGUAGES}
          selectedValue={
            targetLanguage ? (targetLanguage as string) : undefined
          }
          onValueChange={(value) => {
            setTargetLanguage(value as string);
          }}
          primaryColor={theme.colors.purple}
          isMultiple={false}
          isSearchable={false}
          dropdownStyle={styles.dropdown}
          dropdownContainerStyle={{ marginBottom: 0, marginTop: 15 }}
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

        <Text
          style={[
            styles.optionalText,
            {
              alignSelf: "flex-start",
              color: theme.colors.purple,
              lineHeight: 20,
              paddingTop: 10,
            },
          ]}
        >
          Select deck languages to unlock AI-powered example sentences for this
          deck.
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
      color: theme.colors.primary,
    },
    optionalText: {
      paddingHorizontal: 5,
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary_light,
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
      borderWidth: 1,
      borderRadius: theme.borderRadius.sm,
      borderColor: theme.colors.primary,
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.regular,
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
  });
