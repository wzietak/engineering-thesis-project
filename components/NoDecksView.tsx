import { theme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

export default function NoDecksView() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>No decks yet</Text>
      <Text style={styles.descriptionText}>
        Tap the "+" button in the bottom corner to create your first deck.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 150,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: theme.colors.background,
  },
  titleText: {
    paddingTop: 20,
    paddingBottom: 10,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.purple,
  },
  descriptionText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.sm,
    textAlign: "center",
  },
});
