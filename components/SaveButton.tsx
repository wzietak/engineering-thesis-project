import { theme } from "@/styles/theme";
import {
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    ViewStyle,
} from "react-native";

type Props = {
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function SaveButton({ onPress, style }: Props) {
  return (
    <Pressable style={[styles.buttonPressable, style]}>
      <Text style={styles.buttonText}>Save</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonPressable: {
    height: 60,
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
