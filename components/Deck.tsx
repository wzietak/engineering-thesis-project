import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme, theme } from "@/styles/theme";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

type Props = {
  label: string;
  cardsDue: number;
  backgroundColor?: string;
  style?: ViewStyle;
  onPress?: () => void;
  onLongPress?: () => void;
};

export default function DeckComponent({
  label,
  cardsDue,
  backgroundColor = theme.colors.blue,
  style,
  onPress,
  onLongPress,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <View style={[styles.deckContainer, { backgroundColor }, style]}>
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.deckPressable}
      >
        <Text style={styles.deckNameText}>{label}</Text>
        <Text style={styles.deckTextCardsDue}>{cardsDue} cards due</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    deckContainer: {
      marginVertical: 5,
      flex: 1,
      padding: 13,
      minHeight: 120,
      maxHeight: 140,
      borderRadius: theme.borderRadius.sm,
      flexDirection: "row",
    },
    deckPressable: {
      width: "100%",
      justifyContent: "space-between",
    },
    deckNameText: {
      paddingLeft: 2,
      color: "black",
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bold,
    },
    deckTextCardsDue: {
      color: "black",
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bold,
      alignSelf: "flex-end",
    },
  });
