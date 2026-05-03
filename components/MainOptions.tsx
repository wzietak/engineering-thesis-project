import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ToggleButton from "./ToggleButton";

type Props = {
  visible: boolean;
  hideOnOutline: () => void;
  variant?: string;
};

export default function MainOptions({ visible, hideOnOutline }: Props) {
  const { theme, setPreferredTheme, actualTheme } = useAppTheme();
  const styles = createStyles(theme);
  if (!visible) {
    return null;
  }
  return (
    <Modal
      transparent={true}
      animationType="fade"
      navigationBarTranslucent={true}
      statusBarTranslucent={true}
    >
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={1}
        onPress={() => hideOnOutline()}
      >
        <View
          style={styles.mainOptionsComponent}
          onStartShouldSetResponder={() => true}
        >
          <View style={styles.mainOptionsContainer}>
            <Pressable style={styles.menuOptionToggle}>
              <Text style={styles.menuOptionText}>App theme</Text>
              <ToggleButton
                value={actualTheme === "light" ? true : false}
                onValueChange={() => {
                  actualTheme === "light"
                    ? setPreferredTheme("dark")
                    : setPreferredTheme("light");
                }}
              ></ToggleButton>
            </Pressable>

            <Pressable style={styles.menuOption}>
              <Octicons
                style={styles.menuIcon}
                name="download"
                size={22}
                color="black"
              />
              <Text style={styles.menuOptionText}>Import</Text>
            </Pressable>

            <Pressable style={styles.menuOption}>
              <Octicons
                style={styles.menuIcon}
                name="share"
                size={22}
                color="black"
              />
              <Text style={styles.menuOptionText}>Export</Text>
            </Pressable>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainOptionsComponent: {
      width: 190,
      height: 130,
      position: "absolute",
      right: "5%",
      top: 95,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background,
      boxShadow: theme.boxShadow.buttons,
    },
    touchable: {
      flex: 1,
    },
    mainOptionsContainer: {
      paddingHorizontal: 10,
      flex: 1,
      flexDirection: "column",
    },
    menuOption: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    menuOptionToggle: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    menuOptionText: {
      paddingRight: 10,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary,
    },
    menuIcon: {
      paddingRight: 8,
      color: theme.colors.primary,
    },
  });
