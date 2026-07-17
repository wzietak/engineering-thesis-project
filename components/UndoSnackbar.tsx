import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onUndo: () => void;
  isVisible: boolean;
};
export default function UndoSnackbar({ onUndo, isVisible }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.mainContainer,
        {
          bottom: insets.bottom + 20,
          pointerEvents: isVisible ? "auto" : "none",
          opacity: isVisible ? 1 : 0,
        },
      ]}
    >
      <Text style={styles.text}>Card deleted</Text>
      <TouchableOpacity onPress={onUndo} hitSlop={45}>
        <Text
          style={[
            styles.text,
            {
              paddingLeft: 7,
              fontFamily: theme.fontFamily.bold,
              color: "black",
            },
          ]}
        >
          UNDO
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      height: 30,
      width: 170,
      position: "absolute",
      flexDirection: "row",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.lightpurple,
      //   boxShadow: theme.boxShadow.buttons,
      borderRadius: theme.borderRadius.lg,
    },
    text: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: "black",
    },
  });
