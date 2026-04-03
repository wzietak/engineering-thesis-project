import { theme } from "@/styles/theme";
import { Link, Stack } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Image source={require("@/assets/images/potato.png")} style={{height: 150, width: 150}}></Image>
        <Text style={[styles.text, { paddingTop: 20, paddingBottom: 10 }]}>Sorry!</Text>
        <Text style={[styles.text, { fontSize: theme.fontSize.md }]}>
          There is nothing here but a potato.
        </Text>
        <Link href={"/"} style={styles.button} replace>
          Go back
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    paddingBottom: 50,
    fontSize: theme.fontSize.lg,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    fontFamily: theme.fontFamily.bold,
    fontSize: theme.fontSize.lg,
    color: theme.colors.purple,
  },
});
