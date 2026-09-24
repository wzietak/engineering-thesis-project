import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text } from "react-native";

type Props = {
  onPress: () => void;
  isSyncing: boolean;
};

export default function SyncPill({ onPress, isSyncing }: Props) {
  const { theme, setPreferredTheme, preferredTheme } = useAppTheme();
  const styles = createStyles(theme);

  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSyncing) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinValue.stopAnimation();
      spinValue.setValue(0);
    }
  }, [isSyncing, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Pressable
      style={styles.SyncButtonPill}
      onPress={onPress}
      disabled={isSyncing}
    >
      <Text style={styles.textStyle}>
        {isSyncing ? "Syncing..." : "Sync now"}
      </Text>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Octicons name="sync" size={20} color={theme.colors.primary} />
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    SyncButtonPill: {
      height: 45,
      marginHorizontal: 4,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.purple_alpha,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.borderRadius.md,
      borderColor: theme.colors.primary,
      borderWidth: 1,
      gap: 8,
    },
    textStyle: {
      fontFamily: theme.fontFamily.bold,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary,
      paddingVertical: 10,
    },
  });
