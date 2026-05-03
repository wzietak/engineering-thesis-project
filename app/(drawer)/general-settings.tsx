import SettingsOptionRow from "@/components/SettingsOptionRow";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function generalSettings() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <ScrollView style={styles.scrollContainer}>
      <SettingsOptionRow></SettingsOptionRow>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
      flex: 1,
      backgroundColor: theme.colors.background
    },
  });
