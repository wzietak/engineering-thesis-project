import { useAppTheme } from "@/contexts/ColorThemeContext";
import { useFadeAnimation } from "@/hooks/useFadeAnimation";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  isVisible: boolean;
  positionTop: number;
  onEditPress: () => void;
  onDeletePress: () => void;
};

export default function FlashcardOptions({
  isVisible,
  positionTop,
  onEditPress,
  onDeletePress,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const { opacity, fadeIn, fadeOut } = useFadeAnimation();

  const interpolationValues = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  useEffect(() => {
    if (isVisible) {
      fadeIn();
    } else {
      fadeOut();
    }
  }, [isVisible]);
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: opacity,
          top: positionTop,
          pointerEvents: isVisible ? "auto" : "none",
        },
      ]}
    >
      <Pressable style={styles.menuOption} onPress={onEditPress}>
        <Octicons name="pencil" size={22} color={theme.colors.primary} />
        <Text style={styles.menuOptionText}>Edit card</Text>
      </Pressable>
      <View style={styles.separator}></View>
      <Pressable style={styles.menuOption} onPress={onDeletePress}>
        <Octicons name="trash" size={22} color={theme.colors.primary} />
        <Text style={styles.menuOptionText}>Delete card</Text>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      right: 25,
      paddingVertical: 3,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.background,
      boxShadow: theme.boxShadow.buttons,
      flexDirection: "column",
      alignItems: "flex-start",
    },
    menuOption: {
      paddingVertical: 4,
      paddingHorizontal: 10,
      flex: 1,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    menuOptionText: {
      paddingHorizontal: 10,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary,
    },
    separator: {
      height: 1,
      width: "85%",
      backgroundColor: theme.colors.grey,
      alignSelf: "center",
    },
  });
