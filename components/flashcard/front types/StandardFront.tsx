import { theme } from "@/styles/theme";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  frontText: string;
  style?: ViewStyle;
};

export default function StandardFront({ frontText, style }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.frontText}>{frontText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
    alignItems: "center",
  },
  frontText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.lg,
  },
});
