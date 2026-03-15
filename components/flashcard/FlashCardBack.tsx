import { theme } from "@/styles/theme";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  backText: string;
  exampleSentence: string;
  AIgenerated?: boolean;
};
export default function FlashCardBack({ backText, exampleSentence, AIgenerated=false }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.separator}></View>
      <Text style={styles.backText}>{backText}</Text>
      <Text style={[styles.backTextSentence, {color: AIgenerated? theme.colors.purple : theme.colors.pink}]}>
        {exampleSentence}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    width: "100%",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    backgroundColor: theme.colors.grey,
    borderRadius: theme.borderRadius.lg,
  },
  backText: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.lg,
    alignSelf: "center",
  },
  backTextSentence: {
    paddingTop: 10,
    fontFamily: theme.fontFamily.italic,
    fontSize: theme.fontSize.sm,
    alignSelf: "center",
  },
});
