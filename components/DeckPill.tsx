import { useAppTheme } from "@/contexts/ColorThemeContext";
import { AppTheme } from "@/styles/theme";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  deckId?: string;
  deckName?: string;
  onPress: () => void;
  backgroundCol?: string;
  textCol?: string;
};

export default function DeckPill({
  deckId,
  deckName,
  onPress,
  backgroundCol,
  textCol,
}: Props) {
  const { theme } = useAppTheme();
  const styles = createStyles(theme);
  return (
    <Pressable
      style={[
        styles.deckNamePill,
        {
          backgroundColor: backgroundCol
            ? backgroundCol
            : theme.colors.background,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.textStyle,
          { color: textCol ? textCol : theme.colors.primary },
        ]}
      >
        {" "}
        {!deckId && !deckName ? "All decks" : deckName}{" "}
      </Text>
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    deckNamePill: {
      height: 30,
      marginHorizontal: 4,
      paddingHorizontal: 10,
      backgroundColor: theme.colors.background,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.borderRadius.md,
      borderColor: theme.colors.primary,
      borderWidth: 1,
    },
    textStyle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: theme.fontSize.x_sm,
      color: theme.colors.primary,
    },
  });
