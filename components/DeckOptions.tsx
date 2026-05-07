import { useAppTheme } from "@/contexts/ColorThemeContext";
import { useFadeAnimation } from "@/hooks/useFadeAnimation";
import { AppTheme } from "@/styles/theme";
import { useEffect } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  isVisible: boolean;
  positionTop: number;
  onEditPress: () => void;
  onDeletePress: () => void;
};

export default function DeckOptions({
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
        <Text style={styles.menuOptionText}>Edit deck</Text>
      </Pressable>
      <View style={styles.separator}></View>
      <Pressable style={styles.menuOption} onPress={onDeletePress}>
        <Text style={styles.menuOptionText}>Delete deck</Text>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      right: 20,
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
      justifyContent: "flex-start",
      alignItems: "center",
    },
    menuOptionText: {
      paddingRight: 10,
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
