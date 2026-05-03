import { themeOption, useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { StyleSheet, Text, View } from "react-native";
import DropdownSelect from "react-native-input-select";

export default function SettingsOptionRow() {
  const { theme, setPreferredTheme, preferredTheme } = useAppTheme();
  const styles = createStyles(theme);
  const THEME_OPTIONS = [
    { label: "System", value: "system" },
    { label: "Dark", value: "dark" },
    { label: "Light", value: "light" },
  ];
  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainText}>Theme</Text>
      <DropdownSelect
        options={THEME_OPTIONS}
        selectedValue={preferredTheme}
        onValueChange={(value) => {
          setPreferredTheme(value as themeOption);
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
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      paddingVertical: 20,
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    mainText: {
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.md,
      color: theme.colors.primary,
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
  });
