import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

type Props = {
  buttonText: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function ConfirmationButton({
  buttonText,
  onPress,
  style,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <Pressable style={[styles.buttonPressable, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
