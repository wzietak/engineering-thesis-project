import { theme } from "@/styles/theme";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.appTitleText}>BetterAnki</Text>
      <Text style={styles.formText}>Email</Text>
      <TextInput style={[styles.textInput]} />
      <Text style={styles.formText}>Password</Text>
      <TextInput style={[styles.textInput]} secureTextEntry={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: theme.colors.background,
  },
  appTitleText: {
    alignSelf: "center",
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.x_lg,
  },
  formText: {
    paddingTop: 10,
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.sm,
  },
  textInput: {
    width: "100%",
    paddingHorizontal: 10,
    minHeight: 45,
    borderWidth: 1,
    borderRadius: theme.borderRadius.sm,
    borderColor: theme.colors.primary,
    color: theme.colors.primary,
    fontFamily: theme.fontFamily.regular,
  },
});
