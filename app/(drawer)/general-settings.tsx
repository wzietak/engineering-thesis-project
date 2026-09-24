import SettingsOptionRow from "@/components/SettingsOptionRow";
import SyncOptionRow from "@/components/SyncOptionRow";
import { AuthContext } from "@/contexts/AuthContext";
import { useAppTheme } from "@/contexts/ColorThemeContext";
import { syncData } from "@/services/syncService";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

export default function generalSettings() {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const session = useContext(AuthContext);
  const userId = session?.currentSession?.user.id;
  if (!userId) return null;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.sectionTitleContainer}>
        <Octicons name="tools" size={20} color={theme.colors.grey} />
        <Text style={styles.sectionTitleText}>App settings</Text>
      </View>

      <SettingsOptionRow></SettingsOptionRow>
      <SyncOptionRow
        userId={userId}
      ></SyncOptionRow>
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    scrollContainer: {
      paddingHorizontal: 20,
      paddingBottom: 10,
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    sectionTitleContainer: {
      flexDirection: "row",
      flex: 1,
      gap: 5,
    },
    sectionTitleText: {
      flex: 1,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.grey,
      textTransform: "uppercase",
    },
    divider: {
      height: 1,
      width: "100%",
      marginVertical: 5,
      backgroundColor: theme.colors.grey,
    },
  });
