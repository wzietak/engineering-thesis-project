import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import Octicons from "@expo/vector-icons/Octicons";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

type Props = {
  value: boolean;
  onValueChange: () => void;
};

export default function ToggleButton({ value, onValueChange }: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  const positionX = useRef(new Animated.Value(value ? 0 : 18)).current;
  const [toggleValue, setToggleValue] = useState(value);

  const toRight = () => {
    Animated.spring(positionX, {
      toValue: 18,
      useNativeDriver: true,
    }).start();
  };

  const toLeft = () => {
    Animated.spring(positionX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (value) toLeft();
    else toRight();
  }, [toggleValue]);

  return (
    <Pressable
      style={styles.track}
      onPress={() => {
        setToggleValue(!value);
        onValueChange();
      }}
    >
      <Animated.View
        style={[styles.thumb, { transform: [{ translateX: positionX }] }]}
      >
        {value === true ? (
          <Octicons name="sun" size={15} color={theme.colors.primary} />
        ) : (
          <Octicons name="moon" size={15} color={theme.colors.primary} />
        )}
      </Animated.View>
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    track: {
      width: 41,
      height: 23,
      paddingHorizontal: 2,
      borderRadius: 30,
      backgroundColor: theme.colors.blue,
      justifyContent: "center",
    },
    thumb: {
      width: 19,
      height: 19,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 4,
    },
  });
